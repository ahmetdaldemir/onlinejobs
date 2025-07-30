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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const categories_service_1 = require("./categories.service");
const common_2 = require("@nestjs/common");
const optional_auth_guard_1 = require("../auth/guards/optional-auth.guard");
let CategoriesController = class CategoriesController {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    async findAll(req) {
        if (req.user && req.user.role === 'admin') {
            return this.categoriesService.findAllWithInactive();
        }
        return this.categoriesService.findAll();
    }
    async findActive() {
        return this.categoriesService.findAll();
    }
    async findById(id) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new common_2.BadRequestException(`Geçersiz UUID formatı: ${id}. Lütfen geçerli bir kategori ID'si girin.`);
        }
        return this.categoriesService.findById(id);
    }
    async findByParentId(parentId) {
        return this.categoriesService.findByParentId(parentId);
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(optional_auth_guard_1.OptionalAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Kategorileri listele (Authentication opsiyonel)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kategoriler listelendi' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('public'),
    (0, swagger_1.ApiOperation)({ summary: 'Aktif kategorileri listele (Public endpoint)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Aktif kategoriler listelendi' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Kategori detayı' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kategori detayı' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Kategori bulunamadı' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Geçersiz UUID formatı' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('parent/:parentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Üst kategoriye göre kategorileri listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kategoriler listelendi' }),
    __param(0, (0, common_1.Param)('parentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findByParentId", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map