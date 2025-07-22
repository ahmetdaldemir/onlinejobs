import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { MessageType } from './entities/message.entity';
import { UsersService } from '../users/users.service';
import { AiService } from '../ai/ai.service';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8080',
      'https://onlinejobs.onrender.com',
      'https://*.onrender.com',
      /^https:\/\/.*\.onrender\.com$/,
      '*',
    ],
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, Socket>();
  private connectionCount = 0;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
    private readonly aiService: AiService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization;
      
      if (!token) {
        client.disconnect();
        return;
      }

      const testUsers = await this.usersService.findTestUsers();
      console.log('Found test users:', testUsers.length);
      console.log('Test users:', testUsers.map(u => ({ id: u.id, name: `${u.firstName} ${u.lastName}`, phone: u.phone })));
      
      if (testUsers.length === 0) {
        console.error('No test users found!');
        client.disconnect();
        return;
      }

      this.connectionCount++;
      const userIndex = (this.connectionCount - 1) % testUsers.length;
      const userId = testUsers[userIndex].id;
      
      await this.usersService.setUserOnline(userId);
      
      this.connectedUsers.set(userId, client);
      client.data.userId = userId;
      
      console.log(`User ${userId} connected (connection #${this.connectionCount})`);
      console.log('Client data after connection:', client.data);
      console.log('Connected users map:', Array.from(this.connectedUsers.entries()));
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.usersService.setUserOffline(userId).catch(error => {
        console.error('Error setting user offline:', error);
      });
      
      this.connectedUsers.delete(userId);
      this.connectionCount--;
      console.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { receiverId: string; content: string; type?: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const senderId = client.data.userId;
      
      // Debug bilgileri
      console.log('=== MESAJ GÖNDERME DEBUG ===');
      console.log('Client data:', client.data);
      console.log('Gönderici ID:', senderId);
      console.log('Alıcı ID:', data.receiverId);
      console.log('Mesaj içeriği:', data.content);
      console.log('Bağlı kullanıcılar:', Array.from(this.connectedUsers.keys()));
      console.log('Alıcı bağlı mı:', this.connectedUsers.has(data.receiverId));
      
      // senderId kontrolü
      if (!senderId) {
        console.error('HATA: senderId null!');
        client.emit('message_error', { error: 'Gönderici ID bulunamadı. Lütfen yeniden bağlanın.' });
        return;
      }
      
      if (!data.receiverId) {
        console.error('HATA: receiverId null!');
        client.emit('message_error', { error: 'Alıcı ID gerekli.' });
        return;
      }
      
      let messageType = MessageType.TEXT;
      if (data.type) {
        switch (data.type.toUpperCase()) {
          case 'TEXT':
            messageType = MessageType.TEXT;
            break;
          case 'IMAGE':
            messageType = MessageType.IMAGE;
            break;
          case 'LOCATION':
            messageType = MessageType.LOCATION;
            break;
          default:
            messageType = MessageType.TEXT;
        }
      }
      
      const message = await this.messagesService.sendMessage(
        senderId,
        data.receiverId,
        data.content,
        messageType,
      );

      console.log('Mesaj veritabanına kaydedildi:', message.id);

      client.emit('message_sent', {
        id: message.id,
        content: message.content,
        receiverId: data.receiverId,
      });

      const receiverSocket = this.connectedUsers.get(data.receiverId);
      if (receiverSocket) {
        console.log('Alıcı bulundu, mesaj gönderiliyor...');
        receiverSocket.emit('new_message', {
          id: message.id,
          senderId: senderId,
          content: message.content,
          type: message.type,
          createdAt: message.createdAt,
        });

        // AI yanıtı oluştur
        try {
          const aiResponse = await this.aiService.generateResponse(data.receiverId, data.content);
          if (aiResponse) {
            const aiMessage = await this.messagesService.sendMessage(
              data.receiverId,
              senderId,
              aiResponse,
              MessageType.TEXT,
            );

            client.emit('new_message', {
              id: aiMessage.id,
              senderId: data.receiverId,
              content: aiResponse,
              type: MessageType.TEXT,
              createdAt: aiMessage.createdAt,
              isAiResponse: true,
            });

            receiverSocket.emit('new_message', {
              id: aiMessage.id,
              senderId: data.receiverId,
              content: aiResponse,
              type: MessageType.TEXT,
              createdAt: aiMessage.createdAt,
              isAiResponse: true,
            });
          }
        } catch (aiError) {
          console.error('AI response error:', aiError);
        }
      } else {
        console.log('Alıcı bağlı değil! Alıcı ID:', data.receiverId);
        client.emit('message_error', {
          error: `Alıcı (${data.receiverId}) bağlı değil. Mesaj kaydedildi ama iletilemedi.`
        });
      }
    } catch (error) {
      console.error('Send message error:', error);
      client.emit('message_error', { error: error.message });
    }
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @MessageBody() data: { otherUserId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    const roomName = this.getConversationRoomName(userId, data.otherUserId);
    
    client.join(roomName);
    console.log(`User ${userId} joined conversation with ${data.otherUserId}`);
  }

  @SubscribeMessage('leave_conversation')
  async handleLeaveConversation(
    @MessageBody() data: { otherUserId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    const roomName = this.getConversationRoomName(userId, data.otherUserId);
    
    client.leave(roomName);
    console.log(`User ${userId} left conversation with ${data.otherUserId}`);
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody() data: { receiverId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.data.userId;
    const receiverSocket = this.connectedUsers.get(data.receiverId);
    
    if (receiverSocket) {
      receiverSocket.emit('user_typing', {
        userId: senderId,
        isTyping: data.isTyping,
      });
    }
  }

  @SubscribeMessage('read_messages')
  async handleReadMessages(
    @MessageBody() data: { senderId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.data.userId;
      await this.messagesService.markConversationAsRead(data.senderId, userId);
      
      const senderSocket = this.connectedUsers.get(data.senderId);
      if (senderSocket) {
        senderSocket.emit('messages_read', {
          readerId: userId,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Read messages error:', error);
    }
  }

  @SubscribeMessage('mark_message_read')
  async handleMarkMessageRead(
    @MessageBody() data: { messageId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.data.userId;
      const message = await this.messagesService.markAsRead(data.messageId, userId);
      
      const senderSocket = this.connectedUsers.get(message.senderId);
      if (senderSocket) {
        senderSocket.emit('message_read', {
          messageId: message.id,
          readerId: userId,
          timestamp: message.readAt,
        });
      }
    } catch (error) {
      console.error('Mark message read error:', error);
    }
  }

  private getConversationRoomName(userId1: string, userId2: string): string {
    const sortedIds = [userId1, userId2].sort();
    return `conversation_${sortedIds[0]}_${sortedIds[1]}`;
  }

  sendMessageToUser(userId: string, event: string, data: any) {
    const userSocket = this.connectedUsers.get(userId);
    if (userSocket) {
      userSocket.emit(event, data);
    }
  }
} 