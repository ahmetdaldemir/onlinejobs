import { Controller, Post, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SeedService } from './seed.service';
import { DataSeedService } from './data-seed.service';
import { FixCategoryIdsSeed } from './fix-category-ids.seed';

@ApiTags('Seeds')
@Controller('seeds')
export class SeedsController {
  constructor(
    private readonly seedService: SeedService,
    private readonly dataSeedService: DataSeedService,
    private readonly fixCategoryIdsSeed: FixCategoryIdsSeed,
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

  @Post('fix/category-ids')
  @ApiOperation({ summary: 'Tüm kullanıcıların categoryIds array\'ini senkronize et' })
  async fixAllCategoryIds() {
    await this.fixCategoryIdsSeed.fixAllUserCategoryIds();
    return {
      message: 'CategoryIds senkronizasyonu tamamlandı',
      status: 'success'
    };
  }

  @Post('fix/category-ids/:userId')
  @ApiOperation({ summary: 'Belirli kullanıcının categoryIds array\'ini düzelt' })
  async fixUserCategoryIds(@Param('userId') userId: string) {
    const user = await this.fixCategoryIdsSeed.fixSpecificUser(userId);
    return {
      message: 'Kullanıcı categoryIds güncellendi',
      userId: user.id,
      categoryIds: user.categoryIds,
      status: 'success'
    };
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
        'POST /seeds/fix/category-ids': 'Fix all users categoryIds array',
        'POST /seeds/fix/category-ids/:userId': 'Fix specific user categoryIds',
      }
    };
  }
} 