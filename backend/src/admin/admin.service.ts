import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
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
    const [totalJobs, openJobs, inProgressJobs, completedJobs] = await Promise.all([
      this.jobRepository.count(),
      this.jobRepository.count({ where: { status: JobStatus.OPEN } }),
      this.jobRepository.count({ where: { status: JobStatus.IN_PROGRESS } }),
      this.jobRepository.count({ where: { status: JobStatus.COMPLETED } }),
    ]);

    return {
      total: totalJobs,
      open: openJobs,
      inProgress: inProgressJobs,
      completed: completedJobs,
      completionRate: totalJobs > 0 ? ((completedJobs / totalJobs) * 100).toFixed(2) : 0,
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
      relations: ['userInfos'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userInfos'],
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
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

    // Kullanıcı oluşturma
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
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

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

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

    // Şifre güncelleme (eğer varsa)
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    await this.userRepository.update(id, updateUserDto);

    return {
      message: 'Kullanıcı başarıyla güncellendi',
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

  // Category Management Methods
  async getAllCategories() {
    return this.categoryRepository.find({
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
      where: { category: { id } }
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
    const inProgress = await this.jobRepository.count({ where: { status: JobStatus.IN_PROGRESS } });
    const completed = await this.jobRepository.count({ where: { status: JobStatus.COMPLETED } });
    const cancelled = await this.jobRepository.count({ where: { status: JobStatus.CANCELLED } });

    return {
      open,
      inProgress,
      completed,
      cancelled,
    };
  }
} 