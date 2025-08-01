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
exports.Comment = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Comment = class Comment {
};
exports.Comment = Comment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Comment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Comment.prototype, "commenterId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Comment.prototype, "commentedUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Comment.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Comment.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], Comment.prototype, "jobId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], Comment.prototype, "showName", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Comment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Comment.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', 'commentsGiven'),
    __metadata("design:type", Object)
], Comment.prototype, "commenter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', 'commentsReceived'),
    __metadata("design:type", Object)
], Comment.prototype, "commentedUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Job', { nullable: true }),
    __metadata("design:type", Object)
], Comment.prototype, "job", void 0);
exports.Comment = Comment = __decorate([
    (0, typeorm_1.Entity)('comments'),
    (0, typeorm_1.Index)(['commenterId']),
    (0, typeorm_1.Index)(['commentedUserId']),
    (0, typeorm_1.Index)(['jobId'])
], Comment);
//# sourceMappingURL=comment.entity.js.map