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
let MessagesGateway = class MessagesGateway {
    constructor(messagesService, usersService) {
        this.messagesService = messagesService;
        this.usersService = usersService;
        this.connectedUsers = new Map();
        this.connectionCount = 0;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization;
            if (!token) {
                client.disconnect();
                return;
            }
            const testUsers = await this.usersService.findTestUsers();
            if (testUsers.length === 0) {
                client.disconnect();
                return;
            }
            this.connectionCount++;
            const userIndex = (this.connectionCount - 1) % testUsers.length;
            const userId = testUsers[userIndex].id;
            this.connectedUsers.set(userId, client);
            client.data.userId = userId;
            console.log(`User ${userId} connected (connection #${this.connectionCount})`);
        }
        catch (error) {
            console.error('Connection error:', error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const userId = client.data.userId;
        if (userId) {
            this.connectedUsers.delete(userId);
            this.connectionCount--;
            console.log(`User ${userId} disconnected`);
        }
    }
    async handleSendMessage(data, client) {
        try {
            const senderId = client.data.userId;
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
            const receiverSocket = this.connectedUsers.get(data.receiverId);
            if (receiverSocket) {
                receiverSocket.emit('new_message', {
                    id: message.id,
                    senderId: message.senderId,
                    receiverId: message.receiverId,
                    content: message.content,
                    type: message.type,
                    createdAt: message.createdAt,
                });
            }
            client.emit('message_sent', {
                id: message.id,
                status: 'sent',
            });
            return { success: true, messageId: message.id };
        }
        catch (error) {
            console.error('Send message error:', error);
            client.emit('message_error', { error: error.message });
            return { success: false, error: error.message };
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
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        users_service_1.UsersService])
], MessagesGateway);
//# sourceMappingURL=messages.gateway.js.map