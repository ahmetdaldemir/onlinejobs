import { Controller, Post, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { DataSeedService } from './data-seed.service';

@Controller('seeds')
export class SeedsController {
  constructor(
    private readonly seedService: SeedService,
    private readonly dataSeedService: DataSeedService,
  ) {}

  @Post('run-all')
  async runAllSeeds() {
    return await this.seedService.runSeeds();
  }

  @Post('locations')
  async seedLocations() {
    return await this.seedService.seedLocations();
  }

  @Post('users')
  async seedUsers() {
    return await this.seedService.seedUsers();
  }

  @Post('user-info')
  async seedUserInfos() {
    return await this.seedService.seedUserInfos();
  }

  @Post('admin')
  async seedAdmin() {
    return await this.seedService.seedAdmin();
  }

  // Yeni data seed endpoint'leri
  @Post('data/all')
  async seedAllData() {
    return await this.dataSeedService.seedAll();
  }

  @Post('data/users')
  async seedDataUsers() {
    return await this.dataSeedService.seedUsers();
  }

  @Post('data/categories')
  async seedDataCategories() {
    return await this.dataSeedService.seedCategories();
  }

  @Post('data/user-infos')
  async seedDataUserInfos() {
    return await this.dataSeedService.seedUserInfos();
  }

  @Get('status')
  async getSeedStatus() {
    return {
      message: 'Seed endpoints are available',
      endpoints: {
        'POST /seeds/run-all': 'Run all traditional seeds',
        'POST /seeds/locations': 'Seed locations',
        'POST /seeds/users': 'Seed users',
        'POST /seeds/user-info': 'Seed user info',
        'POST /seeds/admin': 'Seed admin',
        'POST /seeds/data/all': 'Seed all data from JSON files',
        'POST /seeds/data/users': 'Seed users from JSON file',
        'POST /seeds/data/categories': 'Seed categories from JSON file',
        'POST /seeds/data/user-infos': 'Seed user infos from JSON file',
      }
    };
  }
} 