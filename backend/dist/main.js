"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const express = require("express");
const users_seed_1 = require("./seeds/users.seed");
const users_service_1 = require("./users/users.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:8080',
            'https://onlinejobs.onrender.com',
            'https://*.onrender.com',
            /^https:\/\/.*\.onrender\.com$/,
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use('/public', express.static((0, path_1.join)(__dirname, '..', 'public')));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Online Jobs API')
        .setDescription('Online Jobs platformu için REST API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    try {
        const usersSeedService = app.get(users_seed_1.UsersSeedService);
        await usersSeedService.seed();
        try {
            const usersService = app.get(users_service_1.UsersService);
            await usersService.setTestUsersOnline();
            console.log('✅ Test kullanıcıları online yapıldı');
        }
        catch (usersError) {
            console.log('Users service error:', usersError.message);
        }
    }
    catch (error) {
        console.log('Seed service error:', error.message);
    }
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Uygulama http://localhost:${port} adresinde çalışıyor`);
    console.log(`📚 API Dokümantasyonu: http://localhost:${port}/api`);
    console.log(`💬 Chat Test Sayfası: http://localhost:${port}/public/chat-test.html`);
}
bootstrap();
//# sourceMappingURL=main.js.map