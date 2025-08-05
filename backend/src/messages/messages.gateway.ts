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
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8080',
      'http://localhost:5173',
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

  // Online kullanıcıları kontrol etmek için public method
  public isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
    private readonly aiService: AiService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      console.log('🔍 === SOCKET CONNECTION DEBUG ===');
      console.log('Client ID:', client.id);
      console.log('Auth object:', client.handshake.auth);
      console.log('Headers:', client.handshake.headers);
      console.log('Query:', client.handshake.query);
      
      const token = client.handshake.auth.token || 
                    client.handshake.headers.authorization ||
                    client.handshake.query.token;
      
      console.log('Extracted token:', token ? 'Present' : 'Missing');
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'None');
      
      if (!token) {
        console.log('❌ No token found, disconnecting client');
        client.disconnect();
        return;
      }
      
      // Token'ı temizle (Bearer prefix'i kaldır)
      const cleanToken = token.replace('Bearer ', '');
      console.log('Clean token preview:', cleanToken.substring(0, 20) + '...');
      
      try {
        // JWT token'ı doğrula
        const payload = this.jwtService.verify(cleanToken);
        console.log('JWT payload:', payload);
        
        const userId = payload.sub || payload.userId;
        if (!userId) {
          console.log('❌ No user ID in JWT payload');
          client.disconnect();
          return;
        }
        
        // Kullanıcının var olduğunu kontrol et
        const user = await this.usersService.findById(userId);
        if (!user) {
          console.log('❌ User not found in database');
          client.disconnect();
          return;
        }
        
        console.log('✅ User found:', user.firstName, user.lastName);
        
        // Kullanıcıyı online yap
        await this.usersService.setUserOnline(userId);
        this.connectedUsers.set(userId, client);
        client.data.userId = userId;
        
        // Online durumu değişikliğini yayınla
        await this.broadcastUserStatusChange(userId, true);
        
        console.log('✅ Connection successful for user:', userId);
        console.log('Connected users count:', this.connectedUsers.size);
        
      } catch (jwtError) {
        console.log('❌ JWT verification failed:', jwtError.message);
        client.disconnect();
        return;
      }
      
    } catch (error) {
      console.error('❌ Connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      try {
        await this.usersService.setUserOffline(userId);
        // Offline durumu değişikliğini yayınla
        await this.broadcastUserStatusChange(userId, false);
        this.connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
      } catch (error) {
        console.error('Error setting user offline:', error);
      }
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
      
      // Mesajı sadece MessagesService üzerinden kaydet
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
      console.log('=== ALICI SOCKET DEBUG ===');
      console.log('Alıcı ID:', data.receiverId);
      console.log('ConnectedUsers Map:', Array.from(this.connectedUsers.entries()));
      console.log('ReceiverSocket bulundu mu:', !!receiverSocket);
      console.log('ReceiverSocket ID:', receiverSocket?.id);
      console.log('ReceiverSocket connected:', receiverSocket?.connected);
      
      if (receiverSocket && receiverSocket.connected) {
        console.log('Alıcı bulundu ve bağlı, mesaj gönderiliyor...');
        receiverSocket.emit('new_message', {
          id: message.id,
          senderId: senderId,
          content: message.content,
          type: message.type,
          createdAt: message.createdAt,
        });
        console.log('👤 Alıcı online, AI yanıtı oluşturulmayacak');
      } else {
        console.log('Alıcı bağlı değil! Alıcı ID:', data.receiverId);
        console.log('Bağlı kullanıcılar:', Array.from(this.connectedUsers.keys()));
        
        // Alıcı gerçekten offline ise AI yanıtı oluştur
        const isReceiverOnline = await this.messagesService.isUserOnline(data.receiverId);
        if (!isReceiverOnline) {
          console.log('🤖 Alıcı gerçekten offline, AI yanıtı oluşturuluyor...');
          try {
            const aiResponse = await this.aiService.generateResponse(data.receiverId, data.content);
            if (aiResponse) {
              console.log('✅ AI yanıtı oluşturuldu:', aiResponse);
              
              // AI yanıtını özel metod ile kaydet
              const savedAiMessage = await this.messagesService.createAIResponse(
                data.receiverId,
                senderId,
                aiResponse
              );

              // AI yanıtını göndericiye gönder
              client.emit('new_message', {
                id: savedAiMessage.id,
                senderId: data.receiverId,
                content: aiResponse,
                type: MessageType.TEXT,
                createdAt: savedAiMessage.createdAt,
                isAiResponse: true,
              });

              console.log('💬 AI yanıtı mesaj olarak kaydedildi ve gönderildi');
            } else {
              console.log('❌ AI yanıtı oluşturulamadı');
            }
          } catch (aiError) {
            console.error('AI response error:', aiError);
          }
        } else {
          console.log('👤 Alıcı online ama WebSocket bağlantısı yok, AI yanıtı oluşturulmayacak');
        }
        
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

  // Online durumu takibi için yeni event'ler
  @SubscribeMessage('get_online_users')
  async handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    try {
      const onlineUsers = await this.usersService.findOnlineUsers();
      client.emit('online_users_list', {
        users: onlineUsers.map(user => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          isOnline: user.isOnline,
          lastSeen: user.lastSeen,
          userType: user.userType
        }))
      });
    } catch (error) {
      console.error('Get online users error:', error);
      client.emit('online_users_error', { error: error.message });
    }
  }

  @SubscribeMessage('get_user_status')
  async handleGetUserStatus(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user = await this.usersService.findById(data.userId);
      client.emit('user_status', {
        userId: user.id,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        firstName: user.firstName,
        lastName: user.lastName
      });
    } catch (error) {
      console.error('Get user status error:', error);
      client.emit('user_status_error', { error: error.message });
    }
  }

  @SubscribeMessage('subscribe_user_status')
  async handleSubscribeUserStatus(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const roomName = `user_status_${data.userId}`;
      client.join(roomName);
      console.log(`User ${client.data.userId} subscribed to status of user ${data.userId}`);
      
      // Mevcut durumu hemen gönder
      const user = await this.usersService.findById(data.userId);
      client.emit('user_status_update', {
        userId: user.id,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen
      });
    } catch (error) {
      console.error('Subscribe user status error:', error);
      client.emit('subscribe_status_error', { error: error.message });
    }
  }

  @SubscribeMessage('unsubscribe_user_status')
  async handleUnsubscribeUserStatus(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const roomName = `user_status_${data.userId}`;
      client.leave(roomName);
      console.log(`User ${client.data.userId} unsubscribed from status of user ${data.userId}`);
    } catch (error) {
      console.error('Unsubscribe user status error:', error);
    }
  }

  // Kullanıcı durumu değiştiğinde tüm abonelere bildir
  async broadcastUserStatusChange(userId: string, isOnline: boolean) {
    const roomName = `user_status_${userId}`;
    const user = await this.usersService.findById(userId);
    
    this.server.to(roomName).emit('user_status_update', {
      userId: user.id,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
      firstName: user.firstName,
      lastName: user.lastName
    });
    
    console.log(`📡 User status broadcasted: ${userId} is now ${isOnline ? 'online' : 'offline'}`);
  }
} 