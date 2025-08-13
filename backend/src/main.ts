import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS ayarları - Tüm origin'lere izin ver
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:5175',
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
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.use('/test', express.static(join(__dirname, '..')));

  // Swagger dokümantasyonu
  const config = new DocumentBuilder()
    .setTitle('Online Jobs API')
    .setDescription('Online Jobs platformu için REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Tüm IP'lerden erişime izin ver
  
  console.log(`🚀 Uygulama http://localhost:${port} adresinde çalışıyor`);
  console.log(`📚 API Dokümantasyonu: http://localhost:${port}/api`);
  console.log(`💬 Chat Test Sayfası: http://localhost:${port}/public/chat-test.html`);
  console.log(`👨‍💼 Admin Panel: http://localhost:${port}/public/admin-panel.html`);
}
bootstrap(); 