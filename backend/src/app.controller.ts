import { Controller, Get, Post } from '@nestjs/common';
import { SeedService } from './seeds/seed.service';

@Controller()
export class AppController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  getHello(): string {
    return 'Online Jobs API is running!';
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    };
  }

  @Post('seed/users')
  async seedUsers() {
    try {
      await this.seedService.seedUsers();
      return { 
        message: 'Test kullanıcıları başarıyla eklendi!',
        status: 'success'
      };
    } catch (error) {
      return { 
        message: 'Seed hatası: ' + error.message,
        status: 'error'
      };
    }
  }

  @Post('seed/all')
  async seedAll() {
    try {
      await this.seedService.runSeeds();
      return { 
        message: 'Tüm seed verileri başarıyla eklendi!',
        status: 'success'
      };
    } catch (error) {
      return { 
        message: 'Seed hatası: ' + error.message,
        status: 'error'
      };
    }
  }

  @Post('seed/categories')
  async seedCategories() {
    try {
      await this.seedService.seedCategories();
      return { 
        message: 'Kategoriler başarıyla eklendi!',
        status: 'success'
      };
    } catch (error) {
      return { 
        message: 'Seed hatası: ' + error.message,
        status: 'error'
      };
    }
  }

  @Post('seed/locations')
  async seedLocations() {
    try {
      await this.seedService.seedLocations();
      return { 
        message: 'Lokasyonlar başarıyla eklendi!',
        status: 'success'
      };
    } catch (error) {
      return { 
        message: 'Seed hatası: ' + error.message,
        status: 'error'
      };
    }
  }

  @Post('seed/user-infos')
  async seedUserInfos() {
    try {
      await this.seedService.seedUserInfos();
      return { 
        message: 'UserInfo verileri başarıyla eklendi!',
        status: 'success'
      };
    } catch (error) {
      return { 
        message: 'Seed hatası: ' + error.message,
        status: 'error'
      };
    }
  }
} 