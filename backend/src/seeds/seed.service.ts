import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { categoriesSeed } from './categories.seed';
import { LocationsSeedService } from './locations.seed';
import { UsersSeedService } from './users.seed';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private locationsSeedService: LocationsSeedService,
    private usersSeedService: UsersSeedService,
  ) {}

  async seedCategories(): Promise<void> {
    console.log('Kategoriler ekleniyor...');
    const existingCategories = await this.categoryRepository.count();
    if (existingCategories === 0) {
      await this.categoryRepository.save(categoriesSeed);
      console.log('Kategoriler başarıyla eklendi!');
    } else {
      console.log('Kategoriler zaten mevcut, atlanıyor...');
    }
  }

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

  async runSeeds(): Promise<void> {
    await this.seedCategories();
    await this.seedLocations();
    await this.seedUsers();
  }
} 