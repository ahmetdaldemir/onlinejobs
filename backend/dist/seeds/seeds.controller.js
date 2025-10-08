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
exports.SeedsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const seed_service_1 = require("./seed.service");
const data_seed_service_1 = require("./data-seed.service");
const fix_category_ids_seed_1 = require("./fix-category-ids.seed");
let SeedsController = class SeedsController {
    constructor(seedService, dataSeedService, fixCategoryIdsSeed) {
        this.seedService = seedService;
        this.dataSeedService = dataSeedService;
        this.fixCategoryIdsSeed = fixCategoryIdsSeed;
    }
    async runAllSeeds() {
        return await this.seedService.runSeeds();
    }
    async seedLocations() {
        return await this.seedService.seedLocations();
    }
    async seedUsers() {
        return await this.seedService.seedUsers();
    }
    async seedUserInfos() {
        return await this.seedService.seedUserInfos();
    }
    async seedAdmin() {
        return await this.seedService.seedAdmin();
    }
    async seedAllData() {
        return await this.dataSeedService.seedAll();
    }
    async seedDataUsers() {
        return await this.dataSeedService.seedUsers();
    }
    async seedDataCategories() {
        return await this.dataSeedService.seedCategories();
    }
    async seedDataUserInfos() {
        return await this.dataSeedService.seedUserInfos();
    }
    async fixAllCategoryIds() {
        await this.fixCategoryIdsSeed.fixAllUserCategoryIds();
        return {
            message: 'CategoryIds senkronizasyonu tamamlandı',
            status: 'success'
        };
    }
    async fixUserCategoryIds(userId) {
        const user = await this.fixCategoryIdsSeed.fixSpecificUser(userId);
        return {
            message: 'Kullanıcı categoryIds güncellendi',
            userId: user.id,
            categoryIds: user.categoryIds,
            status: 'success'
        };
    }
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
};
exports.SeedsController = SeedsController;
__decorate([
    (0, common_1.Post)('run-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedsController.prototype, "runAllSeeds", null);
__decorate([
    (0, common_1.Post)('locations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedsController.prototype, "seedLocations", null);
__decorate([
    (0, common_1.Post)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedsController.prototype, "seedUsers", null);
__decorate([
    (0, common_1.Post)('user-info'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedsController.prototype, "seedUserInfos", null);
__decorate([
    (0, common_1.Post)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedsController.prototype, "seedAdmin", null);
__decorate([
    (0, common_1.Post)('data/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedsController.prototype, "seedAllData", null);
__decorate([
    (0, common_1.Post)('data/users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedsController.prototype, "seedDataUsers", null);
__decorate([
    (0, common_1.Post)('data/categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedsController.prototype, "seedDataCategories", null);
__decorate([
    (0, common_1.Post)('data/user-infos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedsController.prototype, "seedDataUserInfos", null);
__decorate([
    (0, common_1.Post)('fix/category-ids'),
    (0, swagger_1.ApiOperation)({ summary: 'Tüm kullanıcıların categoryIds array\'ini senkronize et' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedsController.prototype, "fixAllCategoryIds", null);
__decorate([
    (0, common_1.Post)('fix/category-ids/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Belirli kullanıcının categoryIds array\'ini düzelt' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SeedsController.prototype, "fixUserCategoryIds", null);
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedsController.prototype, "getSeedStatus", null);
exports.SeedsController = SeedsController = __decorate([
    (0, swagger_1.ApiTags)('Seeds'),
    (0, common_1.Controller)('seeds'),
    __metadata("design:paramtypes", [seed_service_1.SeedService,
        data_seed_service_1.DataSeedService,
        fix_category_ids_seed_1.FixCategoryIdsSeed])
], SeedsController);
//# sourceMappingURL=seeds.controller.js.map