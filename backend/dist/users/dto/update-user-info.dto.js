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
exports.UpdateUserInfoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateUserInfoDto {
}
exports.UpdateUserInfoDto = UpdateUserInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Adres adı' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserInfoDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Enlem (latitude)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateUserInfoDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Boylam (longitude)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateUserInfoDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Genel adres' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserInfoDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Mahalle/Cadde/Sokak' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserInfoDto.prototype, "neighborhood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Bina numarası' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserInfoDto.prototype, "buildingNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Kat bilgisi' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserInfoDto.prototype, "floor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Daire numarası' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserInfoDto.prototype, "apartmentNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Adres açıklaması' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserInfoDto.prototype, "description", void 0);
//# sourceMappingURL=update-user-info.dto.js.map