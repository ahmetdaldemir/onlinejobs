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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const path = require("path");
const fs = require("fs");
const upload_service_1 = require("./upload.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_jwt_guard_1 = require("../auth/guards/admin-jwt.guard");
let UploadController = class UploadController {
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadProfileImage(file, req) {
        if (!file) {
            throw new common_1.BadRequestException('Dosya yüklenmedi');
        }
        const fileUrl = this.uploadService.getFileUrl(file.filename);
        return {
            message: 'Profil fotoğrafı başarıyla yüklendi',
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            url: fileUrl,
        };
    }
    async uploadAdminProfileImage(file, userId) {
        if (!file) {
            throw new common_1.BadRequestException('Dosya yüklenmedi');
        }
        const fileUrl = this.uploadService.getFileUrl(file.filename);
        return {
            message: 'Profil fotoğrafı başarıyla yüklendi',
            userId: userId,
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            url: fileUrl,
        };
    }
    async serveFile(filename, res) {
        const filePath = path.join(process.cwd(), 'uploads', filename);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Dosya bulunamadı' });
        }
        return res.sendFile(filePath);
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('profile-image'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Profil fotoğrafı yükle' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Profil fotoğrafı (max 5MB)',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadProfileImage", null);
__decorate([
    (0, common_1.Post)('admin/profile-image/:userId'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Kullanıcı profil fotoğrafı yükle' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Profil fotoğrafı (max 5MB)',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadAdminProfileImage", null);
__decorate([
    (0, common_1.Get)('uploads/:filename'),
    (0, swagger_1.ApiOperation)({ summary: 'Yüklenen dosyayı görüntüle' }),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "serveFile", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('Upload'),
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map