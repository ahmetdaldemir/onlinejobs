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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CompleteUserDto {
}
exports.CompleteUserDto = CompleteUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Ad',
        example: 'Ahmet'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Soyad',
        example: 'Yılmaz'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'E-posta',
        example: 'ahmet@example.com'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Telefon',
        example: '5551234567'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Şifre (otomatik hash\'lenir)',
        example: 'newPassword123'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['worker', 'employer'],
        required: false,
        description: 'Kullanıcı tipi',
        example: 'worker'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['worker', 'employer']),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "userType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Biyografi',
        example: 'Deneyimli elektrikçi. 10 yıllık tecrübe.'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Profil resmi URL',
        example: '/uploads/profile-123456789.jpg'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "profileImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        type: [String],
        description: 'Kategori ID\'leri (UUID array)',
        example: ['4b1d469b-a737-4912-a902-40ec3eabe4f1', '741ac181-697a-4e85-9f6d-8e7e00ecf501']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CompleteUserDto.prototype, "categoryIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Online durumu',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CompleteUserDto.prototype, "isOnline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: '🔹 Şehir - Sadece WORKER için (User tablosuna kaydedilir)',
        example: 'İstanbul'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: '🔹 İlçe - Sadece WORKER için (User tablosuna kaydedilir)',
        example: 'Kadıköy'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: '🔹 Mahalle - Sadece WORKER için (User tablosuna kaydedilir)',
        example: 'Fenerbahçe Mahallesi'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "neighborhood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: '🔹 Enlem (latitude) - Sadece WORKER için! -90 ile 90 arası (User tablosuna kaydedilir)',
        example: 41.0082376,
        minimum: -90,
        maximum: 90
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return parseFloat(value);
        }
        return value;
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CompleteUserDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: '🔹 Boylam (longitude) - Sadece WORKER için! -180 ile 180 arası (User tablosuna kaydedilir)',
        example: 28.9783589,
        minimum: -180,
        maximum: 180
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return parseFloat(value);
        }
        return value;
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CompleteUserDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: '🔸 Adres adı - Sadece EMPLOYER için (UserInfo tablosuna kaydedilir)',
        example: 'Ev Adresim'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "addressName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: '🔸 Genel adres - Sadece EMPLOYER için (UserInfo tablosuna kaydedilir)',
        example: 'Bağdat Caddesi No:14, Kadıköy/İstanbul'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: '🔸 Bina numarası - Sadece EMPLOYER için (UserInfo tablosuna kaydedilir)',
        example: '12/A'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "buildingNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: '🔸 Kat bilgisi - Sadece EMPLOYER için (UserInfo tablosuna kaydedilir)',
        example: '3'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "floor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: '🔸 Daire numarası - Sadece EMPLOYER için (UserInfo tablosuna kaydedilir)',
        example: '8'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "apartmentNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: '🔸 Adres açıklaması - Sadece EMPLOYER için (UserInfo tablosuna kaydedilir)',
        example: 'Kapı kodu: 1234. Zile bastığınızda açılır.'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "description", void 0);
//# sourceMappingURL=complete-user.dto.js.map