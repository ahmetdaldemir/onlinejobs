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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_entity_1 = require("./entities/user.entity");
const update_user_info_dto_1 = require("./dto/update-user-info.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findTestUsers() {
        return this.usersService.findTestUsers();
    }
    async findRealUsers() {
        return this.usersService.findRealUsers();
    }
    async findAll() {
        return this.usersService.findAll();
    }
    async findActiveUsers() {
        return this.usersService.findActiveUsers();
    }
    async findOnlineUsers() {
        return this.usersService.findOnlineUsers();
    }
    async findOnlineWorkers(latitude, longitude, radius, categoryId) {
        return this.usersService.findOnlineWorkers(latitude, longitude, radius, categoryId);
    }
    async findOnlineEmployers(latitude, longitude, radius, categoryId) {
        return this.usersService.findOnlineEmployers(latitude, longitude, radius, categoryId);
    }
    async findUsersByType(userType) {
        return this.usersService.findUsersByType(userType);
    }
    async updateUserTypes(req, userType) {
        return this.usersService.updateUserTypes(req.user.sub, userType);
    }
    async getUserInfo(req) {
        return this.usersService.getUserInfo(req.user.sub);
    }
    async getUserInfos(req) {
        return this.usersService.getUserInfo(req.user.sub);
    }
    async updateStatus(req, status) {
        return this.usersService.updateStatus(req.user.sub, status);
    }
    async updateIsOnline(req, isOnline) {
        return this.usersService.updateIsOnline(req.user.sub, isOnline);
    }
    async getUserIsVerified(req) {
        return this.usersService.getUserIsVerified(req.user.sub);
    }
    async updateLocation(req, locationData) {
        return this.usersService.updateLocation(req.user.sub, locationData.latitude, locationData.longitude, locationData.name);
    }
    async updateUserInfo(req, updateUserInfoDto) {
        return this.usersService.updateUserInfo(req.user.sub, updateUserInfoDto);
    }
    async createUserInfo(req, createUserInfoDto) {
        return this.usersService.createUserInfo(req.user.sub, createUserInfoDto);
    }
    async updateProfile(req, updateData, file) {
        return this.usersService.updateProfile(req.user.sub, updateData, file);
    }
    async updateProfileImage(req, file) {
        if (!file) {
            throw new common_1.BadRequestException('Profil fotoğrafı yüklenmedi');
        }
        const userId = req.user.sub;
        return this.usersService.updateProfileWithFile(userId, file);
    }
    async getProfileImage(userId) {
        const user = await this.usersService.findById(userId);
        return { profileImage: user.profileImage };
    }
    async getOnlineUsers() {
        return this.usersService.findOnlineUsers();
    }
    async getOnlineWorkers(latitude, longitude, radius, categoryId) {
        return this.usersService.findOnlineWorkers(latitude, longitude, radius, categoryId);
    }
    async getOnlineEmployers(latitude, longitude, radius, categoryId) {
        return this.usersService.findOnlineEmployers(latitude, longitude, radius, categoryId);
    }
    async getUserStatus(userId) {
        const user = await this.usersService.findById(userId);
        return {
            userId: user.id,
            isOnline: user.isOnline,
            lastSeen: user.lastSeen,
            firstName: user.firstName,
            lastName: user.lastName
        };
    }
    async findById(id) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new common_1.BadRequestException(`Geçersiz UUID formatı: ${id}. Lütfen geçerli bir kullanıcı ID'si girin.`);
        }
        return this.usersService.findById(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('test'),
    (0, swagger_1.ApiOperation)({ summary: 'Test kullanıcılarını listele (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test kullanıcıları listelendi' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findTestUsers", null);
__decorate([
    (0, common_1.Get)('real'),
    (0, swagger_1.ApiOperation)({ summary: 'Gerçek kullanıcıları listele (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gerçek kullanıcılar listelendi' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findRealUsers", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tüm kullanıcıları listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcılar listelendi' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Aktif kullanıcıları listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Aktif kullanıcılar listelendi' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findActiveUsers", null);
__decorate([
    (0, common_1.Get)('online'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Online kullanıcıları listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Online kullanıcılar listelendi' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOnlineUsers", null);
__decorate([
    (0, common_1.Get)('online-workers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Yakındaki online worker\'ları listele' }),
    (0, swagger_1.ApiQuery)({ name: 'latitude', required: false, type: Number, description: 'Enlem (latitude)' }),
    (0, swagger_1.ApiQuery)({ name: 'longitude', required: false, type: Number, description: 'Boylam (longitude)' }),
    (0, swagger_1.ApiQuery)({ name: 'radius', required: false, type: Number, description: 'Arama yarıçapı (km)' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false, type: String, description: 'Kategori ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Yakındaki online worker\'lar listelendi' }),
    __param(0, (0, common_1.Query)('latitude')),
    __param(1, (0, common_1.Query)('longitude')),
    __param(2, (0, common_1.Query)('radius')),
    __param(3, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOnlineWorkers", null);
__decorate([
    (0, common_1.Get)('online-employers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Online işverenleri listele' }),
    (0, swagger_1.ApiQuery)({ name: 'latitude', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'longitude', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'radius', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Online işverenler listelendi' }),
    __param(0, (0, common_1.Query)('latitude')),
    __param(1, (0, common_1.Query)('longitude')),
    __param(2, (0, common_1.Query)('radius')),
    __param(3, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOnlineEmployers", null);
__decorate([
    (0, common_1.Get)('by-type/:userType'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcıları tipe göre listele' }),
    (0, swagger_1.ApiParam)({ name: 'userType', description: 'Kullanıcı tipi: job_seeker, employer, both' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcılar listelendi' }),
    __param(0, (0, common_1.Param)('userType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findUsersByType", null);
__decorate([
    (0, common_1.Put)('user-types'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı tiplerini güncelle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcı tipleri güncellendi' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('userType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserTypes", null);
__decorate([
    (0, common_1.Get)('user-info'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcının tüm adres bilgilerini getir' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcının tüm adres bilgileri' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserInfo", null);
__decorate([
    (0, common_1.Get)('user-infos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcının tüm adres bilgilerini getir (alias)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcının tüm adres bilgileri' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserInfos", null);
__decorate([
    (0, common_1.Put)('status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı durumunu güncelle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Durum güncellendi' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)('is-online'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı online durumunu güncelle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Online durum güncellendi' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('isOnline')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateIsOnline", null);
__decorate([
    (0, common_1.Get)('is-verified'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcının tüm adres bilgilerini getir (alias)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcının tüm adres bilgileri' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserIsVerified", null);
__decorate([
    (0, common_1.Put)('location'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı konumunu güncelle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Konum güncellendi' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateLocation", null);
__decorate([
    (0, common_1.Put)('user-info'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı bilgilerini güncelle (ID ile güncelleme veya yeni ekleme)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcı bilgileri güncellendi' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Geçersiz veri veya kayıt bulunamadı' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_info_dto_1.UpdateUserInfoDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserInfo", null);
__decorate([
    (0, common_1.Post)('user-info'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı bilgilerini güncelle (ID ile güncelleme veya yeni ekleme)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcı bilgileri güncellendi' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Geçersiz veri veya kayıt bulunamadı' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUserInfo", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı profilini güncelle (profil fotoğrafı dahil)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' },
                bio: { type: 'string' },
                categoryIds: {
                    type: 'array',
                    items: { type: 'string' }
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Profil fotoğrafı (opsiyonel)',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)('profile-image'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Profil fotoğrafını güncelle (Dosya yükle)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profil fotoğrafı güncellendi' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['file'],
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
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfileImage", null);
__decorate([
    (0, common_1.Get)('profile-image/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı profil fotoğrafını getir' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profil fotoğrafı URL\'i' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfileImage", null);
__decorate([
    (0, common_1.Get)('online-users'),
    (0, swagger_1.ApiOperation)({ summary: 'Online kullanıcıları listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Online kullanıcılar listelendi' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getOnlineUsers", null);
__decorate([
    (0, common_1.Get)('online-workers'),
    (0, swagger_1.ApiOperation)({ summary: 'Online işçileri listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Online işçiler listelendi' }),
    __param(0, (0, common_1.Query)('latitude')),
    __param(1, (0, common_1.Query)('longitude')),
    __param(2, (0, common_1.Query)('radius')),
    __param(3, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getOnlineWorkers", null);
__decorate([
    (0, common_1.Get)('online-employers'),
    (0, swagger_1.ApiOperation)({ summary: 'Online işverenleri listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Online işverenler listelendi' }),
    __param(0, (0, common_1.Query)('latitude')),
    __param(1, (0, common_1.Query)('longitude')),
    __param(2, (0, common_1.Query)('radius')),
    __param(3, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getOnlineEmployers", null);
__decorate([
    (0, common_1.Get)('user-status/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcının online durumunu getir' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcı durumu' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı detayı (UUID ile)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcı detayı' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Kullanıcı bulunamadı' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Geçersiz UUID formatı' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findById", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map