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
exports.UpdateVerificationStatusDto = exports.UploadVerificationDocumentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_verification_entity_1 = require("../entities/user-verification.entity");
class UploadVerificationDocumentDto {
}
exports.UploadVerificationDocumentDto = UploadVerificationDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: user_verification_entity_1.DocumentType,
        description: 'Yüklenecek belge türü',
        example: user_verification_entity_1.DocumentType.MASTERY_CERTIFICATE
    }),
    (0, class_validator_1.IsEnum)(user_verification_entity_1.DocumentType),
    __metadata("design:type", String)
], UploadVerificationDocumentDto.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Belge için açıklama',
        example: '2023 yılı ustalık belgesi'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadVerificationDocumentDto.prototype, "description", void 0);
class UpdateVerificationStatusDto {
}
exports.UpdateVerificationStatusDto = UpdateVerificationStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['pending', 'approved', 'rejected'],
        description: 'Doğrulama durumu'
    }),
    (0, class_validator_1.IsEnum)(['pending', 'approved', 'rejected']),
    __metadata("design:type", String)
], UpdateVerificationStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Admin notları veya red sebebi'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVerificationStatusDto.prototype, "adminNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Red sebebi (status rejected ise)'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVerificationStatusDto.prototype, "rejectionReason", void 0);
//# sourceMappingURL=upload-verification-document.dto.js.map