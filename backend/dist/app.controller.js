"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const seed_service_1 = require("./seeds/seed.service");
let AppController = class AppController {
    constructor(seedService) {
        this.seedService = seedService;
    }
    getHello() {
        return 'Online Jobs API is running!';
    }
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: '1.0.0'
        };
    }
    async seedUsers() {
        try {
            await this.seedService.seedUsers();
            return {
                message: 'Test kullanıcıları başarıyla eklendi!',
                status: 'success'
            };
        }
        catch (error) {
            return {
                message: 'Seed hatası: ' + error.message,
                status: 'error'
            };
        }
    }
    async seedAll() {
        try {
            await this.seedService.runSeeds();
            return {
                message: 'Tüm seed verileri başarıyla eklendi!',
                status: 'success'
            };
        }
        catch (error) {
            return {
                message: 'Seed hatası: ' + error.message,
                status: 'error'
            };
        }
    }
    async seedCategories() {
        try {
            await this.seedService.seedCategories();
            return {
                message: 'Kategoriler başarıyla eklendi!',
                status: 'success'
            };
        }
        catch (error) {
            return {
                message: 'Seed hatası: ' + error.message,
                status: 'error'
            };
        }
    }
    async seedLocations() {
        try {
            await this.seedService.seedLocations();
            return {
                message: 'Lokasyonlar başarıyla eklendi!',
                status: 'success'
            };
        }
        catch (error) {
            return {
                message: 'Seed hatası: ' + error.message,
                status: 'error'
            };
        }
    }
    async seedUserInfos() {
        try {
            await this.seedService.seedUserInfos();
            return {
                message: 'UserInfo verileri başarıyla eklendi!',
                status: 'success'
            };
        }
        catch (error) {
            return {
                message: 'Seed hatası: ' + error.message,
                status: 'error'
            };
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Post)('seed/users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "seedUsers", null);
__decorate([
    (0, common_1.Post)('seed/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "seedAll", null);
__decorate([
    (0, common_1.Post)('seed/categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "seedCategories", null);
__decorate([
    (0, common_1.Post)('seed/locations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "seedLocations", null);
__decorate([
    (0, common_1.Post)('seed/user-infos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "seedUserInfos", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [seed_service_1.SeedService])
], AppController);
//# sourceMappingURL=app.controller.js.map