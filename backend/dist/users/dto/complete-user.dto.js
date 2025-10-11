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
class CompleteUserDto {
}
exports.CompleteUserDto = CompleteUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Ad' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Soyad' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'E-posta' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Telefon' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Şifre' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['worker', 'employer'], required: false, description: 'Kullanıcı tipi' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['worker', 'employer']),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "userType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Biyografi' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Profil resmi URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "profileImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: [String], description: 'Kategori ID\'leri (sadece worker için)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CompleteUserDto.prototype, "categoryIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Online durumu' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CompleteUserDto.prototype, "isOnline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Adres adı' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "addressName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Enlem (latitude) - Sadece worker için' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CompleteUserDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Boylam (longitude) - Sadece worker için' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CompleteUserDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Genel adres' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Mahalle/Cadde/Sokak' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "neighborhood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Bina numarası' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "buildingNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Kat bilgisi' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "floor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Daire numarası' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "apartmentNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Adres açıklaması' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUserDto.prototype, "description", void 0);
//# sourceMappingURL=complete-user.dto.js.map