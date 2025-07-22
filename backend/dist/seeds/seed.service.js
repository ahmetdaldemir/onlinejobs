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
const categories_seed_1 = require("./categories.seed");
const locations_seed_1 = require("./locations.seed");
let SeedService = class SeedService {
    constructor(categoryRepository, locationsSeedService) {
        this.categoryRepository = categoryRepository;
        this.locationsSeedService = locationsSeedService;
    }
    async seedCategories() {
        const existingCategories = await this.categoryRepository.count();
        if (existingCategories === 0) {
            console.log('Kategoriler ekleniyor...');
            await this.categoryRepository.save(categories_seed_1.categoriesSeed);
            console.log('Kategoriler başarıyla eklendi!');
        }
        else {
            console.log('Kategoriler zaten mevcut.');
        }
    }
    async seedLocations() {
        console.log('Lokasyonlar ekleniyor...');
        await this.locationsSeedService.seed();
        console.log('Lokasyonlar başarıyla eklendi!');
    }
    async runSeeds() {
        await this.seedCategories();
        await this.seedLocations();
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        locations_seed_1.LocationsSeedService])
], SeedService);
//# sourceMappingURL=seed.service.js.map