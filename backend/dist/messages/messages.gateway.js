"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const messages_service_1 = require("./messages.service");
const message_entity_1 = require("./entities/message.entity");
const users_service_1 = require("../users/users.service");
const ai_service_1 = require("../ai/ai.service");
const jwt_1 = require("@nestjs/jwt");
let MessagesGateway = class MessagesGateway {
    constructor(messagesService, usersService, aiService, jwtService) {
        this.messagesService = messagesService;
        this.usersService = usersService;
        this.aiService = aiService;
        this.jwtService = jwtService;
        this.connectedUsers = new Map();
    }
    async handleConnection(client) {
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
            const cleanToken = token.replace('Bearer ', '');
            console.log('Clean token preview:', cleanToken.substring(0, 20) + '...');
            try {
                const payload = this.jwtService.verify(cleanToken);
                console.log('JWT payload:', payload);
                const userId = payload.sub || payload.userId;
                if (!userId) {
                    console.log('❌ No user ID in JWT payload');
                    client.disconnect();
                    return;
                }
                const user = await this.usersService.findById(userId);
                if (!user) {
                    console.log('❌ User not found in database');
                    client.disconnect();
                    return;
                }
                console.log('✅ User found:', user.firstName, user.lastName);
                await this.usersService.setUserOnline(userId);
                this.connectedUsers.set(userId, client);
                client.data.userId = userId;
                console.log('✅ Connection successful for user:', userId);
                console.log('Connected users count:', this.connectedUsers.size);
            }
            catch (jwtError) {
                console.log('❌ JWT verification failed:', jwtError.message);
                client.disconnect();
                return;
            }
        }
        catch (error) {
            console.error('❌ Connection error:', error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const userId = client.data.userId;
        if (userId) {
            this.usersService.setUserOffline(userId).catch(error => {
                console.error('Error setting user offline:', error);
            });
            this.connectedUsers.delete(userId);
            console.log(`User ${userId} disconnected`);
        }
    }
    async handleSendMessage(data, client) {
        try {
            const senderId = client.data.userId;
            console.log('=== MESAJ GÖNDERME DEBUG ===');
            console.log('Client data:', client.data);
            console.log('Gönderici ID:', senderId);
            console.log('Alıcı ID:', data.receiverId);
            console.log('Mesaj içeriği:', data.content);
            console.log('Bağlı kullanıcılar:', Array.from(this.connectedUsers.keys()));
            console.log('Alıcı bağlı mı:', this.connectedUsers.has(data.receiverId));
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
            let messageType = message_entity_1.MessageType.TEXT;
            if (data.type) {
                switch (data.type.toUpperCase()) {
                    case 'TEXT':
                        messageType = message_entity_1.MessageType.TEXT;
                        break;
                    case 'IMAGE':
                        messageType = message_entity_1.MessageType.IMAGE;
                        break;
                    case 'LOCATION':
                        messageType = message_entity_1.MessageType.LOCATION;
                        break;
                    default:
                        messageType = message_entity_1.MessageType.TEXT;
                }
            }
            const message = await this.messagesService.sendMessage(senderId, data.receiverId, data.content, messageType);
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
                try {
                    const aiResponse = await this.aiService.generateResponse(data.receiverId, data.content);
                    if (aiResponse) {
                        const aiMessage = await this.messagesService.sendMessage(data.receiverId, senderId, aiResponse, message_entity_1.MessageType.TEXT);
                        client.emit('new_message', {
                            id: aiMessage.id,
                            senderId: data.receiverId,
                            content: aiResponse,
                            type: message_entity_1.MessageType.TEXT,
                            createdAt: aiMessage.createdAt,
                            isAiResponse: true,
                        });
                        receiverSocket.emit('new_message', {
                            id: aiMessage.id,
                            senderId: data.receiverId,
                            content: aiResponse,
                            type: message_entity_1.MessageType.TEXT,
                            createdAt: aiMessage.createdAt,
                            isAiResponse: true,
                        });
                    }
                }
                catch (aiError) {
                    console.error('AI response error:', aiError);
                }
            }
            else {
                console.log('Alıcı bağlı değil! Alıcı ID:', data.receiverId);
                console.log('Bağlı kullanıcılar:', Array.from(this.connectedUsers.keys()));
                client.emit('message_error', {
                    error: `Alıcı (${data.receiverId}) bağlı değil. Mesaj kaydedildi ama iletilemedi.`
                });
            }
        }
        catch (error) {
            console.error('Send message error:', error);
            client.emit('message_error', { error: error.message });
        }
    }
    async handleJoinConversation(data, client) {
        const userId = client.data.userId;
        const roomName = this.getConversationRoomName(userId, data.otherUserId);
        client.join(roomName);
        console.log(`User ${userId} joined conversation with ${data.otherUserId}`);
    }
    async handleLeaveConversation(data, client) {
        const userId = client.data.userId;
        const roomName = this.getConversationRoomName(userId, data.otherUserId);
        client.leave(roomName);
        console.log(`User ${userId} left conversation with ${data.otherUserId}`);
    }
    async handleTyping(data, client) {
        const senderId = client.data.userId;
        const receiverSocket = this.connectedUsers.get(data.receiverId);
        if (receiverSocket) {
            receiverSocket.emit('user_typing', {
                userId: senderId,
                isTyping: data.isTyping,
            });
        }
    }
    async handleReadMessages(data, client) {
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
        }
        catch (error) {
            console.error('Read messages error:', error);
        }
    }
    async handleMarkMessageRead(data, client) {
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
        }
        catch (error) {
            console.error('Mark message read error:', error);
        }
    }
    getConversationRoomName(userId1, userId2) {
        const sortedIds = [userId1, userId2].sort();
        return `conversation_${sortedIds[0]}_${sortedIds[1]}`;
    }
    sendMessageToUser(userId, event, data) {
        const userSocket = this.connectedUsers.get(userId);
        if (userSocket) {
            userSocket.emit(event, data);
        }
    }
};
exports.MessagesGateway = MessagesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_conversation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_conversation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleLeaveConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('read_messages'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleReadMessages", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mark_message_read'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleMarkMessageRead", null);
exports.MessagesGateway = MessagesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
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
    }),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        users_service_1.UsersService,
        ai_service_1.AiService,
        jwt_1.JwtService])
], MessagesGateway);
//# sourceMappingURL=messages.gateway.js.map