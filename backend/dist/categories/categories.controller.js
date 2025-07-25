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
let CategoriesController = class CategoriesController {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    async findAll() {
        return this.categoriesService.findAll();
    }
    async findById(id) {
        return this.categoriesService.findById(id);
    }
    async create(createCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }
    async update(id, updateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }
    async clearAll() {
        return this.categoriesService.clearAll();
    }
    async delete(id) {
        return this.categoriesService.delete(id);
    }
    async findByParentId(parentId) {
        return this.categoriesService.findByParentId(parentId);
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tüm kategorileri listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kategoriler listelendi' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Kategori detayı' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kategori detayı' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Kategori bulunamadı' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Yeni kategori oluştur' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Kategori oluşturuldu' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Kategori güncelle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kategori güncellendi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('clear'),
    (0, swagger_1.ApiOperation)({ summary: 'Tüm kategorileri sil' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tüm kategoriler silindi' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "clearAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Kategori sil' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kategori silindi' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "delete", null);
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