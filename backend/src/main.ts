import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import { UsersSeedService } from './seeds/users.seed';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS ayarları - Tüm origin'lere izin ver
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8080',
      'http://localhost:5173',
      'https://onlinejobs.onrender.com', // Render URL'iniz
      'https://*.onrender.com', // Tüm Render subdomain'lerine izin ver
      /^https:\/\/.*\.onrender\.com$/, // Regex ile tüm Render domain'lerine izin ver
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Static dosyaları serve et
  app.use('/public', express.static(join(__dirname, '..', 'public')));

  // Swagger dokümantasyonu
  const config = new DocumentBuilder()
    .setTitle('Online Jobs API')
    .setDescription('Online Jobs platformu için REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Sadece users seed'ini çalıştır
  try {
    const usersSeedService = app.get(UsersSeedService);
    await usersSeedService.seed();
    
    // Test kullanıcılarını otomatik online yap
    try {
      const usersService = app.get(UsersService);
      await usersService.setTestUsersOnline();
      console.log('✅ Test kullanıcıları online yapıldı');
    } catch (usersError) {
      console.log('Users service error:', usersError.message);
    }
  } catch (error) {
    console.log('Seed service error:', error.message);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Tüm IP'lerden erişime izin ver
  
  console.log(`🚀 Uygulama http://localhost:${port} adresinde çalışıyor`);
  console.log(`📚 API Dokümantasyonu: http://localhost:${port}/api`);
  console.log(`💬 Chat Test Sayfası: http://localhost:${port}/public/chat-test.html`);
}
bootstrap(); 