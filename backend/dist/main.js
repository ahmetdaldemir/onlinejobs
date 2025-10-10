"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const express = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:8080',
            'http://localhost:8081',
            'http://localhost:5175',
            'https://onlinejobs.onrender.com',
            'https://*.onrender.com',
            /^https:\/\/.*\.onrender\.com$/,
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.use('/public', express.static((0, path_1.join)(__dirname, '..', 'public')));
    app.use('/uploads', express.static((0, path_1.join)(__dirname, '..', 'uploads')));
    app.use('/uploads/job-images', express.static((0, path_1.join)(__dirname, '..', 'uploads', 'job-images')));
    app.use('/uploads/portfolio-images', express.static((0, path_1.join)(__dirname, '..', 'uploads', 'portfolio-images')));
    app.use('/test', express.static((0, path_1.join)(__dirname, '..')));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Online Jobs API')
        .setDescription(`
      # Online Jobs Platform API Dokümantasyonu
      
      Bu API, Online Jobs platformu için geliştirilmiş REST API'dir.
      
      ## Özellikler:
      - 👤 Kullanıcı Yönetimi (Worker/Employer)
      - 📋 İş İlanları
      - 💬 Gerçek Zamanlı Mesajlaşma
      - 📍 Konum Servisleri
      - 🤖 AI Destekli Özellikler
      - 📄 Doğrulama Sistemi (Worker'lar için)
      
      ## Authentication:
      - JWT Token kullanılır
      - Bearer token formatında gönderilmelidir
      - Admin endpoint'leri için admin token gerekir
      
      ## Test Sayfaları:
      - Register Test: /public/test-register.html
      - Verification Test: /public/test-verification.html
      - Chat Test: /public/chat-test.html
    `)
        .setVersion('1.0')
        .addTag('Authentication', 'Kullanıcı girişi ve kayıt işlemleri')
        .addTag('Users', 'Kullanıcı yönetimi')
        .addTag('User Verification', 'Worker doğrulama sistemi')
        .addTag('Jobs', 'İş ilanları yönetimi')
        .addTag('Messages', 'Mesajlaşma sistemi')
        .addTag('Categories', 'Kategori yönetimi')
        .addTag('Locations', 'Konum servisleri')
        .addTag('Admin', 'Admin paneli')
        .addTag('Notifications', 'Bildirim sistemi')
        .addTag('Comments', 'Yorum sistemi')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT token giriniz',
        in: 'header',
    }, 'JWT-auth')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Admin JWT token giriniz',
        in: 'header',
    }, 'admin-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config, {
        extraModels: [],
    });
    swagger_1.SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'list',
            filter: true,
            showRequestDuration: true,
            tryItOutEnabled: true,
        },
        customSiteTitle: 'Online Jobs API Documentation',
        customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #333; font-size: 36px; }
      .swagger-ui .info .description { font-size: 16px; }
    `,
    });
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Uygulama http://localhost:${port} adresinde çalışıyor`);
    console.log(`📚 API Dokümantasyonu: http://localhost:${port}/api`);
    console.log(`🔐 Register Test: http://localhost:${port}/public/test-register.html`);
    console.log(`📋 Verification Test: http://localhost:${port}/public/test-verification.html`);
    console.log(`💬 Chat Test: http://localhost:${port}/public/chat-test.html`);
    console.log(`👨‍💼 Admin Panel: http://localhost:${port}/public/admin-panel.html`);
    console.log(`📸 Portfolio Test: http://localhost:${port}/public/test-portfolio.html`);
    console.log(`📊 Swagger JSON: http://localhost:${port}/api-json`);
}
bootstrap();
//# sourceMappingURL=main.js.map