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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_jwt_guard_1 = require("../auth/guards/admin-jwt.guard");
const admin_service_1 = require("./admin.service");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const update_user_dto_1 = require("../users/dto/update-user.dto");
const create_category_dto_1 = require("../categories/dto/create-category.dto");
const update_category_dto_1 = require("../categories/dto/update-category.dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getDashboard() {
        return this.adminService.getDashboardStats();
    }
    async getUserStats() {
        return this.adminService.getUserStats();
    }
    async getJobStats() {
        return this.adminService.getJobStats();
    }
    async getMessageStats() {
        return this.adminService.getMessageStats();
    }
    async getCategoryStats() {
        return this.adminService.getCategoryStats();
    }
    async getAllUsers() {
        return this.adminService.getAllUsers();
    }
    async getUserById(id) {
        return this.adminService.getUserById(id);
    }
    async createUser(createUserDto) {
        return this.adminService.createUser(createUserDto);
    }
    async updateUser(id, updateUserDto) {
        return this.adminService.updateUser(id, updateUserDto);
    }
    async toggleUserStatus(id, body) {
        return this.adminService.toggleUserStatus(id, body.status);
    }
    async toggleUserOnline(id, body) {
        return this.adminService.toggleUserOnline(id, body.isOnline);
    }
    async deleteUser(id) {
        return this.adminService.deleteUser(id);
    }
    async getUserCategories(id) {
        return this.adminService.getUserCategories(id);
    }
    async assignCategoriesToUser(id, body) {
        return this.adminService.assignCategoriesToUser(id, body.categoryIds);
    }
    async removeCategoriesFromUser(id, body) {
        return this.adminService.removeCategoriesFromUser(id, body.categoryIds);
    }
    async getAllCategories() {
        return this.adminService.getAllCategories();
    }
    async getActiveCategories() {
        return this.adminService.getActiveCategories();
    }
    async getCategoryById(id) {
        return this.adminService.getCategoryById(id);
    }
    async createCategory(createCategoryDto) {
        return this.adminService.createCategory(createCategoryDto);
    }
    async updateCategory(id, updateCategoryDto) {
        return this.adminService.updateCategory(id, updateCategoryDto);
    }
    async deleteCategory(id) {
        return this.adminService.deleteCategory(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin dashboard istatistikleri' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard verileri' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('users/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı istatistikleri' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcı verileri' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Get)('jobs/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'İş ilanı istatistikleri' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'İş ilanı verileri' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getJobStats", null);
__decorate([
    (0, common_1.Get)('messages/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Mesaj istatistikleri' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mesaj verileri' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMessageStats", null);
__decorate([
    (0, common_1.Get)('categories/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Kategori istatistikleri' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kategori verileri' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCategoryStats", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Tüm kullanıcıları listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcı listesi' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı detayını getir' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcı detayı' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Post)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Yeni kullanıcı oluştur' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Kullanıcı oluşturuldu' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createUser", null);
__decorate([
    (0, common_1.Put)('/users/:id'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Put)('/users/:id/status'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleUserStatus", null);
__decorate([
    (0, common_1.Put)('/users/:id/online'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleUserOnline", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı sil' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcı silindi' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('users/:id/categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcının kategorilerini getir' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcı kategorileri' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserCategories", null);
__decorate([
    (0, common_1.Post)('users/:id/categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcıya kategori ata' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kategoriler atandı' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "assignCategoriesToUser", null);
__decorate([
    (0, common_1.Delete)('users/:id/categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcıdan kategori kaldır' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kategoriler kaldırıldı' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeCategoriesFromUser", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Tüm kategorileri listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kategori listesi' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Get)('categories/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Aktif kategorileri listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Aktif kategoriler listesi' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getActiveCategories", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Kategori detayını getir' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kategori detayı' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCategoryById", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Yeni kategori oluştur' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Kategori oluşturuldu' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Put)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Kategori güncelle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kategori güncellendi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Kategori sil' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kategori silindi' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteCategory", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin Dashboard'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map