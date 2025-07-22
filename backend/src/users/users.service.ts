import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findTestUsers(): Promise<User[]> {
    return this.userRepository.find({
      where: [
        { phone: '+905550000001' },
        { phone: '+905550000002' },
        { phone: '+905550000003' },
        { phone: '+905550000004' },
        { phone: '+905550000005' }
      ],
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'userTypes', 'status']
    });
  }

  async findRealUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'userTypes', 'status'],
      order: { createdAt: 'DESC' },
      take: 10 // Son 10 kullanıcıyı getir
    });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.userRepository.find({
      where: { status: UserStatus.ACTIVE },
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'userTypes', 'status', 'isOnline', 'lastSeen'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOnlineUsers(): Promise<User[]> {
    return this.userRepository.find({
      where: { isOnline: true },
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'userTypes', 'status', 'isOnline', 'lastSeen'],
      order: { lastSeen: 'DESC' }
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }
    return user;
  }

  async findOnlineJobSeekers(
    latitude?: number,
    longitude?: number,
    radius?: number,
    categoryId?: string,
  ): Promise<User[]> {
    let query = this.userRepository
      .createQueryBuilder('user')
      .where("'job_seeker' = ANY(user.userTypes)")
      .andWhere('user.isOnline = :isOnline', { isOnline: true })
      .andWhere('user.status = :status', { status: UserStatus.ACTIVE });

    if (categoryId) {
      query = query.andWhere('user.categoryId = :categoryId', { categoryId });
    }

    if (latitude && longitude && radius) {
      // Haversine formülü ile mesafe hesaplama
      query = query.andWhere(
        `(
          6371 * acos(
            cos(radians(:latitude)) * cos(radians(user.latitude)) *
            cos(radians(user.longitude) - radians(:longitude)) +
            sin(radians(:latitude)) * sin(radians(user.latitude))
          )
        ) <= :radius`,
        { latitude, longitude, radius }
      );
    }

    return query.getMany();
  }

  // Yeni fonksiyonlar ekleyelim
  async findOnlineEmployers(
    latitude?: number,
    longitude?: number,
    radius?: number,
    categoryId?: string,
  ): Promise<User[]> {
    let query = this.userRepository
      .createQueryBuilder('user')
      .where("'employer' = ANY(user.userTypes)")
      .andWhere('user.isOnline = :isOnline', { isOnline: true })
      .andWhere('user.status = :status', { status: UserStatus.ACTIVE });

    if (categoryId) {
      query = query.andWhere('user.categoryId = :categoryId', { categoryId });
    }

    if (latitude && longitude && radius) {
      query = query.andWhere(
        `(
          6371 * acos(
            cos(radians(:latitude)) * cos(radians(user.latitude)) *
            cos(radians(user.longitude) - radians(:longitude)) +
            sin(radians(:latitude)) * sin(radians(user.latitude))
          )
        ) <= :radius`,
        { latitude, longitude, radius }
      );
    }

    return query.getMany();
  }

  async findUsersByType(userType: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where(":userType = ANY(user.userTypes)")
      .andWhere('user.status = :status', { status: UserStatus.ACTIVE })
      .setParameter('userType', userType)
      .getMany();
  }

  async updateUserTypes(userId: string, userTypes: string[]): Promise<User> {
    const user = await this.findById(userId);
    user.userTypes = userTypes;
    return this.userRepository.save(user);
  }

  async updateStatus(userId: string, status: UserStatus): Promise<User> {
    const user = await this.findById(userId);
    user.status = status;
    return this.userRepository.save(user);
  }

  async updateLocation(userId: string, latitude: number, longitude: number): Promise<User> {
    const user = await this.findById(userId);
    user.latitude = latitude;
    user.longitude = longitude;
    return this.userRepository.save(user);
  }

  async updateProfile(userId: string, updateData: any): Promise<User> {
    const user = await this.findById(userId);
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  // Kullanıcıyı online yap
  async setUserOnline(userId: string): Promise<User> {
    const user = await this.findById(userId);
    user.isOnline = true;
    user.lastSeen = new Date();
    return this.userRepository.save(user);
  }

  // Kullanıcıyı offline yap
  async setUserOffline(userId: string): Promise<User> {
    const user = await this.findById(userId);
    user.isOnline = false;
    user.lastSeen = new Date();
    return this.userRepository.save(user);
  }

  // Test kullanıcılarını otomatik online yap
  async setTestUsersOnline(): Promise<void> {
    const testUsers = await this.findTestUsers();
    for (const user of testUsers) {
      await this.setUserOnline(user.id);
    }
  }

  async updateIsOnline(userId: string, isOnline: boolean): Promise<User> {
    const user = await this.findById(userId);
    user.isOnline = isOnline;
    user.lastSeen = new Date();
    return this.userRepository.save(user);
  }
} 