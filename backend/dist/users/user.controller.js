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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const complete_user_dto_1 = require("./dto/complete-user.dto");
let UserController = class UserController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getMyCompleteProfile(req) {
        return this.usersService.getCompleteUserProfile(req.user.sub);
    }
    async updateMyCompleteProfile(req, completeUserDto) {
        return this.usersService.updateCompleteUserProfile(req.user.sub, completeUserDto);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Kullanıcının tüm bilgilerini getir',
        description: `Token'dan kullanıcıyı bulup tüm bilgilerini döner.
    
    📊 Response İçeriği:
    • User bilgileri (id, firstName, lastName, email, phone, userType, bio, rating, vb.)
    • userCategories: [] - Kullanıcının seçtiği kategoriler
    • userVerifications: [] - Verification kayıtları
    • userVerified: boolean - En az 1 approved verification varsa true
    
    👷 WORKER ise (userType: 'worker'):
    • city, district, neighborhood, latitude, longitude - User objesinde gelir
    • userInfos: [] - BOŞ ARRAY (Worker'ların UserInfo kaydı olmaz)
    
    👔 EMPLOYER ise (userType: 'employer'):
    • city, district, neighborhood, latitude, longitude - NULL (Employer'da olmaz)
    • userInfos: [] - Employer'ın adresleri (birden fazla olabilir)`
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Kullanıcı bilgileri başarıyla getirildi. Response: { user bilgileri, userCategories: [], userInfos: [], userVerifications: [], userVerified: boolean }'
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Kullanıcı bulunamadı' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMyCompleteProfile", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Kullanıcının tüm bilgilerini güncelle',
        description: `Token'dan kullanıcıyı bulup bilgilerini günceller.
    
    🔹 User Bilgileri: firstName, lastName, email, phone, userType, bio, profileImage, categoryIds, isOnline, password
    
    👷 WORKER için (User tablosuna kaydedilir):
    • city (şehir)
    • district (ilçe)
    • neighborhood (mahalle)
    • latitude (enlem)
    • longitude (boylam)
    
    👔 EMPLOYER için (UserInfo tablosuna kaydedilir):
    • addressName (adres adı)
    • address (genel adres)
    • buildingNo (bina no)
    • floor (kat)
    • apartmentNo (daire no)
    • description (açıklama)
    
    ⚠️ Önemli Kurallar:
    • Sadece doldurulan alanlar güncellenir
    • Boş string veya null gönderilirse güncelleme yapılmaz
    • Worker'a UserInfo bilgileri gönderilemez
    • Employer'a konum bilgileri (city, district, vb.) gönderilemez
    • Şifre gönderilirse otomatik hash'lenir
    
    📊 Response: Güncellenmiş kullanıcı bilgileri (GET /user ile aynı format)`
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Kullanıcı bilgileri başarıyla güncellendi. Response: { user bilgileri, userInfos: [], userCategories: [], userVerifications: [], userVerified: boolean }'
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Geçersiz veri (Koordinat worker olmayana gönderilemez, geçersiz latitude/longitude değerleri, vb.)'
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Kullanıcı bulunamadı' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, complete_user_dto_1.CompleteUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMyCompleteProfile", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('User'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UserController);
//# sourceMappingURL=user.controller.js.map