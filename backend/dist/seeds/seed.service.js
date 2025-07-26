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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../categories/entities/category.entity");
const locations_seed_1 = require("./locations.seed");
const users_seed_1 = require("./users.seed");
const user_info_seed_1 = require("./user-info.seed");
const admin_seed_1 = require("./admin.seed");
let SeedService = class SeedService {
    constructor(categoryRepository, locationsSeedService, usersSeedService, userInfoSeedService, adminSeedService) {
        this.categoryRepository = categoryRepository;
        this.locationsSeedService = locationsSeedService;
        this.usersSeedService = usersSeedService;
        this.userInfoSeedService = userInfoSeedService;
        this.adminSeedService = adminSeedService;
    }
    async seedLocations() {
        console.log('Lokasyonlar ekleniyor...');
        await this.locationsSeedService.seed();
        console.log('Lokasyonlar başarıyla eklendi!');
    }
    async seedUsers() {
        console.log('Test kullanıcıları ekleniyor...');
        await this.usersSeedService.seed();
        console.log('Test kullanıcıları başarıyla eklendi!');
    }
    async seedUserInfos() {
        console.log('UserInfo verileri ekleniyor...');
        await this.userInfoSeedService.seed();
        console.log('UserInfo verileri başarıyla eklendi!');
    }
    async seedAdmin() {
        console.log('Admin kullanıcısı ekleniyor...');
        await this.adminSeedService.seed();
        console.log('Admin kullanıcısı başarıyla eklendi!');
    }
    async runSeeds() {
        await this.seedLocations();
        await this.seedUsers();
        await this.seedUserInfos();
        await this.seedAdmin();
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        locations_seed_1.LocationsSeedService,
        users_seed_1.UsersSeedService,
        user_info_seed_1.UserInfoSeedService,
        admin_seed_1.AdminSeedService])
], SeedService);
//# sourceMappingURL=seed.service.js.map