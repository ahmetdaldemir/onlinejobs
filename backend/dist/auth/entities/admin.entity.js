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
exports.Admin = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
let Admin = class Admin {
};
exports.Admin = Admin;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Admin.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, unique: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Admin.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], Admin.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Admin.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Admin.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Admin.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], Admin.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], Admin.prototype, "isSuperAdmin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Admin.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Admin.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Admin.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Admin.prototype, "lastLoginAt", void 0);
exports.Admin = Admin = __decorate([
    (0, typeorm_1.Entity)('admins'),
    (0, typeorm_1.Index)(['username'], { unique: true })
], Admin);
//# sourceMappingURL=admin.entity.js.map