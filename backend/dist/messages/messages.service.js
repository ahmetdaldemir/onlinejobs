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
const user_entity_1 = require("../users/entities/user.entity");
const ai_service_1 = require("../ai/ai.service");
let MessagesService = class MessagesService {
    constructor(messageRepository, userRepository, aiService) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.aiService = aiService;
    }
    async sendMessage(senderId, receiverId, content, type = message_entity_1.MessageType.TEXT) {
        if (!senderId) {
            throw new Error('senderId gerekli');
        }
        if (!receiverId) {
            throw new Error('receiverId gerekli');
        }
        if (!content || content.trim() === '') {
            throw new Error('content gerekli ve boş olamaz');
        }
        console.log('MessagesService.sendMessage çağrıldı:', { senderId, receiverId, content, type });
        const message = this.messageRepository.create({
            senderId,
            receiverId,
            content,
            type,
        });
        console.log('Oluşturulan message objesi:', message);
        const savedMessage = await this.messageRepository.save(message);
        await this.checkAndGenerateAIResponse(receiverId, senderId, content);
        return savedMessage;
    }
    async checkAndGenerateAIResponse(receiverId, senderId, originalMessage) {
        try {
            const isReceiverOnline = await this.isUserOnline(receiverId);
            if (!isReceiverOnline) {
                console.log(`🤖 Kullanıcı ${receiverId} online değil, AI yanıtı oluşturuluyor...`);
                const aiResponse = await this.aiService.generateResponse(receiverId, originalMessage);
                if (aiResponse) {
                    console.log(`✅ AI yanıtı oluşturuldu: ${aiResponse}`);
                    const aiMessage = this.messageRepository.create({
                        senderId: receiverId,
                        receiverId: senderId,
                        content: aiResponse,
                        type: message_entity_1.MessageType.TEXT,
                        isAIGenerated: true,
                    });
                    await this.messageRepository.save(aiMessage);
                    console.log(`💬 AI yanıtı mesaj olarak kaydedildi`);
                }
                else {
                    console.log(`❌ AI yanıtı oluşturulamadı`);
                }
            }
            else {
                console.log(`👤 Kullanıcı ${receiverId} online, AI yanıtı oluşturulmayacak`);
            }
        }
        catch (error) {
            console.error('AI yanıtı oluşturulurken hata:', error);
        }
    }
    async isUserOnline(userId) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
                select: ['id', 'isOnline', 'lastSeen']
            });
            if (!user) {
                console.log(`❌ Kullanıcı bulunamadı: ${userId}`);
                return false;
            }
            console.log(`🔍 Kullanıcı ${userId} online durumu: ${user.isOnline}`);
            console.log(`📅 Son görülme: ${user.lastSeen}`);
            console.log(`🤖 AI yanıtı için kullanıcı offline kabul ediliyor: ${userId}`);
            return false;
        }
        catch (error) {
            console.error(`❌ Online durumu kontrol edilirken hata: ${error.message}`);
            return false;
        }
    }
    async getConversation(userId1, userId2) {
        console.log('🔍 getConversation çağrıldı:', { userId1, userId2 });
        const messages = await this.messageRepository.find({
            where: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 },
            ],
            order: { createdAt: 'ASC' },
            relations: ['sender', 'receiver'],
        });
        console.log('📨 Bulunan mesajlar:', messages.length);
        console.log('📋 Mesaj detayları:', messages.map(m => ({
            id: m.id,
            senderId: m.senderId,
            receiverId: m.receiverId,
            content: m.content,
            createdAt: m.createdAt
        })));
        return messages;
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
            order: { createdAt: 'DESC' },
            relations: ['receiver'],
        });
    }
    async createSampleMessages(userId) {
        console.log('🧪 Test mesajları oluşturuluyor için kullanıcı:', userId);
        const testReceiverId = '4b27001b-759d-47e3-9a49-67d3445e26e8';
        const sampleMessages = [
            {
                senderId: userId,
                receiverId: testReceiverId,
                content: 'Merhaba! Test mesajı 1',
                type: message_entity_1.MessageType.TEXT,
            },
            {
                senderId: testReceiverId,
                receiverId: userId,
                content: 'Merhaba! Ben de test mesajı gönderiyorum.',
                type: message_entity_1.MessageType.TEXT,
            },
            {
                senderId: userId,
                receiverId: testReceiverId,
                content: 'Nasılsın? İşler nasıl gidiyor?',
                type: message_entity_1.MessageType.TEXT,
            },
            {
                senderId: testReceiverId,
                receiverId: userId,
                content: 'İyiyim, teşekkürler! Sen nasılsın?',
                type: message_entity_1.MessageType.TEXT,
            },
        ];
        const createdMessages = [];
        for (const messageData of sampleMessages) {
            const message = this.messageRepository.create(messageData);
            const savedMessage = await this.messageRepository.save(message);
            createdMessages.push(savedMessage);
            console.log('✅ Test mesajı oluşturuldu:', savedMessage.id);
        }
        console.log('🎉 Toplam', createdMessages.length, 'test mesajı oluşturuldu');
        return createdMessages;
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        ai_service_1.AiService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map