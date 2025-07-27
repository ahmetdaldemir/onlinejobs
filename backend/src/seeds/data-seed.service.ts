import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { UserInfo } from '../users/entities/user-info.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DataSeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
  ) {}

  private readJsonFile(filename: string): any[] {
    try {
      const filePath = path.join(__dirname, '../../data', filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return [];
    }
  }

  async seedUsers(): Promise<{ added: number; updated: number }> {
    console.log('Users seed işlemi başlatılıyor...');
    
    const usersData = this.readJsonFile('users.json');
    let added = 0;
    let updated = 0;

    for (const userData of usersData) {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email },
        relations: ['categories']
      });

      // Category'leri bul (eğer categoryIds varsa)
      let categories = [];
      if (userData.categoryIds && Array.isArray(userData.categoryIds)) {
        categories = await this.categoryRepository.findByIds(userData.categoryIds);
      } else if (userData.categoryId) {
        // Eski format için backward compatibility
        const category = await this.categoryRepository.findOne({
          where: { id: userData.categoryId }
        });
        if (category) {
          categories = [category];
        }
      }

      if (existingUser) {
        // Mevcut kullanıcıyı güncelle
        await this.userRepository.update(existingUser.id, {
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          password: userData.password,
          userType: userData.userType,
          status: userData.status,
          bio: userData.bio,
          profileImage: userData.profileImage,
          isVerified: userData.isVerified,
          isOnline: userData.isOnline,
          rating: userData.rating,
          totalReviews: userData.totalReviews,
          lastSeen: userData.lastSeen,
          categoryIds: userData.categoryIds || userData.categoryId ? [userData.categoryId] : [],
          updatedAt: new Date()
        });

        // Categories ilişkisini güncelle
        if (categories.length > 0) {
          existingUser.categories = categories;
          await this.userRepository.save(existingUser);
        }

        updated++;
        console.log(`✅ User güncellendi: ${userData.email}${categories.length > 0 ? ` (Categories: ${categories.map(c => c.name).join(', ')})` : ''}`);
      } else {
        // Yeni kullanıcı ekle
        const newUser = this.userRepository.create({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
          userType: userData.userType,
          status: userData.status,
          bio: userData.bio,
          profileImage: userData.profileImage,
          isVerified: userData.isVerified,
          isOnline: userData.isOnline,
          rating: userData.rating,
          totalReviews: userData.totalReviews,
          lastSeen: userData.lastSeen,
          categoryIds: userData.categoryIds || userData.categoryId ? [userData.categoryId] : [],
          categories: categories,
          createdAt: new Date(userData.createdAt),
          updatedAt: new Date(userData.updatedAt)
        });
        await this.userRepository.save(newUser);
        added++;
        console.log(`✅ User eklendi: ${userData.email}${categories.length > 0 ? ` (Categories: ${categories.map(c => c.name).join(', ')})` : ''}`);
      }
    }

    console.log(`Users seed tamamlandı: ${added} eklendi, ${updated} güncellendi`);
    return { added, updated };
  }

  async seedCategories(): Promise<{ added: number; updated: number }> {
    console.log('Categories seed işlemi başlatılıyor...');
    
    const categoriesData = this.readJsonFile('categories.json');
    let added = 0;
    let updated = 0;

    for (const categoryData of categoriesData) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { id: categoryData.id }
      });

      if (existingCategory) {
        // Mevcut kategoriyi güncelle
        await this.categoryRepository.update(existingCategory.id, {
          name: categoryData.name,
          description: categoryData.description,
          icon: categoryData.icon,
          isActive: categoryData.isActive,
          orderIndex: categoryData.orderIndex,
          parentId: categoryData.parentId,
          updatedAt: new Date()
        });
        updated++;
        console.log(`✅ Category güncellendi: ${categoryData.name}`);
      } else {
        // Yeni kategori ekle
        const newCategory = this.categoryRepository.create({
          id: categoryData.id,
          name: categoryData.name,
          description: categoryData.description,
          icon: categoryData.icon,
          isActive: categoryData.isActive,
          orderIndex: categoryData.orderIndex,
          parentId: categoryData.parentId,
          createdAt: new Date(categoryData.createdAt),
          updatedAt: new Date(categoryData.updatedAt)
        });
        await this.categoryRepository.save(newCategory);
        added++;
        console.log(`✅ Category eklendi: ${categoryData.name}`);
      }
    }

    console.log(`Categories seed tamamlandı: ${added} eklendi, ${updated} güncellendi`);
    return { added, updated };
  }

  async seedUserInfos(): Promise<{ added: number; updated: number }> {
    console.log('UserInfos seed işlemi başlatılıyor...');
    
    const userInfosData = this.readJsonFile('user_infos.json');
    let added = 0;
    let updated = 0;

    for (const userInfoData of userInfosData) {
      const existingUserInfo = await this.userInfoRepository.findOne({
        where: { user: { id: userInfoData.userId } }
      });

      if (existingUserInfo) {
        // Mevcut user info'yu güncelle
        await this.userInfoRepository.update(existingUserInfo.id, {
          ...userInfoData,
          updatedAt: new Date()
        });
        updated++;
        console.log(`✅ UserInfo güncellendi: ${userInfoData.userId}`);
      } else {
        // Yeni user info ekle
        const newUserInfo = this.userInfoRepository.create({
          ...userInfoData,
          createdAt: new Date(userInfoData.createdAt || new Date()),
          updatedAt: new Date(userInfoData.updatedAt || new Date())
        });
        await this.userInfoRepository.save(newUserInfo);
        added++;
        console.log(`✅ UserInfo eklendi: ${userInfoData.userId}`);
      }
    }

    console.log(`UserInfos seed tamamlandı: ${added} eklendi, ${updated} güncellendi`);
    return { added, updated };
  }

  async seedAll(): Promise<{
    users: { added: number; updated: number };
    categories: { added: number; updated: number };
    userInfos: { added: number; updated: number };
  }> {
    console.log('🚀 Tüm data seed işlemi başlatılıyor...');
    
    const users = await this.seedUsers();
    const categories = await this.seedCategories();
    const userInfos = await this.seedUserInfos();

    console.log('🎉 Tüm data seed işlemi tamamlandı!');
    console.log(`📊 Özet:`);
    console.log(`   Users: ${users.added} eklendi, ${users.updated} güncellendi`);
    console.log(`   Categories: ${categories.added} eklendi, ${categories.updated} güncellendi`);
    console.log(`   UserInfos: ${userInfos.added} eklendi, ${userInfos.updated} güncellendi`);

    return { users, categories, userInfos };
  }
} 