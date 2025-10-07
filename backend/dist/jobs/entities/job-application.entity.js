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
exports.JobApplication = exports.ApplicationTag = exports.ApplicationStatus = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["PENDING"] = "pending";
    ApplicationStatus["ACCEPTED"] = "accepted";
    ApplicationStatus["REJECTED"] = "rejected";
    ApplicationStatus["WITHDRAWN"] = "withdrawn";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
var ApplicationTag;
(function (ApplicationTag) {
    ApplicationTag["URGENT"] = "urgent";
    ApplicationTag["IMMEDIATE"] = "immediate";
    ApplicationTag["SCHEDULED"] = "scheduled";
})(ApplicationTag || (exports.ApplicationTag = ApplicationTag = {}));
let JobApplication = class JobApplication {
};
exports.JobApplication = JobApplication;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], JobApplication.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING,
    }),
    (0, swagger_1.ApiProperty)({ enum: ApplicationStatus }),
    __metadata("design:type", String)
], JobApplication.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ApplicationTag,
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({ enum: ApplicationTag, description: 'Başvuru zamanlaması: Acil, Hemen, İleri zamanlı', required: false }),
    __metadata("design:type", String)
], JobApplication.prototype, "tag", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], JobApplication.prototype, "coverLetter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], JobApplication.prototype, "proposedPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], JobApplication.prototype, "estimatedDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], JobApplication.prototype, "proposedStartDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], JobApplication.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], JobApplication.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Job', 'applications'),
    __metadata("design:type", Object)
], JobApplication.prototype, "job", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], JobApplication.prototype, "jobId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User'),
    __metadata("design:type", Object)
], JobApplication.prototype, "applicant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], JobApplication.prototype, "applicantId", void 0);
exports.JobApplication = JobApplication = __decorate([
    (0, typeorm_1.Entity)('job_applications'),
    (0, typeorm_1.Index)(['jobId', 'applicantId'], { unique: true }),
    (0, typeorm_1.Index)(['status'])
], JobApplication);
//# sourceMappingURL=job-application.entity.js.map