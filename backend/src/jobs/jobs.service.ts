import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobStatus } from './entities/job.entity';
import { JobApplication, ApplicationStatus } from './entities/job-application.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '../users/entities/user.entity';
import { UserInfo } from '../users/entities/user-info.entity';
import { UploadService } from '../upload/upload.service';
import * as fs from 'fs';
import * as path from 'path';

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
    private uploadService: UploadService,
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

  async createWithImages(createJobDto: any, images: Array<Express.Multer.File>, employerId: string): Promise<Job> {
    // Önce iş ilanını oluştur
    const job = await this.create(createJobDto, employerId);

    // Eğer resimler varsa yükle
    if (images && images.length > 0) {
      const imageUrls: string[] = [];

      // job-images klasörünü oluştur (eğer yoksa)
      const jobImagesPath = path.join(process.cwd(), 'uploads', 'job-images');
      if (!fs.existsSync(jobImagesPath)) {
        fs.mkdirSync(jobImagesPath, { recursive: true });
      }

      for (const image of images) {
        try {
          // Benzersiz dosya adı oluştur
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const extension = path.extname(image.originalname);
          const filename = `job-${uniqueSuffix}${extension}`;
          const filepath = path.join(jobImagesPath, filename);

          // Dosyayı kaydet
          fs.writeFileSync(filepath, image.buffer);

          // URL oluştur
          const imageUrl = this.uploadService.getJobImageUrl(filename);
          imageUrls.push(imageUrl);

          console.log('📷 İş resmi yüklendi:', filename);
        } catch (error) {
          console.error('❌ Resim yükleme hatası:', error);
        }
      }

      // Job'a resimleri ekle
      if (imageUrls.length > 0) {
        job.jobImages = imageUrls;
        await this.jobRepository.save(job);
      }
    }

    return job;
  }

  async addImages(jobId: string, images: Array<Express.Multer.File>, userId: string): Promise<Job> {
    const job = await this.findById(jobId);

    // Sadece iş sahibi resim ekleyebilir
    if (job.employerId !== userId) {
      throw new ForbiddenException('Bu işe resim ekleme yetkiniz yok');
    }

    // Maksimum 10 resim kontrolü
    const currentImageCount = job.jobImages ? job.jobImages.length : 0;
    if (currentImageCount + images.length > 10) {
      throw new BadRequestException(`Maksimum 10 resim yükleyebilirsiniz. Mevcut: ${currentImageCount}, Yeni: ${images.length}`);
    }

    const imageUrls: string[] = job.jobImages || [];

    // job-images klasörünü oluştur (eğer yoksa)
    const jobImagesPath = path.join(process.cwd(), 'uploads', 'job-images');
    if (!fs.existsSync(jobImagesPath)) {
      fs.mkdirSync(jobImagesPath, { recursive: true });
    }

    for (const image of images) {
      try {
        // Benzersiz dosya adı oluştur
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(image.originalname);
        const filename = `job-${uniqueSuffix}${extension}`;
        const filepath = path.join(jobImagesPath, filename);

        // Dosyayı kaydet
        fs.writeFileSync(filepath, image.buffer);

        // URL oluştur
        const imageUrl = this.uploadService.getJobImageUrl(filename);
        imageUrls.push(imageUrl);

        console.log('📷 İş resmi eklendi:', filename);
      } catch (error) {
        console.error('❌ Resim ekleme hatası:', error);
      }
    }

    // Job'u güncelle
    job.jobImages = imageUrls;
    return this.jobRepository.save(job);
  }

  async deleteImage(jobId: string, filename: string, userId: string): Promise<Job> {
    const job = await this.findById(jobId);

    // Sadece iş sahibi resim silebilir
    if (job.employerId !== userId) {
      throw new ForbiddenException('Bu işin resmini silme yetkiniz yok');
    }

    if (!job.jobImages || job.jobImages.length === 0) {
      throw new NotFoundException('İş ilanında resim bulunamadı');
    }

    // Resmi URL'den çıkar
    const imageUrl = this.uploadService.getJobImageUrl(filename);
    const imageIndex = job.jobImages.indexOf(imageUrl);

    if (imageIndex === -1) {
      throw new NotFoundException('Resim bulunamadı');
    }

    // URL'den kaldır
    job.jobImages.splice(imageIndex, 1);

    // Dosyayı fiziksel olarak sil
    try {
      await this.uploadService.deleteJobImage(filename);
      console.log('🗑️ İş resmi silindi:', filename);
    } catch (error) {
      console.error('❌ Resim silme hatası:', error);
    }

    // Job'u güncelle
    return this.jobRepository.save(job);
  }

  async findAll(filters?: any, user?: any): Promise<Job[]> {
    const query = this.jobRepository.createQueryBuilder('job')
      .leftJoinAndSelect('job.employer', 'employer')
      .leftJoinAndSelect('job.category', 'category')
      .leftJoinAndSelect('job.userInfo', 'userInfo'); // UserInfo ilişkisini ekle

    if (filters?.status) {
      query.andWhere('job.status = :status', { status: filters.status });
    }

    // Worker kullanıcıları için kategori filtreleme
    if (user?.userType === 'worker') {
      console.log('👷 Worker kullanıcısı için kategori filtreleme yapılıyor...');
      console.log('📋 Kullanıcının kategorileri:', user.categoryIds);
      
      if (user.categoryIds && user.categoryIds.length > 0) {
        // user_categories tablosu üzerinden filtreleme
        query.leftJoin('user_categories', 'uc', 'uc.userId = :userId', { userId: user.id });
        query.andWhere('job.categoryId = uc.categoryId');
        query.andWhere('uc.categoryId IN (:...categoryIds)', { categoryIds: user.categoryIds });
        
        console.log('🔍 Kategori filtresi eklendi. Aranan kategoriler:', user.categoryIds);
      } else {
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
      
      // Basit test: Konum filtresi olmadan tüm job'ları getir
      const allJobs = await this.jobRepository.find({
        where: { status: JobStatus.OPEN },
        relations: ['userInfo']
      });
      console.log('🔍 Konum filtresi olmadan toplam job sayısı:', allJobs.length);
      
      const jobsWithLocation = allJobs.filter(job => 
        job.userInfo && job.userInfo.latitude && job.userInfo.longitude
      );
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

  async findById(id: string): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['employer', 'category', 'applications', 'userInfo'],
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
      relations: ['employer', 'category', 'userInfo'],
      order: { createdAt: 'DESC' },
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
      relations: ['employer', 'category', 'userInfo'],
      order: { featuredAt: 'DESC' },
      take: limit,
    });
  }

  // Yüksek skorlu işleri getir (sistem otomatik seçimi)
  async getHighScoreJobs(limit: number = 10): Promise<Job[]> {
    return this.jobRepository.find({
      where: { status: JobStatus.OPEN },
      relations: ['employer', 'category', 'userInfo'],
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