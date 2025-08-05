import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobStatus } from './entities/job.entity';
import { JobApplication, ApplicationStatus } from './entities/job-application.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '../users/entities/user.entity';
import { UserInfo } from '../users/entities/user-info.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(JobApplication)
    private applicationRepository: Repository<JobApplication>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
    private notificationsService: NotificationsService,
  ) {}

  async create(createJobDto: any, employerId: string): Promise<Job> {
    // userInfoId boş string ise null yap
    if (createJobDto.userInfoId === '') {
      createJobDto.userInfoId = null;
    }

    // Eğer userInfoId verilmişse, konum bilgilerini de ekle
    if (createJobDto.userInfoId) {
      // UserInfo'dan konum bilgilerini al
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
    
    const savedJob = await this.jobRepository.save(job as unknown as Job);
    
    // Employer bilgilerini al
    const employer = await this.userRepository.findOne({
      where: { id: employerId }
    });

    // Bildirim gönder
    if (employer) {
      await this.notificationsService.createJobNotification(savedJob, employer);
    }

    return savedJob;
  }

  async findAll(filters?: any): Promise<Job[]> {
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

  async findById(id: string): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['employer', 'category', 'applications'],
    });

    if (!job) {
      throw new NotFoundException('İş ilanı bulunamadı');
    }

    return job;
  }

  async update(id: string, updateJobDto: any, userId: string): Promise<Job> {
    const job = await this.findById(id);

    if (job.employerId !== userId) {
      throw new ForbiddenException('Bu iş ilanını düzenleme yetkiniz yok');
    }

    Object.assign(job, updateJobDto);
    return this.jobRepository.save(job);
  }

  async delete(id: string, userId: string): Promise<void> {
    const job = await this.findById(id);

    if (job.employerId !== userId) {
      throw new ForbiddenException('Bu iş ilanını silme yetkiniz yok');
    }

    await this.jobRepository.remove(job);
  }

  async applyForJob(jobId: string, applicantId: string, applicationData: any): Promise<JobApplication> {
    const job = await this.findById(jobId);

    // Daha önce başvuru yapılmış mı kontrol et
    const existingApplication = await this.applicationRepository.findOne({
      where: { jobId, applicantId },
    });

    if (existingApplication) {
      throw new ForbiddenException('Bu iş için zaten başvuru yapmışsınız');
    }

    const application = this.applicationRepository.create({
      ...applicationData,
      jobId,
      applicantId,
    });

    return this.applicationRepository.save(application as unknown as JobApplication);
  }

  async updateApplicationStatus(
    applicationId: string, 
    status: ApplicationStatus, 
    employerId: string
  ): Promise<JobApplication> {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['job'],
    });

    if (!application) {
      throw new NotFoundException('Başvuru bulunamadı');
    }

    if (application.job.employerId !== employerId) {
      throw new ForbiddenException('Bu başvuruyu güncelleme yetkiniz yok');
    }

    application.status = status;
    return this.applicationRepository.save(application);
  }

  async getMyApplications(userId: string): Promise<JobApplication[]> {
    return this.applicationRepository.find({
      where: { applicantId: userId },
      relations: ['job', 'job.employer', 'job.category'],
    });
  }

  async getMyJobs(employerId: string): Promise<Job[]> {
    return this.jobRepository.find({
      where: { employerId },
      relations: ['employer', 'category', 'applications'],
    });
  }

  async getMyJobsApplications(employerId: string): Promise<JobApplication[]> {
    return this.applicationRepository.find({
      where: { job: { employerId } },
      relations: ['job', 'job.employer', 'job.category', 'applicant'],
    });
  }

  async getJobApplications(jobId: string, employerId: string): Promise<JobApplication[]> {
    const job = await this.findById(jobId);

    if (job.employerId !== employerId) {
      throw new ForbiddenException('Bu işin başvurularını görme yetkiniz yok');
    }

    return this.applicationRepository.find({
      where: { jobId },
      relations: ['applicant'],
    });
  }

  // Öne çıkan işleri getir
  async getFeaturedJobs(limit: number = 10): Promise<Job[]> {
    return this.jobRepository.find({
      where: { isFeatured: true, status: JobStatus.OPEN },
      relations: ['employer', 'category'],
      order: { featuredAt: 'DESC' },
      take: limit,
    });
  }

  // Yüksek skorlu işleri getir (sistem otomatik seçimi)
  async getHighScoreJobs(limit: number = 10): Promise<Job[]> {
    return this.jobRepository.find({
      where: { status: JobStatus.OPEN },
      relations: ['employer', 'category'],
      order: { featuredScore: 'DESC' },
      take: limit,
    });
  }

  // Admin tarafından öne çıkar
  async setFeatured(jobId: string, isFeatured: boolean, reason?: string): Promise<Job> {
    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    
    if (!job) {
      throw new NotFoundException('İş bulunamadı');
    }

    job.isFeatured = isFeatured;
    job.featuredAt = isFeatured ? new Date() : null;
    job.featuredReason = reason || null;

    return this.jobRepository.save(job);
  }

  // Öne çıkarma skorunu hesapla ve güncelle
  async calculateFeaturedScore(jobId: string): Promise<Job> {
    const job = await this.jobRepository.findOne({ 
      where: { id: jobId },
      relations: ['applications']
    });
    
    if (!job) {
      throw new NotFoundException('İş bulunamadı');
    }

    // Skor hesaplama algoritması
    let score = 0;
    
    // Görüntülenme sayısı (ağırlık: 0.3)
    score += job.viewCount * 0.3;
    
    // Başvuru sayısı (ağırlık: 0.4)
    score += job.applicationCount * 0.4;
    
    // Aciliyet (ağırlık: 0.2)
    if (job.isUrgent) {
      score += 50 * 0.2;
    }
    
    // Yeni işler için bonus (ağırlık: 0.1)
    const daysSinceCreation = (Date.now() - job.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation <= 7) {
      score += 30 * 0.1;
    }
    
    // Bütçe bonusu (yüksek bütçeli işler)
    if (job.budget) {
      const budget = parseInt(job.budget);
      if (budget > 1000) {
        score += 20;
      }
    }

    job.featuredScore = Math.round(score);
    return this.jobRepository.save(job);
  }

  // Tüm işlerin skorlarını güncelle (cron job için)
  async updateAllFeaturedScores(): Promise<void> {
    const jobs = await this.jobRepository.find({
      where: { status: JobStatus.OPEN }
    });

    for (const job of jobs) {
      await this.calculateFeaturedScore(job.id);
    }
  }

  // İş görüntülendiğinde skor güncelle
  async incrementViewCount(jobId: string): Promise<void> {
    await this.jobRepository.increment({ id: jobId }, 'viewCount', 1);
    
    // Skoru da güncelle
    await this.calculateFeaturedScore(jobId);
  }
} 