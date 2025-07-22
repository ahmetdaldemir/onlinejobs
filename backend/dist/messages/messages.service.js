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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("./entities/message.entity");
let MessagesService = class MessagesService {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    async sendMessage(senderId, receiverId, content, type = message_entity_1.MessageType.TEXT) {
        const message = this.messageRepository.create({
            senderId,
            receiverId,
            content,
            type,
        });
        return this.messageRepository.save(message);
    }
    async getConversation(userId1, userId2) {
        return this.messageRepository.find({
            where: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 },
            ],
            order: { createdAt: 'ASC' },
            relations: ['sender', 'receiver'],
        });
    }
    async getMyConversations(userId) {
        const conversations = await this.messageRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.receiver', 'receiver')
            .where('message.senderId = :userId OR message.receiverId = :userId', { userId })
            .orderBy('message.createdAt', 'DESC')
            .getMany();
        const conversationPartners = new Map();
        conversations.forEach(message => {
            const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
            const partner = message.senderId === userId ? message.receiver : message.sender;
            if (!conversationPartners.has(partnerId)) {
                conversationPartners.set(partnerId, {
                    partnerId,
                    partner,
                    lastMessage: message,
                    unreadCount: 0,
                });
            }
        });
        const unreadMessages = await this.messageRepository.find({
            where: { receiverId: userId, isRead: false },
        });
        unreadMessages.forEach(message => {
            const conversation = conversationPartners.get(message.senderId);
            if (conversation) {
                conversation.unreadCount++;
            }
        });
        return Array.from(conversationPartners.values());
    }
    async markAsRead(messageId, userId) {
        const message = await this.messageRepository.findOne({
            where: { id: messageId },
        });
        if (!message) {
            throw new common_1.NotFoundException('Mesaj bulunamadı');
        }
        if (message.receiverId !== userId) {
            throw new common_1.ForbiddenException('Bu mesajı okuma yetkiniz yok');
        }
        message.isRead = true;
        message.readAt = new Date();
        return this.messageRepository.save(message);
    }
    async markConversationAsRead(otherUserId, userId) {
        await this.messageRepository.update({ senderId: otherUserId, receiverId: userId, isRead: false }, { isRead: true, readAt: new Date() });
    }
    async getUnreadCount(userId) {
        return this.messageRepository.count({
            where: { receiverId: userId, isRead: false },
        });
    }
    async getMessageStatus(messageId) {
        const message = await this.messageRepository.findOne({
            where: { id: messageId },
        });
        if (!message) {
            throw new common_1.NotFoundException('Mesaj bulunamadı');
        }
        return {
            isDelivered: true,
            isRead: message.isRead,
            readAt: message.readAt,
        };
    }
    async getSentMessagesStatus(userId) {
        return this.messageRepository.find({
            where: { senderId: userId },
            select: ['id', 'isRead', 'readAt', 'createdAt'],
            order: { createdAt: 'DESC' },
        });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MessagesService);
//# sourceMappingURL=messages.service.js.map