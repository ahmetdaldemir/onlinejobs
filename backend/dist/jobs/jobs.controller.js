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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jobs_service_1 = require("./jobs.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const job_application_entity_1 = require("./entities/job-application.entity");
const create_job_dto_1 = require("./dto/create-job.dto");
const users_service_1 = require("../users/users.service");
const common_2 = require("@nestjs/common");
let JobsController = class JobsController {
    constructor(jobsService, usersService) {
        this.jobsService = jobsService;
        this.usersService = usersService;
    }
    async create(createJobDto, req) {
        const user = await this.usersService.findById(req.user.sub);
        if (user.userType !== 'employer') {
            throw new common_1.ForbiddenException('Sadece employer\'lar iş ilanı oluşturabilir');
        }
        return this.jobsService.create(createJobDto, req.user.sub);
    }
    async findAll(filters) {
        return this.jobsService.findAll(filters);
    }
    async getMyApplications(req) {
        return this.jobsService.getMyApplications(req.user.sub);
    }
    async getMyJobsApplications(req) {
        return this.jobsService.getMyJobsApplications(req.user.sub);
    }
    async findById(id) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new common_2.BadRequestException(`Geçersiz UUID formatı: ${id}. Lütfen geçerli bir iş ilanı ID'si girin.`);
        }
        return this.jobsService.findById(id);
    }
    async update(id, updateJobDto, req) {
        return this.jobsService.update(id, updateJobDto, req.user.sub);
    }
    async delete(id, req) {
        return this.jobsService.delete(id, req.user.sub);
    }
    async applyForJob(jobId, applicationData, req) {
        return this.jobsService.applyForJob(jobId, req.user.sub, applicationData);
    }
    async updateApplicationStatus(applicationId, status, req) {
        return this.jobsService.updateApplicationStatus(applicationId, status, req.user.sub);
    }
    async getJobApplications(jobId, req) {
        return this.jobsService.getJobApplications(jobId, req.user.sub);
    }
};
exports.JobsController = JobsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'İş ilanı oluştur (Sadece employer\'lar)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'İş ilanı oluşturuldu' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_job_dto_1.CreateJobDto, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'İş ilanlarını listele' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'employerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'latitude', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'longitude', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'radius', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'İş ilanları listelendi' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my/applications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kendi başvurularımı listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Başvurular listelendi' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getMyApplications", null);
__decorate([
    (0, common_1.Get)('my/jobs/applications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Employer: İş ilanlarıma gelen başvuruları listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'İş ilanlarıma gelen başvurular listelendi' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getMyJobsApplications", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'İş ilanı detayı' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'İş ilanı detayı' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'İş ilanı bulunamadı' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Geçersiz UUID formatı' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'İş ilanını güncelle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'İş ilanı güncellendi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'İş ilanını sil' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'İş ilanı silindi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/apply'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'İş için başvuru yap' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Başvuru yapıldı' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "applyForJob", null);
__decorate([
    (0, common_1.Put)('applications/:id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Başvuru durumunu güncelle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Başvuru durumu güncellendi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "updateApplicationStatus", null);
__decorate([
    (0, common_1.Get)(':id/applications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'İş ilanının başvurularını listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Başvurular listelendi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getJobApplications", null);
exports.JobsController = JobsController = __decorate([
    (0, swagger_1.ApiTags)('Jobs'),
    (0, common_1.Controller)('jobs'),
    __metadata("design:paramtypes", [jobs_service_1.JobsService,
        users_service_1.UsersService])
], JobsController);
//# sourceMappingURL=jobs.controller.js.map