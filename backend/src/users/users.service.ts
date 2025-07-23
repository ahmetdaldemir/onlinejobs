import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { UserInfo } from './entities/user-info.entity';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
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

  async findActiveUsers(): Promise<User[]> {
    return this.userRepository.find({
      where: { status: UserStatus.ACTIVE },
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'userType', 'status', 'isOnline', 'lastSeen'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOnlineUsers(): Promise<User[]> {
    return this.userRepository.find({
      where: { isOnline: true },
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'userType', 'status', 'isOnline', 'lastSeen'],
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

  async findOnlineWorkers(
    latitude?: number,
    longitude?: number,
    radius?: number,
    categoryId?: string,
  ): Promise<any[]> {
    let query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userInfos', 'userInfo')
      .where('user.userType = :userType', { userType: 'worker' })
      .andWhere('user.isOnline = :isOnline', { isOnline: true })
      .andWhere('user.status = :status', { status: UserStatus.ACTIVE });

    if (categoryId) {
      query = query.andWhere('user.categoryId = :categoryId', { categoryId });
    }

    if (latitude && longitude && radius) {
      // Sadece konum bilgisi olan kullanıcıları filtrele
      query = query.andWhere('userInfo.latitude IS NOT NULL')
        .andWhere('userInfo.longitude IS NOT NULL')
        .andWhere(
          `(
            6371 * acos(
              cos(radians(:latitude)) * cos(radians(userInfo.latitude)) *
              cos(radians(userInfo.longitude) - radians(:longitude)) +
              sin(radians(:latitude)) * sin(radians(userInfo.latitude))
            )
          ) <= :radius`,
          { latitude, longitude, radius }
        )
        .addSelect(
          `(
            6371 * acos(
              cos(radians(:latitude)) * cos(radians(userInfo.latitude)) *
              cos(radians(userInfo.longitude) - radians(:longitude)) +
              sin(radians(:latitude)) * sin(radians(userInfo.latitude))
            )
          )`,
          'distance'
        )
        .orderBy('distance', 'ASC');
    }

    const results = await query.getMany();
    
    // Mesafe bilgisini ekle
    if (latitude && longitude) {
      return results.map(user => {
        const userInfo = user.userInfos?.[0];
        if (userInfo && userInfo.latitude && userInfo.longitude) {
          const distance = this.calculateDistance(
            latitude, longitude,
            userInfo.latitude, userInfo.longitude
          );
          return {
            ...user,
            distance: Math.round(distance * 100) / 100 // 2 ondalık basamak
          };
        }
        return user;
      });
    }

    return results;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Dünya'nın yarıçapı (km)
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI/180);
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
      .leftJoinAndSelect('user.userInfos', 'userInfo')
      .where('user.userType = :userType', { userType: 'employer' })
      .andWhere('user.isOnline = :isOnline', { isOnline: true })
      .andWhere('user.status = :status', { status: UserStatus.ACTIVE });

    if (categoryId) {
      query = query.andWhere('user.categoryId = :categoryId', { categoryId });
    }

    if (latitude && longitude && radius) {
      query = query.andWhere(
        `(
          6371 * acos(
            cos(radians(:latitude)) * cos(radians(userInfo.latitude)) *
            cos(radians(userInfo.longitude) - radians(:longitude)) +
            sin(radians(:latitude)) * sin(radians(userInfo.latitude))
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
      .where('user.userType = :userType', { userType })
      .andWhere('user.status = :status', { status: UserStatus.ACTIVE })
      .getMany();
  }

  async updateUserTypes(userId: string, userType: string): Promise<User> {
    const user = await this.findById(userId);
    user.userType = userType;
    return this.userRepository.save(user);
  }

  async updateStatus(userId: string, status: UserStatus): Promise<User> {
    const user = await this.findById(userId);
    user.status = status;
    return this.userRepository.save(user);
  }

  async updateLocation(userId: string, latitude: number, longitude: number, name?: string): Promise<User> {
    const user = await this.findById(userId);
    
    // Koordinat değerlerini kontrol et
    if (latitude < -90 || latitude > 90) {
      throw new Error('Latitude değeri -90 ile 90 arasında olmalıdır');
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error('Longitude değeri -180 ile 180 arasında olmalıdır');
    }
    
    // UserInfo'yu bul veya oluştur
    let userInfo = await this.userInfoRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user']
    });

    if (!userInfo) {
      userInfo = this.userInfoRepository.create({
        user: { id: userId },
        latitude,
        longitude,
        name,
      });
    } else {
      userInfo.latitude = latitude;
      userInfo.longitude = longitude;
      if (name) {
        userInfo.name = name;
      }
    }

    await this.userInfoRepository.save(userInfo);
    return user;
  }

  async getUserInfo(userId: string): Promise<UserInfo | null> {
    return this.userInfoRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user']
    });
  }

  async updateUserInfo(userId: string, updateUserInfoDto: UpdateUserInfoDto): Promise<User> {
    const user = await this.findById(userId);
    
    // Name alanı zorunlu olmalı
    if (!updateUserInfoDto.name) {
      throw new Error('Adres adı (name) zorunludur');
    }
    
    // Koordinat değerlerini kontrol et
    if (updateUserInfoDto.latitude !== undefined) {
      if (updateUserInfoDto.latitude < -90 || updateUserInfoDto.latitude > 90) {
        throw new Error('Latitude değeri -90 ile 90 arasında olmalıdır');
      }
    }
    if (updateUserInfoDto.longitude !== undefined) {
      if (updateUserInfoDto.longitude < -180 || updateUserInfoDto.longitude > 180) {
        throw new Error('Longitude değeri -180 ile 180 arasında olmalıdır');
      }
    }
    
    // userId ve name ile eşleşen UserInfo'yu bul
    let userInfo = await this.userInfoRepository.findOne({
      where: { 
        user: { id: userId },
        name: updateUserInfoDto.name
      },
      relations: ['user']
    });

    if (userInfo) {
      // Mevcut kaydı güncelle
      if (updateUserInfoDto.latitude !== undefined) userInfo.latitude = updateUserInfoDto.latitude;
      if (updateUserInfoDto.longitude !== undefined) userInfo.longitude = updateUserInfoDto.longitude;
      if (updateUserInfoDto.address !== undefined) userInfo.address = updateUserInfoDto.address;
      if (updateUserInfoDto.neighborhood !== undefined) userInfo.neighborhood = updateUserInfoDto.neighborhood;
      if (updateUserInfoDto.buildingNo !== undefined) userInfo.buildingNo = updateUserInfoDto.buildingNo;
      if (updateUserInfoDto.floor !== undefined) userInfo.floor = updateUserInfoDto.floor;
      if (updateUserInfoDto.apartmentNo !== undefined) userInfo.apartmentNo = updateUserInfoDto.apartmentNo;
      if (updateUserInfoDto.description !== undefined) userInfo.description = updateUserInfoDto.description;
    } else {
      // Yeni kayıt oluştur
      userInfo = this.userInfoRepository.create({
        user: { id: userId },
        ...updateUserInfoDto
      });
    }

    await this.userInfoRepository.save(userInfo);
    return user;
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