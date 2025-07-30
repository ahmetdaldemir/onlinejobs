import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { BadRequestException } from '@nestjs/common';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Kategorileri listele (Authentication opsiyonel)' })
  @ApiResponse({ status: 200, description: 'Kategoriler listelendi' })
  @ApiBearerAuth()
  async findAll(@Request() req?: any) {
    // Token varsa ve admin ise tüm kategorileri döndür
    // Yoksa sadece aktif kategorileri döndür
    if (req.user && req.user.role === 'admin') {
      return this.categoriesService.findAllWithInactive();
    }
    
    // Token yok veya admin değilse sadece aktif kategorileri döndür
    return this.categoriesService.findAll();
  }

  @Get('public')
  @ApiOperation({ summary: 'Aktif kategorileri listele (Public endpoint)' })
  @ApiResponse({ status: 200, description: 'Aktif kategoriler listelendi' })
  async findActive() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Kategori detayı' })
  @ApiResponse({ status: 200, description: 'Kategori detayı' })
  @ApiResponse({ status: 404, description: 'Kategori bulunamadı' })
  @ApiResponse({ status: 400, description: 'Geçersiz UUID formatı' })
  async findById(@Param('id') id: string) {
    // UUID formatını kontrol et
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException(`Geçersiz UUID formatı: ${id}. Lütfen geçerli bir kategori ID'si girin.`);
    }
    return this.categoriesService.findById(id);
  }

  @Get('parent/:parentId')
  @ApiOperation({ summary: 'Üst kategoriye göre kategorileri listele' })
  @ApiResponse({ status: 200, description: 'Kategoriler listelendi' })
  async findByParentId(@Param('parentId') parentId: string) {
    return this.categoriesService.findByParentId(parentId);
  }
} 