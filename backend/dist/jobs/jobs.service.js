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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("./entities/job.entity");
const job_application_entity_1 = require("./entities/job-application.entity");
const notifications_service_1 = require("../notifications/notifications.service");
const user_entity_1 = require("../users/entities/user.entity");
let JobsService = class JobsService {
    constructor(jobRepository, applicationRepository, userRepository, notificationsService) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.notificationsService = notificationsService;
    }
    async create(createJobDto, employerId) {
        const job = this.jobRepository.create({
            ...createJobDto,
            employerId,
        });
        const savedJob = await this.jobRepository.save(job);
        const employer = await this.userRepository.findOne({
            where: { id: employerId }
        });
        if (employer) {
            await this.notificationsService.createJobNotification(savedJob, employer);
        }
        return savedJob;
    }
    async findAll(filters) {
        const query = this.jobRepository
            .createQueryBuilder('job')
            .leftJoinAndSelect('job.employer', 'employer')
            .leftJoinAndSelect('job.category', 'category');
        if (filters?.status) {
            query.andWhere('job.status = :status', { status: filters.status });
        }
        if (filters?.categoryId) {
            query.andWhere('job.categoryId = :categoryId', { categoryId: filters.categoryId });
        }
        if (filters?.employerId) {
            query.andWhere('job.employerId = :employerId', { employerId: filters.employerId });
        }
        if (filters?.latitude && filters?.longitude && filters?.radius) {
            query.andWhere(`
        (6371 * acos(cos(radians(:latitude)) * cos(radians(job.latitude)) * 
        cos(radians(job.longitude) - radians(:longitude)) + 
        sin(radians(:latitude)) * sin(radians(job.latitude)))) <= :radius
      `, {
                latitude: filters.latitude,
                longitude: filters.longitude,
                radius: filters.radius
            });
        }
        return query.getMany();
    }
    async findById(id) {
        const job = await this.jobRepository.findOne({
            where: { id },
            relations: ['employer', 'category', 'applications'],
        });
        if (!job) {
            throw new common_1.NotFoundException('İş ilanı bulunamadı');
        }
        return job;
    }
    async update(id, updateJobDto, userId) {
        const job = await this.findById(id);
        if (job.employerId !== userId) {
            throw new common_1.ForbiddenException('Bu iş ilanını düzenleme yetkiniz yok');
        }
        Object.assign(job, updateJobDto);
        return this.jobRepository.save(job);
    }
    async delete(id, userId) {
        const job = await this.findById(id);
        if (job.employerId !== userId) {
            throw new common_1.ForbiddenException('Bu iş ilanını silme yetkiniz yok');
        }
        await this.jobRepository.remove(job);
    }
    async applyForJob(jobId, applicantId, applicationData) {
        const job = await this.findById(jobId);
        const existingApplication = await this.applicationRepository.findOne({
            where: { jobId, applicantId },
        });
        if (existingApplication) {
            throw new common_1.ForbiddenException('Bu iş için zaten başvuru yapmışsınız');
        }
        const application = this.applicationRepository.create({
            ...applicationData,
            jobId,
            applicantId,
        });
        return this.applicationRepository.save(application);
    }
    async updateApplicationStatus(applicationId, status, employerId) {
        const application = await this.applicationRepository.findOne({
            where: { id: applicationId },
            relations: ['job'],
        });
        if (!application) {
            throw new common_1.NotFoundException('Başvuru bulunamadı');
        }
        if (application.job.employerId !== employerId) {
            throw new common_1.ForbiddenException('Bu başvuruyu güncelleme yetkiniz yok');
        }
        application.status = status;
        return this.applicationRepository.save(application);
    }
    async getMyApplications(userId) {
        return this.applicationRepository.find({
            where: { applicantId: userId },
            relations: ['job', 'job.employer', 'job.category'],
        });
    }
    async getJobApplications(jobId, employerId) {
        const job = await this.findById(jobId);
        if (job.employerId !== employerId) {
            throw new common_1.ForbiddenException('Bu işin başvurularını görme yetkiniz yok');
        }
        return this.applicationRepository.find({
            where: { jobId },
            relations: ['applicant'],
        });
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(1, (0, typeorm_1.InjectRepository)(job_application_entity_1.JobApplication)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map