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
const user_info_entity_1 = require("../users/entities/user-info.entity");
let JobsService = class JobsService {
    constructor(jobRepository, applicationRepository, userRepository, userInfoRepository, notificationsService) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
        this.notificationsService = notificationsService;
    }
    async create(createJobDto, employerId) {
        if (createJobDto.userInfoId === '') {
            createJobDto.userInfoId = null;
        }
        if (createJobDto.userInfoId) {
            const userInfo = await this.userInfoRepository.findOne({
                where: { id: createJobDto.userInfoId }
            });
            if (userInfo) {
                createJobDto.latitude = userInfo.latitude;
                createJobDto.longitude = userInfo.longitude;
                createJobDto.location = userInfo.address;
            }
        }
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
    async getMyJobs(employerId) {
        return this.jobRepository.find({
            where: { employerId },
            relations: ['employer', 'category', 'applications'],
        });
    }
    async getMyJobsApplications(employerId) {
        return this.applicationRepository.find({
            where: { job: { employerId } },
            relations: ['job', 'job.employer', 'job.category', 'applicant'],
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
    async getFeaturedJobs(limit = 10) {
        return this.jobRepository.find({
            where: { isFeatured: true, status: job_entity_1.JobStatus.OPEN },
            relations: ['employer', 'category'],
            order: { featuredAt: 'DESC' },
            take: limit,
        });
    }
    async getHighScoreJobs(limit = 10) {
        return this.jobRepository.find({
            where: { status: job_entity_1.JobStatus.OPEN },
            relations: ['employer', 'category'],
            order: { featuredScore: 'DESC' },
            take: limit,
        });
    }
    async setFeatured(jobId, isFeatured, reason) {
        const job = await this.jobRepository.findOne({ where: { id: jobId } });
        if (!job) {
            throw new common_1.NotFoundException('İş bulunamadı');
        }
        job.isFeatured = isFeatured;
        job.featuredAt = isFeatured ? new Date() : null;
        job.featuredReason = reason || null;
        return this.jobRepository.save(job);
    }
    async calculateFeaturedScore(jobId) {
        const job = await this.jobRepository.findOne({
            where: { id: jobId },
            relations: ['applications']
        });
        if (!job) {
            throw new common_1.NotFoundException('İş bulunamadı');
        }
        let score = 0;
        score += job.viewCount * 0.3;
        score += job.applicationCount * 0.4;
        if (job.isUrgent) {
            score += 50 * 0.2;
        }
        const daysSinceCreation = (Date.now() - job.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceCreation <= 7) {
            score += 30 * 0.1;
        }
        if (job.budget) {
            const budget = parseInt(job.budget);
            if (budget > 1000) {
                score += 20;
            }
        }
        job.featuredScore = Math.round(score);
        return this.jobRepository.save(job);
    }
    async updateAllFeaturedScores() {
        const jobs = await this.jobRepository.find({
            where: { status: job_entity_1.JobStatus.OPEN }
        });
        for (const job of jobs) {
            await this.calculateFeaturedScore(job.id);
        }
    }
    async incrementViewCount(jobId) {
        await this.jobRepository.increment({ id: jobId }, 'viewCount', 1);
        await this.calculateFeaturedScore(jobId);
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(1, (0, typeorm_1.InjectRepository)(job_application_entity_1.JobApplication)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(user_info_entity_1.UserInfo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map