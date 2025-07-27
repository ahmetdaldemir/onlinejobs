import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { AdminService } from './admin.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { CreateCategoryDto } from '../categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../categories/dto/update-category.dto';

@ApiTags('Admin Dashboard')
@Controller('admin')
@UseGuards(AdminJwtGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Admin dashboard istatistikleri' })
  @ApiResponse({ status: 200, description: 'Dashboard verileri' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users/stats')
  @ApiOperation({ summary: 'Kullanıcı istatistikleri' })
  @ApiResponse({ status: 200, description: 'Kullanıcı verileri' })
  async getUserStats() {
    return this.adminService.getUserStats();
  }

  @Get('jobs/stats')
  @ApiOperation({ summary: 'İş ilanı istatistikleri' })
  @ApiResponse({ status: 200, description: 'İş ilanı verileri' })
  async getJobStats() {
    return this.adminService.getJobStats();
  }

  @Get('messages/stats')
  @ApiOperation({ summary: 'Mesaj istatistikleri' })
  @ApiResponse({ status: 200, description: 'Mesaj verileri' })
  async getMessageStats() {
    return this.adminService.getMessageStats();
  }

  @Get('categories/stats')
  @ApiOperation({ summary: 'Kategori istatistikleri' })
  @ApiResponse({ status: 200, description: 'Kategori verileri' })
  async getCategoryStats() {
    return this.adminService.getCategoryStats();
  }

  // User Management Endpoints
  @Get('users')
  @ApiOperation({ summary: 'Tüm kullanıcıları listele' })
  @ApiResponse({ status: 200, description: 'Kullanıcı listesi' })
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Kullanıcı detayını getir' })
  @ApiResponse({ status: 200, description: 'Kullanıcı detayı' })
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Post('users')
  @ApiOperation({ summary: 'Yeni kullanıcı oluştur' })
  @ApiResponse({ status: 201, description: 'Kullanıcı oluşturuldu' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }

  @Put('/users/:id')
  @UseGuards(AdminJwtGuard)
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Put('/users/:id/status')
  @UseGuards(AdminJwtGuard)
  async toggleUserStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.adminService.toggleUserStatus(id, body.status);
  }

  @Put('/users/:id/online')
  @UseGuards(AdminJwtGuard)
  async toggleUserOnline(@Param('id') id: string, @Body() body: { isOnline: boolean }) {
    return this.adminService.toggleUserOnline(id, body.isOnline);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Kullanıcı sil' })
  @ApiResponse({ status: 200, description: 'Kullanıcı silindi' })
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // Kategori Atama Endpoints
  @Get('users/:id/categories')
  @ApiOperation({ summary: 'Kullanıcının kategorilerini getir' })
  @ApiResponse({ status: 200, description: 'Kullanıcı kategorileri' })
  async getUserCategories(@Param('id') id: string) {
    return this.adminService.getUserCategories(id);
  }

  @Post('users/:id/categories')
  @ApiOperation({ summary: 'Kullanıcıya kategori ata' })
  @ApiResponse({ status: 200, description: 'Kategoriler atandı' })
  async assignCategoriesToUser(
    @Param('id') id: string, 
    @Body() body: { categoryIds: string[] }
  ) {
    return this.adminService.assignCategoriesToUser(id, body.categoryIds);
  }

  @Delete('users/:id/categories')
  @ApiOperation({ summary: 'Kullanıcıdan kategori kaldır' })
  @ApiResponse({ status: 200, description: 'Kategoriler kaldırıldı' })
  async removeCategoriesFromUser(
    @Param('id') id: string, 
    @Body() body: { categoryIds: string[] }
  ) {
    return this.adminService.removeCategoriesFromUser(id, body.categoryIds);
  }

  // Category Management Endpoints
  @Get('categories')
  @ApiOperation({ summary: 'Tüm kategorileri listele' })
  @ApiResponse({ status: 200, description: 'Kategori listesi' })
  async getAllCategories() {
    return this.adminService.getAllCategories();
  }

  @Get('categories/active')
  @ApiOperation({ summary: 'Aktif kategorileri listele' })
  @ApiResponse({ status: 200, description: 'Aktif kategoriler listesi' })
  async getActiveCategories() {
    return this.adminService.getActiveCategories();
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Kategori detayını getir' })
  @ApiResponse({ status: 200, description: 'Kategori detayı' })
  async getCategoryById(@Param('id') id: string) {
    return this.adminService.getCategoryById(id);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Yeni kategori oluştur' })
  @ApiResponse({ status: 201, description: 'Kategori oluşturuldu' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.adminService.createCategory(createCategoryDto);
  }

  @Put('categories/:id')
  @ApiOperation({ summary: 'Kategori güncelle' })
  @ApiResponse({ status: 200, description: 'Kategori güncellendi' })
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.adminService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Kategori sil' })
  @ApiResponse({ status: 200, description: 'Kategori silindi' })
  async deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(id);
  }
} 