import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { UserInfo } from './entities/user-info.entity';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { Category } from '../categories/entities/category.entity';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private uploadService: UploadService,
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
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: ['userInfos', 'categories']
    });
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
      query = query.andWhere('user.categoryIds @> ARRAY[:categoryId]', { categoryId });
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
    
    // Kategorileri hiyerarşik formatta döndürmek için işle
    const processedResults = await Promise.all(results.map(async (user) => {
      let processedUser: any = { ...user };
      
      // Mesafe bilgisini ekle
      if (latitude && longitude) {
        const userInfo = user.userInfos?.[0];
        if (userInfo && userInfo.latitude && userInfo.longitude) {
          const distance = this.calculateDistance(
            latitude, longitude,
            userInfo.latitude, userInfo.longitude
          );
          processedUser.distance = Math.round(distance * 100) / 100; // 2 ondalık basamak
        }
      }

      // Kategorileri hiyerarşik formatta döndür
      if (user.categoryIds && user.categoryIds.length > 0) {
        const hierarchicalCategories = await this.buildHierarchicalCategories(user.categoryIds);
        processedUser.categoryIds = hierarchicalCategories;
      }

      return processedUser;
    }));

    return processedResults;
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

  private async buildHierarchicalCategories(categoryIds: string[]): Promise<any> {
    if (!categoryIds || categoryIds.length === 0) {
      return {};
    }

    // Tüm kategorileri getir
    const allCategories = await this.categoryRepository.find();
    
    // Kategori ID'lerini map'e çevir
    const categoryMap = new Map();
    allCategories.forEach(category => {
      categoryMap.set(category.id, category);
    });

    // Hiyerarşik yapıyı oluştur
    const hierarchicalStructure: any = {};

    categoryIds.forEach(categoryId => {
      const category = categoryMap.get(categoryId);
      if (category) {
        if (category.parentId) {
          // Alt kategori - üst kategoriyi bul
          const parentCategory = categoryMap.get(category.parentId);
          if (parentCategory) {
            if (!hierarchicalStructure[parentCategory.name]) {
              hierarchicalStructure[parentCategory.name] = [];
            }
            hierarchicalStructure[parentCategory.name].push({
              name: category.name,
              id: category.id
            });
          }
        } else {
          // Ana kategori - alt kategorileri bul
          const childCategories = allCategories.filter(cat => cat.parentId === category.id);
          if (childCategories.length > 0) {
            if (!hierarchicalStructure[category.name]) {
              hierarchicalStructure[category.name] = [];
            }
            childCategories.forEach(child => {
              if (categoryIds.includes(child.id)) {
                hierarchicalStructure[category.name].push({
                  name: child.name,
                  id: child.id
                });
              }
            });
          } else {
            // Alt kategorisi olmayan ana kategori
            if (!hierarchicalStructure[category.name]) {
              hierarchicalStructure[category.name] = [];
            }
          }
        }
      }
    });

    return hierarchicalStructure;
  }

  // Yeni fonksiyonlar ekleyelim
  async findOnlineEmployers(
    latitude?: number,
    longitude?: number,
    radius?: number,
    categoryId?: string,
  ): Promise<any[]> {
    let query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userInfos', 'userInfo')
      .where('user.userType = :userType', { userType: 'employer' })
      .andWhere('user.isOnline = :isOnline', { isOnline: true })
      .andWhere('user.status = :status', { status: UserStatus.ACTIVE });

    if (categoryId) {
      query = query.andWhere('user.categoryIds LIKE :categoryId', { categoryId: `%${categoryId}%` });
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

    const results = await query.getMany();
    
    // Kategorileri hiyerarşik formatta döndürmek için işle
    const processedResults = await Promise.all(results.map(async (user) => {
      let processedUser: any = { ...user };
      
      // Kategorileri hiyerarşik formatta döndür
      if (user.categoryIds && user.categoryIds.length > 0) {
        const hierarchicalCategories = await this.buildHierarchicalCategories(user.categoryIds);
        processedUser.categoryIds = hierarchicalCategories;
      }

      return processedUser;
    }));

    return processedResults;
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
    
    // Name alanı zorunlu olmalı (ID yoksa)
    if (!updateUserInfoDto.userInfoId && !updateUserInfoDto.name) {
      throw new Error('Adres adı (name) zorunludur veya userInfoId belirtilmelidir');
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
    
    let userInfo = null;
    
    // Eğer userInfoId varsa, o kaydı bul ve güncelle
    if (updateUserInfoDto.userInfoId) {
      userInfo = await this.userInfoRepository.findOne({
        where: { 
          id: updateUserInfoDto.userInfoId,
          user: { id: userId }
        },
        relations: ['user']
      });
      
      if (!userInfo) {
        throw new Error('Belirtilen userInfoId ile kayıt bulunamadı veya bu kullanıcıya ait değil');
      }
      
      console.log(`🔄 UserInfo güncelleniyor (ID: ${userInfo.id})`);
    } else {
      // userInfoId yoksa, name ile eşleşen kaydı bul
      userInfo = await this.userInfoRepository.findOne({
        where: { 
          user: { id: userId },
          name: updateUserInfoDto.name
        },
        relations: ['user']
      });
      
      if (userInfo) {
        console.log(`🔄 UserInfo güncelleniyor (Name: ${userInfo.name})`);
      } else {
        console.log(`➕ Yeni UserInfo oluşturuluyor (Name: ${updateUserInfoDto.name})`);
      }
    }

    if (userInfo) {
      // Mevcut kaydı güncelle
      if (updateUserInfoDto.name !== undefined) userInfo.name = updateUserInfoDto.name;
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

    const savedUserInfo = await this.userInfoRepository.save(userInfo);
    console.log(`✅ UserInfo ${userInfo.id ? 'güncellendi' : 'oluşturuldu'}:`, {
      id: savedUserInfo.id,
      name: savedUserInfo.name,
      address: savedUserInfo.address
    });
    
    return user;
  }



  async updateProfile(userId: string, updateData: any, file?: any): Promise<User> {
    const user = await this.findById(userId);
    
    // Profil fotoğrafı yükleme (eğer dosya varsa)
    if (file) {
      console.log('📸 Profil fotoğrafı yükleniyor (Users Service):', {
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype
      });
      
      const fileUrl = this.uploadService.getFileUrl(file.filename);
      user.profileImage = fileUrl;
      
      console.log('✅ Profil fotoğrafı URL\'i oluşturuldu (Users Service):', fileUrl);
    } else {
      console.log('ℹ️ Profil fotoğrafı yüklenmedi (Users Service)');
    }
    
    // Kategorileri güncelle (eğer categoryIds varsa)
    if (updateData.categoryIds) {
      const { Category } = await import('../categories/entities/category.entity');
      const categoryRepository = this.userRepository.manager.getRepository(Category);
      
      const categories = await categoryRepository.findByIds(updateData.categoryIds);
      user.categories = categories;
      user.categoryIds = updateData.categoryIds;
    }
    
    // Diğer alanları güncelle
    Object.assign(user, updateData);
    
    return this.userRepository.save(user);
  }

  async updateProfileImage(userId: string, imageUrl: string): Promise<User> {
    const user = await this.findById(userId);
    user.profileImage = imageUrl;
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