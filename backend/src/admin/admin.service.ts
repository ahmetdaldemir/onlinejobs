import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Like } from 'typeorm';
import { User, UserStatus } from '../users/entities/user.entity';
import { UserInfo } from '../users/entities/user-info.entity';
import { Job, JobStatus } from '../jobs/entities/job.entity';
import { Message } from '../messages/entities/message.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { CreateCategoryDto } from '../categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../categories/dto/update-category.dto';
import * as bcrypt from 'bcryptjs';
import { JobApplication } from '../jobs/entities/job-application.entity';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(JobApplication)
    private jobApplicationRepository: Repository<JobApplication>,
    private uploadService: UploadService,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      onlineUsers,
      totalJobs,
      activeJobs,
      totalMessages,
      totalCategories,
      userTypes,
      jobStatuses,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { isOnline: true } }),
      this.jobRepository.count(),
      this.jobRepository.count({ where: { status: JobStatus.OPEN } }),
      this.messageRepository.count(),
      this.categoryRepository.count(),
      this.getUserTypeStats(),
      this.getJobStatusStats(),
    ]);

    return {
      users: {
        total: totalUsers,
        online: onlineUsers,
        offline: totalUsers - onlineUsers,
        types: userTypes,
      },
      jobs: {
        total: totalJobs,
        active: activeJobs,
        completed: totalJobs - activeJobs,
        statuses: jobStatuses,
      },
      messages: {
        total: totalMessages,
      },
      categories: {
        total: totalCategories,
      },
      summary: {
        totalUsers,
        onlineUsers,
        totalJobs,
        activeJobs,
        totalMessages,
        totalCategories,
      },
    };
  }

  async getUserStats() {
    const [totalUsers, onlineUsers, workerUsers, employerUsers] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { isOnline: true } }),
      this.userRepository.count({ where: { userType: 'worker' } }),
      this.userRepository.count({ where: { userType: 'employer' } }),
    ]);

    return {
      total: totalUsers,
      online: onlineUsers,
      offline: totalUsers - onlineUsers,
      workers: workerUsers,
      employers: employerUsers,
      onlinePercentage: totalUsers > 0 ? ((onlineUsers / totalUsers) * 100).toFixed(2) : 0,
    };
  }

  async getJobStats() {
    const [totalJobs, openJobs, cancelledJobs, featuredJobs] = await Promise.all([
      this.jobRepository.count(),
      this.jobRepository.count({ where: { status: JobStatus.OPEN } }),
      this.jobRepository.count({ where: { status: JobStatus.CANCELLED } }),
      this.jobRepository.count({ where: { isFeatured: true } }),
    ]);

    return {
      total: totalJobs,
      open: openJobs,
      cancelled: cancelledJobs,
      featured: featuredJobs,
      completionRate: totalJobs > 0 ? ((totalJobs - openJobs) / totalJobs * 100).toFixed(2) : 0,
    };
  }

  async getMessageStats() {
    const totalMessages = await this.messageRepository.count();
    const readMessages = await this.messageRepository.count({ where: { isRead: true } });
    const unreadMessages = totalMessages - readMessages;

    return {
      total: totalMessages,
      read: readMessages,
      unread: unreadMessages,
      readPercentage: totalMessages > 0 ? ((readMessages / totalMessages) * 100).toFixed(2) : 0,
    };
  }

  async getCategoryStats() {
    const totalCategories = await this.categoryRepository.count();
    const activeCategories = await this.categoryRepository.count({ where: { isActive: true } });
    const parentCategories = await this.categoryRepository.count({ where: { parentId: null } });
    const childCategories = totalCategories - parentCategories;

    return {
      total: totalCategories,
      active: activeCategories,
      inactive: totalCategories - activeCategories,
      parent: parentCategories,
      child: childCategories,
    };
  }

  // User Management Methods
  async getAllUsers() {
    return this.userRepository.find({
      relations: ['userInfos', 'categories'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userInfos', 'categories'],
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto, file?: any) {
    // Email ve telefon kontrolü
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { phone: createUserDto.phone }
      ]
    });

    if (existingUser) {
      throw new ConflictException('Email veya telefon numarası zaten kullanımda');
    }

    // Şifre hash'leme
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    // Profil fotoğrafı URL'i (eğer dosya varsa)
    let profileImage = null;
    if (file) {
      profileImage = this.uploadService.getFileUrl(file.filename);
    }

    // Kategorileri hazırla (sadece worker için)
    let categories = [];
    let categoryIds = [];
    if (createUserDto.userType === 'worker' && createUserDto.categoryIds) {
      categories = await this.categoryRepository.findByIds(createUserDto.categoryIds);
      categoryIds = createUserDto.categoryIds;
    }

    // Kullanıcı oluşturma
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      profileImage: profileImage,
      categories: categories,
      categoryIds: categoryIds,
    });

    const savedUser = await this.userRepository.save(user);

    // UserInfo oluşturma (eğer varsa)
    if (createUserDto.userInfo) {
      const userInfo = this.userInfoRepository.create({
        ...createUserDto.userInfo,
        user: savedUser,
      });
      await this.userInfoRepository.save(userInfo);
    }

    return {
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: savedUser,
    };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, file?: any) {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: ['categories']
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Email ve telefon kontrolü (kendisi hariç)
    if (updateUserDto.email || updateUserDto.phone) {
      const existingUser = await this.userRepository.findOne({
        where: [
          { email: updateUserDto.email, id: Not(id) },
          { phone: updateUserDto.phone, id: Not(id) }
        ]
      });

      if (existingUser) {
        throw new ConflictException('Email veya telefon numarası zaten kullanımda');
      }
    }

    // Profil fotoğrafı yükleme (eğer dosya varsa)
    if (file) {
      console.log('📸 Profil fotoğrafı yükleniyor:', {
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype
      });
      
      const fileUrl = this.uploadService.getFileUrl(file.filename);
      user.profileImage = fileUrl;
      
      console.log('✅ Profil fotoğrafı URL\'i oluşturuldu:', fileUrl);
    } else {
      console.log('ℹ️ Profil fotoğrafı yüklenmedi');
    }

    // Şifre güncelleme (eğer varsa)
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    } else {
      // Şifre güncellenmeyecekse, DTO'dan çıkar
      delete updateUserDto.password;
    }

    // Kategorileri güncelle (sadece worker için)
    if (updateUserDto.categoryIds !== undefined) {
      if (updateUserDto.userType === 'worker' || user.userType === 'worker') {
        const categories = await this.categoryRepository.findByIds(updateUserDto.categoryIds);
        user.categories = categories;
        user.categoryIds = updateUserDto.categoryIds;
      } else {
        // Employer kullanıcıları için kategorileri temizle
        user.categories = [];
        user.categoryIds = [];
      }
    }

    // Diğer alanları güncelle (password hariç)
    Object.assign(user, updateUserDto);

    await this.userRepository.save(user);

    return {
      message: 'Kullanıcı başarıyla güncellendi',
      profileImage: user.profileImage,
    };
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Check if user has associated data
    const hasJobs = await this.jobRepository.count({ where: { employerId: id } });
    const hasApplications = await this.jobApplicationRepository.count({ where: { applicantId: id } });
    const hasMessages = await this.messageRepository.count({ 
      where: [{ senderId: id }, { receiverId: id }] 
    });

    if (hasJobs > 0 || hasApplications > 0 || hasMessages > 0) {
      throw new ConflictException('Bu kullanıcıya ait işler, başvurular veya mesajlar bulunduğu için silinemez');
    }

    await this.userRepository.remove(user);
    return { message: 'Kullanıcı başarıyla silindi' };
  }

  async toggleUserStatus(id: string, status: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    user.status = status === 'active' ? UserStatus.ACTIVE : UserStatus.INACTIVE;
    await this.userRepository.save(user);
    
    return { 
      message: 'Kullanıcı durumu güncellendi',
      user: {
        id: user.id,
        status: user.status
      }
    };
  }

  async toggleUserOnline(id: string, isOnline: boolean) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    user.isOnline = isOnline;
    await this.userRepository.save(user);
    
    return { 
      message: 'Kullanıcı online durumu güncellendi',
      user: {
        id: user.id,
        isOnline: user.isOnline
      }
    };
  }

  async assignCategoriesToUser(id: string, categoryIds: string[]) {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: ['categories']
    });
    
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Kategorileri bul
    const categories = await this.categoryRepository.findByIds(categoryIds);
    if (categories.length !== categoryIds.length) {
      throw new NotFoundException('Bazı kategoriler bulunamadı');
    }

    // Kullanıcıya kategorileri ata
    user.categories = categories;
    user.categoryIds = categoryIds;
    await this.userRepository.save(user);
    
    return { 
      message: 'Kullanıcıya kategoriler başarıyla atandı',
      user: {
        id: user.id,
        categoryIds: user.categoryIds,
        categories: categories.map(cat => ({
          id: cat.id,
          name: cat.name
        }))
      }
    };
  }

  async removeCategoriesFromUser(id: string, categoryIds: string[]) {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: ['categories']
    });
    
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Mevcut kategorilerden belirtilenleri çıkar
    user.categories = user.categories.filter(cat => !categoryIds.includes(cat.id));
    user.categoryIds = user.categoryIds.filter(catId => !categoryIds.includes(catId));
    await this.userRepository.save(user);
    
    return { 
      message: 'Kullanıcıdan kategoriler başarıyla kaldırıldı',
      user: {
        id: user.id,
        categoryIds: user.categoryIds,
        categories: user.categories.map(cat => ({
          id: cat.id,
          name: cat.name
        }))
      }
    };
  }

  async getUserCategories(id: string) {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: ['categories']
    });
    
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        categoryIds: user.categoryIds,
        categories: user.categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          icon: cat.icon
        }))
      }
    };
  }

  // Category Management Methods
  async getAllCategories() {
    return this.categoryRepository.find({
      order: { orderIndex: 'ASC', name: 'ASC' },
    });
  }

  async getActiveCategories() {
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { orderIndex: 'ASC', name: 'ASC' },
    });
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Kategori bulunamadı');
    }

    return category;
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    // Kategori adı kontrolü
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name }
    });

    if (existingCategory) {
      throw new ConflictException('Bu isimde bir kategori zaten mevcut');
    }

    // Parent kategori kontrolü
    if (createCategoryDto.parentId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: createCategoryDto.parentId }
      });

      if (!parentCategory) {
        throw new NotFoundException('Üst kategori bulunamadı');
      }
    }

    const category = this.categoryRepository.create(createCategoryDto);
    const savedCategory = await this.categoryRepository.save(category);

    return {
      message: 'Kategori başarıyla oluşturuldu',
      category: savedCategory,
    };
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Kategori bulunamadı');
    }

    // Kategori adı kontrolü (kendisi hariç)
    if (updateCategoryDto.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name, id: Not(id) }
      });

      if (existingCategory) {
        throw new ConflictException('Bu isimde bir kategori zaten mevcut');
      }
    }

    // Parent kategori kontrolü
    if (updateCategoryDto.parentId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: updateCategoryDto.parentId }
      });

      if (!parentCategory) {
        throw new NotFoundException('Üst kategori bulunamadı');
      }

      // Kendisini parent olarak seçemez
      if (updateCategoryDto.parentId === id) {
        throw new ConflictException('Kategori kendisini üst kategori olarak seçemez');
      }
    }

    await this.categoryRepository.update(id, updateCategoryDto);

    return {
      message: 'Kategori başarıyla güncellendi',
    };
  }

  async deleteCategory(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Kategori bulunamadı');
    }

    // Alt kategorileri kontrol et
    const childCategories = await this.categoryRepository.count({
      where: { parentId: id }
    });

    if (childCategories > 0) {
      throw new ConflictException('Bu kategorinin alt kategorileri var. Önce alt kategorileri silin.');
    }

    // Kategoriye bağlı kullanıcıları kontrol et
    const usersWithCategory = await this.userRepository.count({
      where: { categoryIds: Like(`%${id}%`) }
    });

    if (usersWithCategory > 0) {
      throw new ConflictException('Bu kategoriye bağlı kullanıcılar var. Önce kullanıcıları başka kategoriye taşıyın.');
    }

    await this.categoryRepository.remove(category);

    return {
      message: 'Kategori başarıyla silindi',
    };
  }

  private async getUserTypeStats() {
    const workers = await this.userRepository.count({ where: { userType: 'worker' } });
    const employers = await this.userRepository.count({ where: { userType: 'employer' } });

    return {
      workers,
      employers,
    };
  }

  private async getJobStatusStats() {
    const open = await this.jobRepository.count({ where: { status: JobStatus.OPEN } });
    const cancelled = await this.jobRepository.count({ where: { status: JobStatus.CANCELLED } });

    return {
      open,
      cancelled,
    };
  }

  async updateUserProfileImage(userId: string, imageUrl: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    user.profileImage = imageUrl;
    await this.userRepository.save(user);
    
    return { 
      message: 'Profil fotoğrafı başarıyla güncellendi',
      profileImage: imageUrl
    };
  }

  // Öne çıkan işler yönetimi
  async getFeaturedJobs() {
    return this.jobRepository.find({
      where: { isFeatured: true },
      relations: ['employer', 'category'],
      order: { featuredAt: 'DESC' },
    });
  }

  async getHighScoreJobs(limit: number = 20) {
    return this.jobRepository.find({
      where: { status: JobStatus.OPEN },
      relations: ['employer', 'category'],
      order: { featuredScore: 'DESC' },
      take: limit,
    });
  }

  async setJobFeatured(jobId: string, isFeatured: boolean, reason?: string) {
    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('İş bulunamadı');
    }

    job.isFeatured = isFeatured;
    job.featuredAt = isFeatured ? new Date() : null;
    job.featuredReason = reason || null;

    await this.jobRepository.save(job);
    
    return { 
      message: `İş ${isFeatured ? 'öne çıkarıldı' : 'öne çıkarma kaldırıldı'}`,
      job: {
        id: job.id,
        title: job.title,
        isFeatured: job.isFeatured,
        featuredAt: job.featuredAt,
        featuredReason: job.featuredReason
      }
    };
  }

  async updateAllJobScores() {
    const jobs = await this.jobRepository.find({
      where: { status: JobStatus.OPEN }
    });

    let updatedCount = 0;
    for (const job of jobs) {
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
      await this.jobRepository.save(job);
      updatedCount++;
    }

    return { 
      message: `${updatedCount} işin skoru güncellendi`,
      updatedCount
    };
  }

  // İş durumu değiştirme
  async toggleJobStatus(jobId: string, status: JobStatus) {
    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('İş bulunamadı');
    }

    job.status = status;
    await this.jobRepository.save(job);
    
    return { 
      message: `İş durumu ${status} olarak güncellendi`,
      job: {
        id: job.id,
        title: job.title,
        status: job.status
      }
    };
  }

  // Tarihi geçen işleri otomatik kapat
  async closeExpiredJobs() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Bugünün başlangıcı

    const expiredJobs = await this.jobRepository.find({
      where: {
        status: JobStatus.OPEN,
        scheduledDate: Not(null)
      }
    });

    let closedCount = 0;
    for (const job of expiredJobs) {
      if (job.scheduledDate && job.scheduledDate < today) {
        job.status = JobStatus.CANCELLED;
        await this.jobRepository.save(job);
        closedCount++;
      }
    }

    return { 
      message: `${closedCount} adet süresi dolmuş iş kapatıldı`,
      closedCount
    };
  }

  // Tüm işleri getir (admin panel için)
  async getAllJobs() {
    return this.jobRepository.find({
      relations: ['employer', 'category'],
      order: { createdAt: 'DESC' },
    });
  }
} 