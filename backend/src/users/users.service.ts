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
        { email: 'testuser1@example.com' },
        { email: 'testuser2@example.com' }
      ],
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'userType', 'status']
    });
  }

  async findRealUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'userType', 'status'],
      order: { createdAt: 'DESC' },
      take: 10 // Son 10 kullanıcıyı getir
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
      .where('user.userType = :userType', { userType: 'job_seeker' })
      .andWhere('user.status = :status', { status: UserStatus.ONLINE });

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
} 