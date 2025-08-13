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
exports.UserVerificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer = require("multer");
const path = require("path");
const user_verification_service_1 = require("./user-verification.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_jwt_guard_1 = require("../auth/guards/admin-jwt.guard");
const upload_verification_document_dto_1 = require("./dto/upload-verification-document.dto");
const user_verification_entity_1 = require("./entities/user-verification.entity");
const upload_service_1 = require("../upload/upload.service");
let UserVerificationController = class UserVerificationController {
    constructor(verificationService, uploadService) {
        this.verificationService = verificationService;
        this.uploadService = uploadService;
    }
    async getMyDocuments(req) {
        return this.verificationService.getUserVerifications(req.user.sub);
    }
    async getMyVerificationStatus(req) {
        return this.verificationService.getUserVerificationStatus(req.user.sub);
    }
    async getRequiredDocuments() {
        return this.verificationService.getRequiredDocumentTypes();
    }
    async uploadDocument(req, uploadDto, file) {
        if (!file) {
            throw new common_1.BadRequestException('Dosya yüklenmedi');
        }
        return this.verificationService.uploadDocument(req.user.sub, uploadDto.documentType, file, uploadDto.description);
    }
    async deleteDocument(id, req) {
        await this.verificationService.deleteDocument(id, req.user.sub);
        return { message: 'Belge başarıyla silindi' };
    }
    async getPendingVerifications() {
        return this.verificationService.getPendingVerifications();
    }
    async getUserVerifications(userId) {
        return this.verificationService.getVerificationsByUserId(userId);
    }
    async updateVerificationStatus(id, updateDto, req) {
        return this.verificationService.updateVerificationStatus(id, req.user.sub, updateDto);
    }
    async getVerificationStatistics() {
        return {
            totalPending: 0,
            totalApproved: 0,
            totalRejected: 0,
            recentSubmissions: [],
        };
    }
};
exports.UserVerificationController = UserVerificationController;
__decorate([
    (0, common_1.Get)('my-documents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcının doğrulama belgelerini getir' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Doğrulama belgeleri listelendi' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserVerificationController.prototype, "getMyDocuments", null);
__decorate([
    (0, common_1.Get)('my-status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcının doğrulama durumunu getir' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Doğrulama durumu' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserVerificationController.prototype, "getMyVerificationStatus", null);
__decorate([
    (0, common_1.Get)('required-documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Gerekli belge türlerini getir' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gerekli belge türleri' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserVerificationController.prototype, "getRequiredDocuments", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Doğrulama belgesi yükle (Sadece worker\'lar)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                documentType: {
                    type: 'string',
                    enum: Object.values(user_verification_entity_1.DocumentType),
                    description: 'Belge türü',
                },
                description: {
                    type: 'string',
                    description: 'Belge açıklaması (opsiyonel)',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Belge dosyası (PDF, JPG, PNG, max 5MB)',
                },
            },
            required: ['documentType', 'file'],
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'uploads/verifications');
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const extension = path.extname(file.originalname);
                cb(null, `verification-${uniqueSuffix}${extension}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowedMimeTypes = [
                'application/pdf',
                'image/jpeg',
                'image/jpg',
                'image/png',
            ];
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new Error('Sadece PDF, JPG, PNG dosyaları yüklenebilir!'), false);
            }
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_verification_document_dto_1.UploadVerificationDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], UserVerificationController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Doğrulama belgesini sil (Sadece bekleyen belgeler)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Belge silindi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserVerificationController.prototype, "deleteDocument", null);
__decorate([
    (0, common_1.Get)('admin/pending'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Bekleyen doğrulama belgelerini listele (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bekleyen belgeler listelendi' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserVerificationController.prototype, "getPendingVerifications", null);
__decorate([
    (0, common_1.Get)('admin/user/:userId'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcının tüm doğrulama belgelerini getir (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcının belgeleri' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserVerificationController.prototype, "getUserVerifications", null);
__decorate([
    (0, common_1.Put)('admin/:id/status'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Doğrulama belgesi durumunu güncelle (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Durum güncellendi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, upload_verification_document_dto_1.UpdateVerificationStatusDto, Object]),
    __metadata("design:returntype", Promise)
], UserVerificationController.prototype, "updateVerificationStatus", null);
__decorate([
    (0, common_1.Get)('admin/statistics'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Doğrulama istatistiklerini getir (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'İstatistikler' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserVerificationController.prototype, "getVerificationStatistics", null);
exports.UserVerificationController = UserVerificationController = __decorate([
    (0, swagger_1.ApiTags)('User Verification'),
    (0, common_1.Controller)('verification'),
    __metadata("design:paramtypes", [user_verification_service_1.UserVerificationService,
        upload_service_1.UploadService])
], UserVerificationController);
//# sourceMappingURL=user-verification.controller.js.map