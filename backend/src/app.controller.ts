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

  @Post('seed/admin')
  async seedAdmin() {
    try {
      await this.seedService.seedAdmin();
      return { 
        message: 'Admin kullanıcısı başarıyla eklendi!',
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