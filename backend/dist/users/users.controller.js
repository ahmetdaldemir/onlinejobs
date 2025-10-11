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
    async addPortfolioImage(req, file) {
        if (!file) {
            throw new common_1.BadRequestException('Resim dosyası yüklenmedi');
        }
        const user = await this.usersService.addPortfolioImage(req.user.sub, file);
        return {
            message: 'Portföy resmi başarıyla eklendi',
            portfolioImages: user.portfolioImages,
            totalImages: user.portfolioImages.length,
        };
    }
    async getUserPortfolioImages(userId) {
        const images = await this.usersService.getPortfolioImages(userId);
        return {
            userId,
            portfolioImages: images,
            totalImages: images.length,
        };
    }
    async deletePortfolioImage(req, imageUrl) {
        if (!imageUrl) {
            throw new common_1.BadRequestException('Resim URL\'si gerekli');
        }
        const user = await this.usersService.deletePortfolioImage(req.user.sub, imageUrl);
        return {
            message: 'Portföy resmi başarıyla silindi',
            portfolioImages: user.portfolioImages,
            totalImages: user.portfolioImages.length,
        };
    }
    async deleteAllPortfolioImages(req) {
        await this.usersService.deleteAllPortfolioImages(req.user.sub);
        return {
            message: 'Tüm portföy resimleri başarıyla silindi',
            portfolioImages: [],
            totalImages: 0,
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
    (0, swagger_1.ApiOperation)({
        summary: 'Test kullanıcılarını listele (Public)',
        description: 'Development için - Test telefon numaralarına (+905550000001-005) sahip kullanıcıları listeler.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Test kullanıcıları listelendi. Response: User[]'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findTestUsers", null);
__decorate([
    (0, common_1.Get)('real'),
    (0, swagger_1.ApiOperation)({
        summary: 'Gerçek kullanıcıları listele (Public)',
        description: 'Development için - Test kullanıcıları hariç gerçek kullanıcıları listeler.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Gerçek kullanıcılar listelendi. Response: User[]'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findRealUsers", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Tüm kullanıcıları listele (Admin)',
        description: 'Admin paneli için - Tüm kullanıcıları listeler.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Kullanıcılar listelendi. Response: User[]'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Aktif kullanıcıları listele (Admin)',
        description: 'Admin paneli için - Status: ACTIVE olan kullanıcıları listeler.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Aktif kullanıcılar listelendi. Response: User[]'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findActiveUsers", null);
__decorate([
    (0, common_1.Get)('online'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Online kullanıcıları listele (Admin)',
        description: 'Admin paneli için - isOnline: true olan kullanıcıları listeler.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Online kullanıcılar listelendi. Response: User[]'
    }),
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
    (0, swagger_1.ApiOperation)({
        summary: 'Kullanıcıları tipe göre listele (Admin)',
        description: 'Admin paneli için - Kullanıcıları userType\'a göre filtreler (worker, employer).'
    }),
    (0, swagger_1.ApiParam)({
        name: 'userType',
        description: 'Kullanıcı tipi',
        enum: ['worker', 'employer']
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Kullanıcılar listelendi. Response: User[]'
    }),
    __param(0, (0, common_1.Param)('userType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findUsersByType", null);
__decorate([
    (0, common_1.Put)('profile-image'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Profil fotoğrafını yükle ve güncelle',
        description: 'Dosya upload için özel endpoint. Profil fotoğrafını yükler ve user.profileImage alanını günceller. Diğer bilgiler için PUT /user kullanın.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profil fotoğrafı başarıyla güncellendi. Response: { profileImage: string, message: string }'
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dosya yüklenmedi veya geçersiz format' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['file'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Profil fotoğrafı (max 5MB, jpg/jpeg/png)',
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
    (0, swagger_1.ApiOperation)({
        summary: 'Başka kullanıcının profil fotoğrafını getir',
        description: 'Public endpoint - Başka bir kullanıcının profil resmini almak için kullanılır.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profil fotoğrafı URL\'i. Response: { profileImage: string }'
    }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfileImage", null);
__decorate([
    (0, common_1.Get)('online-users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Tüm online kullanıcıları listele',
        description: 'Hem worker hem employer - online olan tüm kullanıcıları listeler.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Online kullanıcılar listelendi. Response: User[]'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getOnlineUsers", null);
__decorate([
    (0, common_1.Get)('online-workers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Yakındaki online worker\'ları listele (Employer için)',
        description: 'Employer\'ların yakındaki online worker\'ları bulmak için kullanır. Worker koordinatları User tablosundan alınır.'
    }),
    (0, swagger_1.ApiQuery)({ name: 'latitude', required: false, type: Number, description: 'Enlem (latitude)' }),
    (0, swagger_1.ApiQuery)({ name: 'longitude', required: false, type: Number, description: 'Boylam (longitude)' }),
    (0, swagger_1.ApiQuery)({ name: 'radius', required: false, type: Number, description: 'Arama yarıçapı (km)' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false, type: String, description: 'Kategori ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Online worker\'lar listelendi. Worker\'ların city, district, neighborhood, latitude, longitude bilgileri User objesinde gelir.'
    }),
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
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Yakındaki online employer\'ları listele (Worker için)',
        description: 'Worker\'ların yakındaki online employer\'ları bulmak için kullanır. Employer koordinatları UserInfo tablosundan alınır.'
    }),
    (0, swagger_1.ApiQuery)({ name: 'latitude', required: false, type: Number, description: 'Enlem (latitude)' }),
    (0, swagger_1.ApiQuery)({ name: 'longitude', required: false, type: Number, description: 'Boylam (longitude)' }),
    (0, swagger_1.ApiQuery)({ name: 'radius', required: false, type: Number, description: 'Arama yarıçapı (km)' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false, type: String, description: 'Kategori ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Online employer\'lar listelendi. Employer\'ların adres bilgileri userInfos array\'inde gelir.'
    }),
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
    (0, swagger_1.ApiOperation)({
        summary: 'Başka kullanıcının online durumunu getir',
        description: 'Chat ve messaging için kullanılır. Başka bir kullanıcının online durumunu, son görülme zamanını ve temel bilgilerini döner.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Kullanıcı online durumu. Response: { userId: string, isOnline: boolean, lastSeen: Date, firstName: string, lastName: string }'
    }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserStatus", null);
__decorate([
    (0, common_1.Post)('portfolio/images'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Portföy resmi ekle (sadece worker)',
        description: 'Worker\'ların portföy resmi yüklemesi için. Max 10 resim eklenebilir. Güncel liste için GET /user kullanın.'
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['file'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Portföy resmi (max 5MB, jpg/jpeg/png)',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Portföy resmi eklendi. Response: { message: string, portfolioImages: string[], totalImages: number }'
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Geçersiz dosya, maksimum resim sayısı aşıldı (max 10), veya kullanıcı worker değil' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addPortfolioImage", null);
__decorate([
    (0, common_1.Get)('portfolio/images/:userId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Başka kullanıcının portföy resimlerini getir',
        description: 'Public endpoint - Başka bir kullanıcının (worker) portföy resimlerini görüntülemek için. Kendi portföy resimleriniz için GET /user kullanın.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Portföy resimleri. Response: { userId: string, portfolioImages: string[], totalImages: number }'
    }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserPortfolioImages", null);
__decorate([
    (0, common_1.Post)('portfolio/images/delete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Portföy resmini sil (sadece worker)',
        description: 'Belirtilen URL\'deki portföy resmini siler. Güncel portfolio listesi için GET /user kullanın.'
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['imageUrl'],
            properties: {
                imageUrl: {
                    type: 'string',
                    description: 'Silinecek resmin URL\'si',
                    example: '/uploads/portfolio-images/portfolio-1234567890-123456789.jpg',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Portföy resmi silindi. Response: { message: string, portfolioImages: string[], totalImages: number }'
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Geçersiz URL veya resim bulunamadı' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('imageUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deletePortfolioImage", null);
__decorate([
    (0, common_1.Post)('portfolio/images/delete-all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Tüm portföy resimlerini sil (sadece worker)',
        description: 'Kullanıcının tüm portföy resimlerini siler. Güncel bilgi için GET /user kullanın.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tüm portföy resimleri silindi. Response: { message: string, portfolioImages: [], totalImages: 0 }'
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteAllPortfolioImages", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Başka kullanıcının detaylarını getir (UUID ile)',
        description: 'Başka bir kullanıcının profil bilgilerini görüntülemek için kullanılır (chat, profil görüntüleme vb.). Kendi bilgileriniz için GET /user kullanın.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Kullanıcı bilgileri. Response: User entity (şifre hariç)'
    }),
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