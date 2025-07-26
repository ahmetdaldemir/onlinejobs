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
exports.AdminResponseDto = exports.AdminRegisterDto = exports.AdminLoginDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AdminLoginDto {
}
exports.AdminLoginDto = AdminLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdminLoginDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdminLoginDto.prototype, "password", void 0);
class AdminRegisterDto {
}
exports.AdminRegisterDto = AdminRegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdminRegisterDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdminRegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Admin' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdminRegisterDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'User' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdminRegisterDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin@example.com' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdminRegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AdminRegisterDto.prototype, "isSuperAdmin", void 0);
class AdminResponseDto {
}
exports.AdminResponseDto = AdminResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AdminResponseDto.prototype, "admin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdminResponseDto.prototype, "statusCode", void 0);
//# sourceMappingURL=admin-auth.dto.js.map