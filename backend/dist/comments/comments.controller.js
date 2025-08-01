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
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const comments_service_1 = require("./comments.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const update_comment_dto_1 = require("./dto/update-comment.dto");
const common_2 = require("@nestjs/common");
let CommentsController = class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    async create(createCommentDto, req) {
        return this.commentsService.create(createCommentDto, req.user.sub);
    }
    async findAll(filters) {
        return this.commentsService.findAll(filters);
    }
    async getUserComments(userId) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(userId)) {
            throw new common_2.BadRequestException(`Geçersiz UUID formatı: ${userId}`);
        }
        return this.commentsService.getUserComments(userId);
    }
    async getMyComments(req) {
        return this.commentsService.getMyComments(req.user.sub);
    }
    async getJobComments(jobId) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(jobId)) {
            throw new common_2.BadRequestException(`Geçersiz UUID formatı: ${jobId}`);
        }
        return this.commentsService.getJobComments(jobId);
    }
    async findById(id) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new common_2.BadRequestException(`Geçersiz UUID formatı: ${id}`);
        }
        return this.commentsService.findById(id);
    }
    async update(id, updateCommentDto, req) {
        return this.commentsService.update(id, updateCommentDto, req.user.sub);
    }
    async delete(id, req) {
        return this.commentsService.delete(id, req.user.sub);
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Yorum oluştur' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Yorum oluşturuldu' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Geçersiz veri' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Kullanıcı veya iş bulunamadı' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comment_dto_1.CreateCommentDto, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tüm yorumları listele' }),
    (0, swagger_1.ApiQuery)({ name: 'commentedUserId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'commenterId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'jobId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'rating', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Yorumlar listelendi' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Belirli bir kullanıcının aldığı yorumları listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcının yorumları listelendi' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "getUserComments", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kendi yaptığım yorumları listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Yorumlarım listelendi' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "getMyComments", null);
__decorate([
    (0, common_1.Get)('job/:jobId'),
    (0, swagger_1.ApiOperation)({ summary: 'Belirli bir işe ait yorumları listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'İş yorumları listelendi' }),
    __param(0, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "getJobComments", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Yorum detayı' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Yorum detayı' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Yorum bulunamadı' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Yorumu güncelle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Yorum güncellendi' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Yetkisiz erişim' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Yorum bulunamadı' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_comment_dto_1.UpdateCommentDto, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Yorumu sil' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Yorum silindi' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Yetkisiz erişim' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Yorum bulunamadı' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "delete", null);
exports.CommentsController = CommentsController = __decorate([
    (0, swagger_1.ApiTags)('Comments'),
    (0, common_1.Controller)('comments'),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map