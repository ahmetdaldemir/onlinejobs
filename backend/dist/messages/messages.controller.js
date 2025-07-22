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
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const messages_service_1 = require("./messages.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let MessagesController = class MessagesController {
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    async sendMessage(sendMessageDto, req) {
        return this.messagesService.sendMessage(req.user.sub, sendMessageDto.receiverId, sendMessageDto.content, sendMessageDto.type);
    }
    async getMyConversations(req) {
        return this.messagesService.getMyConversations(req.user.sub);
    }
    async getConversation(otherUserId, req) {
        return this.messagesService.getConversation(req.user.sub, otherUserId);
    }
    async markAsRead(messageId, req) {
        return this.messagesService.markAsRead(messageId, req.user.sub);
    }
    async markConversationAsRead(otherUserId, req) {
        return this.messagesService.markConversationAsRead(otherUserId, req.user.sub);
    }
    async getUnreadCount(req) {
        const count = await this.messagesService.getUnreadCount(req.user.sub);
        return { count };
    }
    async getMessageStatus(messageId) {
        return this.messagesService.getMessageStatus(messageId);
    }
    async getSentMessagesStatus(req) {
        return this.messagesService.getSentMessagesStatus(req.user.sub);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mesaj gönder' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Mesaj gönderildi' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('conversations'),
    (0, swagger_1.ApiOperation)({ summary: 'Konuşmalarımı listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Konuşmalar listelendi' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getMyConversations", null);
__decorate([
    (0, common_1.Get)('conversation/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Belirli kullanıcı ile konuşmayı getir' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Konuşma getirildi' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Put)(':id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mesajı okundu olarak işaretle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mesaj okundu olarak işaretlendi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Put)('conversation/:userId/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Konuşmayı okundu olarak işaretle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Konuşma okundu olarak işaretlendi' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "markConversationAsRead", null);
__decorate([
    (0, common_1.Get)('unread/count'),
    (0, swagger_1.ApiOperation)({ summary: 'Okunmamış mesaj sayısı' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Okunmamış mesaj sayısı' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Get)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Mesaj durumunu getir (gönderildi, iletildi, okundu)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mesaj durumu' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getMessageStatus", null);
__decorate([
    (0, common_1.Get)('sent/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Gönderilen mesajların okunma durumunu getir' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gönderilen mesajların durumu' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getSentMessagesStatus", null);
exports.MessagesController = MessagesController = __decorate([
    (0, swagger_1.ApiTags)('Messages'),
    (0, common_1.Controller)('messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map