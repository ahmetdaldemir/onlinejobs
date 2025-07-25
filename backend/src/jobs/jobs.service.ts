import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobStatus } from './entities/job.entity';
import { JobApplication, ApplicationStatus } from './entities/job-application.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(JobApplication)
    private applicationRepository: Repository<JobApplication>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationsService: NotificationsService,
  ) {}

  async create(createJobDto: any, employerId: string): Promise<Job> {
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
} 