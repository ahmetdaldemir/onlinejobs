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
exports.Job = exports.JobPriority = exports.JobStatus = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
var JobStatus;
(function (JobStatus) {
    JobStatus["OPEN"] = "open";
    JobStatus["CANCELLED"] = "cancelled";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
var JobPriority;
(function (JobPriority) {
    JobPriority["URGENT"] = "urgent";
    JobPriority["IMMEDIATE"] = "immediate";
    JobPriority["SCHEDULED"] = "scheduled";
    JobPriority["NORMAL"] = "normal";
})(JobPriority || (exports.JobPriority = JobPriority = {}));
let Job = class Job {
};
exports.Job = Job;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Job.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Job.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Job.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: JobStatus,
        default: JobStatus.OPEN,
    }),
    (0, swagger_1.ApiProperty)({ enum: JobStatus }),
    __metadata("design:type", String)
], Job.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Job.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('UserInfo', { nullable: true }),
    __metadata("design:type", Object)
], Job.prototype, "userInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Job.prototype, "userInfoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Job.prototype, "scheduledDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Job.prototype, "scheduledTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: JobPriority,
        default: JobPriority.NORMAL,
    }),
    (0, swagger_1.ApiProperty)({
        enum: JobPriority,
        description: 'İş önceliği: Acil, Hemen, İleri zamanlı, Normal',
        default: JobPriority.NORMAL
    }),
    __metadata("design:type", String)
], Job.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    (0, swagger_1.ApiProperty)({ type: [String], description: 'İş ilanı resimleri (URL\'ler)' }),
    __metadata("design:type", Array)
], Job.prototype, "jobImages", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Job.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Job.prototype, "applicationCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, swagger_1.ApiProperty)({ description: 'Admin tarafından manuel olarak öne çıkarılan işler' }),
    __metadata("design:type", Boolean)
], Job.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    (0, swagger_1.ApiProperty)({ description: 'Sistem tarafından hesaplanan öne çıkarma skoru' }),
    __metadata("design:type", Number)
], Job.prototype, "featuredScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Öne çıkarılma tarihi' }),
    __metadata("design:type", Date)
], Job.prototype, "featuredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Öne çıkarılma sebebi' }),
    __metadata("design:type", String)
], Job.prototype, "featuredReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Job.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], Job.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', 'jobs'),
    __metadata("design:type", Object)
], Job.prototype, "employer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Job.prototype, "employerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Category', { nullable: true }),
    __metadata("design:type", Object)
], Job.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Job.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('JobApplication', 'job'),
    __metadata("design:type", Array)
], Job.prototype, "applications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Comment', 'job'),
    __metadata("design:type", Array)
], Job.prototype, "comments", void 0);
exports.Job = Job = __decorate([
    (0, typeorm_1.Entity)('jobs'),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['categoryId']),
    (0, typeorm_1.Index)(['employerId'])
], Job);
//# sourceMappingURL=job.entity.js.map