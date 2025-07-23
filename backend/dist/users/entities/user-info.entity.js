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
exports.UserInfo = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("./user.entity");
let UserInfo = class UserInfo {
};
exports.UserInfo = UserInfo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserInfo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserInfo.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", user_entity_1.User)
], UserInfo.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8, nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserInfo.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8, nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserInfo.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserInfo.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Açıklama' }),
    __metadata("design:type", String)
], UserInfo.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Mahalle/Cadde/Sokak' }),
    __metadata("design:type", String)
], UserInfo.prototype, "neighborhood", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Bina No' }),
    __metadata("design:type", String)
], UserInfo.prototype, "buildingNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Kat' }),
    __metadata("design:type", String)
], UserInfo.prototype, "floor", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Daire No' }),
    __metadata("design:type", String)
], UserInfo.prototype, "apartmentNo", void 0);
exports.UserInfo = UserInfo = __decorate([
    (0, typeorm_1.Entity)('user_infos')
], UserInfo);
//# sourceMappingURL=user-info.entity.js.map