import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { categoriesSeed } from './categories.seed';
import { LocationsSeedService } from './locations.seed';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private locationsSeedService: LocationsSeedService,
  ) {}

  async seedCategories(): Promise<void> {
    const existingCategories = await this.categoryRepository.count();
    
    if (existingCategories === 0) {
      console.log('Kategoriler ekleniyor...');
      await this.categoryRepository.save(categoriesSeed);
      console.log('Kategoriler başarıyla eklendi!');
    } else {
      console.log('Kategoriler zaten mevcut.');
    }
  }

  async seedLocations(): Promise<void> {
    console.log('Lokasyonlar ekleniyor...');
    await this.locationsSeedService.seed();
    console.log('Lokasyonlar başarıyla eklendi!');
  }

  async runSeeds(): Promise<void> {
    await this.seedCategories();
    await this.seedLocations();
  }
} 