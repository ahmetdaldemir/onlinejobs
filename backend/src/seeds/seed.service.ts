import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
//import { categoriesSeed } from './categories.seed';
import { LocationsSeedService } from './locations.seed';
import { UsersSeedService } from './users.seed';
import { UserInfoSeedService } from './user-info.seed';
import { AdminSeedService } from './admin.seed';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private locationsSeedService: LocationsSeedService,
    private usersSeedService: UsersSeedService,
    private userInfoSeedService: UserInfoSeedService,
    private adminSeedService: AdminSeedService,
  ) {}

  /*async seedCategories(): Promise<void> {
    console.log('Kategoriler ekleniyor...');
    
    // Mevcut kategorileri kontrol et
    const existingCategories = await this.categoryRepository.find();
    if (existingCategories.length > 0) {
      console.log(`✅ ${existingCategories.length} kategori zaten mevcut, seed işlemi atlanıyor`);
      return;
    }
    
    // Ana kategorileri ekle
    const savedCategories = await this.categoryRepository.save(categoriesSeed);
    
    // Parent-child mapping'i güncelle
    const parentMapping = new Map<string, string>();
    
    // Ana kategorilerin mapping'ini oluştur
    savedCategories.forEach((savedCategory: any) => {
      if (savedCategory.originalId) {
        parentMapping.set(savedCategory.originalId, savedCategory.id);
      }
    });
    
    // Alt kategorilerin parentId'lerini güncelle
    const subCategoriesToUpdate = savedCategories.filter((cat: any) => cat.parentOriginalId);
    
    for (const subCategory of subCategoriesToUpdate) {
      const newParentId = parentMapping.get((subCategory as any).parentOriginalId);
      if (newParentId) {
        await this.categoryRepository.update(subCategory.id, { parentId: newParentId });
      }
    }
    
    console.log(`✅ ${savedCategories.length} kategori yüklendi`);
  }*/

  async seedLocations(): Promise<void> {
    console.log('Lokasyonlar ekleniyor...');
    await this.locationsSeedService.seed();
    console.log('Lokasyonlar başarıyla eklendi!');
  }

  async seedUsers(): Promise<void> {
    console.log('Test kullanıcıları ekleniyor...');
    await this.usersSeedService.seed();
    console.log('Test kullanıcıları başarıyla eklendi!');
  }

  async seedUserInfos(): Promise<void> {
    console.log('UserInfo verileri ekleniyor...');
    await this.userInfoSeedService.seed();
    console.log('UserInfo verileri başarıyla eklendi!');
  }

  async seedAdmin(): Promise<void> {
    console.log('Admin kullanıcısı ekleniyor...');
    await this.adminSeedService.seed();
    console.log('Admin kullanıcısı başarıyla eklendi!');
  }

  async runSeeds(): Promise<void> {
  //  await this.seedCategories();
    await this.seedLocations();
    await this.seedUsers();
    await this.seedUserInfos();
    await this.seedAdmin();
  }
} 