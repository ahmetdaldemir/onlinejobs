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
const upload_service_1 = require("../upload/upload.service");
const fs = require("fs");
const path = require("path");
let JobsService = class JobsService {
    constructor(jobRepository, applicationRepository, userRepository, userInfoRepository, notificationsService, uploadService) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
        this.notificationsService = notificationsService;
        this.uploadService = uploadService;
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
    async createWithImages(createJobDto, images, employerId) {
        const job = await this.create(createJobDto, employerId);
        if (images && images.length > 0) {
            const imageUrls = [];
            const jobImagesPath = path.join(process.cwd(), 'uploads', 'job-images');
            if (!fs.existsSync(jobImagesPath)) {
                fs.mkdirSync(jobImagesPath, { recursive: true });
            }
            for (const image of images) {
                try {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const extension = path.extname(image.originalname);
                    const filename = `job-${uniqueSuffix}${extension}`;
                    const filepath = path.join(jobImagesPath, filename);
                    fs.writeFileSync(filepath, image.buffer);
                    const imageUrl = this.uploadService.getJobImageUrl(filename);
                    imageUrls.push(imageUrl);
                    console.log('📷 İş resmi yüklendi:', filename);
                }
                catch (error) {
                    console.error('❌ Resim yükleme hatası:', error);
                }
            }
            if (imageUrls.length > 0) {
                job.jobImages = imageUrls;
                await this.jobRepository.save(job);
            }
        }
        return job;
    }
    async addImages(jobId, images, userId) {
        const job = await this.findById(jobId);
        if (job.employerId !== userId) {
            throw new common_1.ForbiddenException('Bu işe resim ekleme yetkiniz yok');
        }
        const currentImageCount = job.jobImages ? job.jobImages.length : 0;
        if (currentImageCount + images.length > 10) {
            throw new common_1.BadRequestException(`Maksimum 10 resim yükleyebilirsiniz. Mevcut: ${currentImageCount}, Yeni: ${images.length}`);
        }
        const imageUrls = job.jobImages || [];
        const jobImagesPath = path.join(process.cwd(), 'uploads', 'job-images');
        if (!fs.existsSync(jobImagesPath)) {
            fs.mkdirSync(jobImagesPath, { recursive: true });
        }
        for (const image of images) {
            try {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const extension = path.extname(image.originalname);
                const filename = `job-${uniqueSuffix}${extension}`;
                const filepath = path.join(jobImagesPath, filename);
                fs.writeFileSync(filepath, image.buffer);
                const imageUrl = this.uploadService.getJobImageUrl(filename);
                imageUrls.push(imageUrl);
                console.log('📷 İş resmi eklendi:', filename);
            }
            catch (error) {
                console.error('❌ Resim ekleme hatası:', error);
            }
        }
        job.jobImages = imageUrls;
        return this.jobRepository.save(job);
    }
    async deleteImage(jobId, filename, userId) {
        const job = await this.findById(jobId);
        if (job.employerId !== userId) {
            throw new common_1.ForbiddenException('Bu işin resmini silme yetkiniz yok');
        }
        if (!job.jobImages || job.jobImages.length === 0) {
            throw new common_1.NotFoundException('İş ilanında resim bulunamadı');
        }
        const imageUrl = this.uploadService.getJobImageUrl(filename);
        const imageIndex = job.jobImages.indexOf(imageUrl);
        if (imageIndex === -1) {
            throw new common_1.NotFoundException('Resim bulunamadı');
        }
        job.jobImages.splice(imageIndex, 1);
        try {
            await this.uploadService.deleteJobImage(filename);
            console.log('🗑️ İş resmi silindi:', filename);
        }
        catch (error) {
            console.error('❌ Resim silme hatası:', error);
        }
        return this.jobRepository.save(job);
    }
    async findAll(filters, user) {
        const query = this.jobRepository.createQueryBuilder('job')
            .leftJoinAndSelect('job.employer', 'employer')
            .leftJoinAndSelect('job.category', 'category')
            .leftJoinAndSelect('job.userInfo', 'userInfo');
        if (filters?.status) {
            query.andWhere('job.status = :status', { status: filters.status });
        }
        if (user?.userType === 'worker') {
            console.log('👷 Worker kullanıcısı için kategori filtreleme yapılıyor...');
            console.log('📋 Kullanıcının kategorileri:', user.categoryIds);
            if (user.categoryIds && user.categoryIds.length > 0) {
                query.leftJoin('user_categories', 'uc', 'uc.userId = :userId', { userId: user.id });
                query.andWhere('job.categoryId = uc.categoryId');
                query.andWhere('uc.categoryId IN (:...categoryIds)', { categoryIds: user.categoryIds });
                console.log('🔍 Kategori filtresi eklendi. Aranan kategoriler:', user.categoryIds);
            }
            else {
                console.log('⚠️ Worker kullanıcısının seçili kategorisi yok, tüm işler gösterilecek');
            }
        }
        if (filters?.categoryId) {
            query.andWhere('job.categoryId = :categoryId', { categoryId: filters.categoryId });
        }
        if (filters?.employerId) {
            query.andWhere('job.employerId = :employerId', { employerId: filters.employerId });
        }
        if (filters?.latitude && filters?.longitude && filters?.radius) {
            console.log('🔍 Konum bazlı filtreleme başlatılıyor...');
            console.log('📍 Koordinatlar:', { latitude: filters.latitude, longitude: filters.longitude, radius: filters.radius });
            query.andWhere(`
        (6371 * acos(cos(radians(:latitude)) * cos(radians(userInfo.latitude)) * 
        cos(radians(userInfo.longitude) - radians(:longitude)) + 
        sin(radians(:latitude)) * sin(radians(userInfo.latitude)))) <= :radius
      `, {
                latitude: filters.latitude,
                longitude: filters.longitude,
                radius: filters.radius
            });
            console.log('🔍 Konum filtresi eklendi, SQL sorgusu hazırlanıyor...');
        }
        const results = await query.getMany();
        console.log('📊 Sorgu sonucu:', results.length, 'iş ilanı bulundu');
        if (results.length === 0) {
            console.log('⚠️ Hiç iş ilanı bulunamadı. Olası nedenler:');
            console.log('   - Job kayıtlarında userInfoId null');
            console.log('   - UserInfo kayıtlarında latitude/longitude null');
            console.log('   - Belirtilen koordinatlarda 50km yarıçapında iş yok');
            console.log('   - Worker kullanıcısının kategorileri ile eşleşen iş yok');
            const allJobs = await this.jobRepository.find({
                where: { status: job_entity_1.JobStatus.OPEN },
                relations: ['userInfo']
            });
            console.log('🔍 Konum filtresi olmadan toplam job sayısı:', allJobs.length);
            const jobsWithLocation = allJobs.filter(job => job.userInfo && job.userInfo.latitude && job.userInfo.longitude);
            console.log('📍 Konum bilgisi olan job sayısı:', jobsWithLocation.length);
            if (jobsWithLocation.length > 0) {
                console.log('📍 Konum bilgisi olan job örnekleri:');
                jobsWithLocation.slice(0, 3).forEach(job => {
                    console.log(`   - Job ID: ${job.id}, Title: ${job.title}`);
                    console.log(`     Lat: ${job.userInfo.latitude}, Lng: ${job.userInfo.longitude}`);
                });
            }
        }
        return results;
    }
    async findById(id) {
        const job = await this.jobRepository.findOne({
            where: { id },
            relations: ['employer', 'category', 'applications', 'userInfo'],
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
            relations: ['employer', 'category', 'userInfo'],
            order: { createdAt: 'DESC' },
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
            relations: ['employer', 'category', 'userInfo'],
            order: { featuredAt: 'DESC' },
            take: limit,
        });
    }
    async getHighScoreJobs(limit = 10) {
        return this.jobRepository.find({
            where: { status: job_entity_1.JobStatus.OPEN },
            relations: ['employer', 'category', 'userInfo'],
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
        notifications_service_1.NotificationsService,
        upload_service_1.UploadService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map