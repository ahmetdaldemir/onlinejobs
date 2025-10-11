import { Controller, Get, Put, Body, Param, Query, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserStatus } from './entities/user.entity';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { IsUUID } from 'class-validator';
import type { Express } from 'express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('test')
  @ApiOperation({ 
    summary: 'Test kullanıcılarını listele (Public)',
    description: 'Development için - Test telefon numaralarına (+905550000001-005) sahip kullanıcıları listeler.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Test kullanıcıları listelendi. Response: User[]' 
  })
  async findTestUsers() {
    return this.usersService.findTestUsers();
  }

  @Get('real')
  @ApiOperation({ 
    summary: 'Gerçek kullanıcıları listele (Public)',
    description: 'Development için - Test kullanıcıları hariç gerçek kullanıcıları listeler.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Gerçek kullanıcılar listelendi. Response: User[]' 
  })
  async findRealUsers() {
    return this.usersService.findRealUsers();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Tüm kullanıcıları listele (Admin)',
    description: 'Admin paneli için - Tüm kullanıcıları listeler.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Kullanıcılar listelendi. Response: User[]' 
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Aktif kullanıcıları listele (Admin)',
    description: 'Admin paneli için - Status: ACTIVE olan kullanıcıları listeler.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Aktif kullanıcılar listelendi. Response: User[]' 
  })
  async findActiveUsers() {
    return this.usersService.findActiveUsers();
  }

  @Get('online')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Online kullanıcıları listele (Admin)',
    description: 'Admin paneli için - isOnline: true olan kullanıcıları listeler.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Online kullanıcılar listelendi. Response: User[]' 
  })
  async findOnlineUsers() {
    return this.usersService.findOnlineUsers();
  }

  @Get('online-workers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yakındaki online worker\'ları listele' })
  @ApiQuery({ name: 'latitude', required: false, type: Number, description: 'Enlem (latitude)' })
  @ApiQuery({ name: 'longitude', required: false, type: Number, description: 'Boylam (longitude)' })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Arama yarıçapı (km)' })
  @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'Kategori ID' })
  @ApiResponse({ status: 200, description: 'Yakındaki online worker\'lar listelendi' })
  async findOnlineWorkers(
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
    @Query('radius') radius?: number,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.usersService.findOnlineWorkers(latitude, longitude, radius, categoryId);
  }

  @Get('online-employers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Online işverenleri listele' })
  @ApiQuery({ name: 'latitude', required: false, type: Number })
  @ApiQuery({ name: 'longitude', required: false, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Online işverenler listelendi' })
  async findOnlineEmployers(
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
    @Query('radius') radius?: number,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.usersService.findOnlineEmployers(latitude, longitude, radius, categoryId);
  }

  @Get('by-type/:userType')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Kullanıcıları tipe göre listele (Admin)',
    description: 'Admin paneli için - Kullanıcıları userType\'a göre filtreler (worker, employer).'
  })
  @ApiParam({ 
    name: 'userType', 
    description: 'Kullanıcı tipi',
    enum: ['worker', 'employer']
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Kullanıcılar listelendi. Response: User[]' 
  })
  async findUsersByType(@Param('userType') userType: string) {
    return this.usersService.findUsersByType(userType);
  }

  // ❌ KALDIRILDI: Artık GET /user ve PUT /user endpoint'leri kullanılıyor
  // Kaldırılan endpoint'ler:
  // - PUT /users/user-types, GET /users/user-info, GET /users/user-infos
  // - PUT /users/status, PUT /users/is-online, PUT /users/is-offline
  // - GET /users/is-verified, PUT /users/location, PUT /users/user-info
  // - POST /users/user-info, PUT /users/profile
  //
  // Hepsi şu endpoint'lerden yapılıyor:
  // ✅ GET /user - Tüm bilgileri getir
  // ✅ PUT /user - Tüm bilgileri güncelle

  @Put('profile-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Profil fotoğrafını yükle ve güncelle',
    description: 'Dosya upload için özel endpoint. Profil fotoğrafını yükler ve user.profileImage alanını günceller. Diğer bilgiler için PUT /user kullanın.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Profil fotoğrafı başarıyla güncellendi. Response: { profileImage: string, message: string }' 
  })
  @ApiResponse({ status: 400, description: 'Dosya yüklenmedi veya geçersiz format' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Profil fotoğrafı (max 5MB, jpg/jpeg/png)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateProfileImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Profil fotoğrafı yüklenmedi');
    }
    
    const userId = req.user.sub;
    return this.usersService.updateProfileWithFile(userId, file);
  }

  @Get('profile-image/:userId')
  @ApiOperation({ 
    summary: 'Başka kullanıcının profil fotoğrafını getir',
    description: 'Public endpoint - Başka bir kullanıcının profil resmini almak için kullanılır.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Profil fotoğrafı URL\'i. Response: { profileImage: string }' 
  })
  async getProfileImage(@Param('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    return { profileImage: user.profileImage };
  }

  @Get('online-users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Tüm online kullanıcıları listele',
    description: 'Hem worker hem employer - online olan tüm kullanıcıları listeler.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Online kullanıcılar listelendi. Response: User[]' 
  })
  async getOnlineUsers() {
    return this.usersService.findOnlineUsers();
  }

  @Get('online-workers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Yakındaki online worker\'ları listele (Employer için)',
    description: 'Employer\'ların yakındaki online worker\'ları bulmak için kullanır. Worker koordinatları User tablosundan alınır.'
  })
  @ApiQuery({ name: 'latitude', required: false, type: Number, description: 'Enlem (latitude)' })
  @ApiQuery({ name: 'longitude', required: false, type: Number, description: 'Boylam (longitude)' })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Arama yarıçapı (km)' })
  @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'Kategori ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Online worker\'lar listelendi. Worker\'ların city, district, neighborhood, latitude, longitude bilgileri User objesinde gelir.' 
  })
  async getOnlineWorkers(
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
    @Query('radius') radius?: number,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.usersService.findOnlineWorkers(latitude, longitude, radius, categoryId);
  }

  @Get('online-employers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Yakındaki online employer\'ları listele (Worker için)',
    description: 'Worker\'ların yakındaki online employer\'ları bulmak için kullanır. Employer koordinatları UserInfo tablosundan alınır.'
  })
  @ApiQuery({ name: 'latitude', required: false, type: Number, description: 'Enlem (latitude)' })
  @ApiQuery({ name: 'longitude', required: false, type: Number, description: 'Boylam (longitude)' })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Arama yarıçapı (km)' })
  @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'Kategori ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Online employer\'lar listelendi. Employer\'ların adres bilgileri userInfos array\'inde gelir.' 
  })
  async getOnlineEmployers(
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
    @Query('radius') radius?: number,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.usersService.findOnlineEmployers(latitude, longitude, radius, categoryId);
  }

  @Get('user-status/:userId')
  @ApiOperation({ 
    summary: 'Başka kullanıcının online durumunu getir',
    description: 'Chat ve messaging için kullanılır. Başka bir kullanıcının online durumunu, son görülme zamanını ve temel bilgilerini döner.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Kullanıcı online durumu. Response: { userId: string, isOnline: boolean, lastSeen: Date, firstName: string, lastName: string }' 
  })
  async getUserStatus(@Param('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    return {
      userId: user.id,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
      firstName: user.firstName,
      lastName: user.lastName
    };
  }

  // Portfolio yönetimi (sadece worker için)
  @Post('portfolio/images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Portföy resmi ekle (sadece worker)',
    description: 'Worker\'ların portföy resmi yüklemesi için. Max 10 resim eklenebilir. Güncel liste için GET /user kullanın.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Portföy resmi (max 5MB, jpg/jpeg/png)',
        },
      },
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Portföy resmi eklendi. Response: { message: string, portfolioImages: string[], totalImages: number }' 
  })
  @ApiResponse({ status: 400, description: 'Geçersiz dosya, maksimum resim sayısı aşıldı (max 10), veya kullanıcı worker değil' })
  @UseInterceptors(FileInterceptor('file'))
  async addPortfolioImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Resim dosyası yüklenmedi');
    }
    
    const user = await this.usersService.addPortfolioImage(req.user.sub, file);
    return {
      message: 'Portföy resmi başarıyla eklendi',
      portfolioImages: user.portfolioImages,
      totalImages: user.portfolioImages.length,
    };
  }

  // ❌ KALDIRILDI: GET /users/portfolio/images
  // Artık GET /user response'unda portfolioImages array'i geliyor

  @Get('portfolio/images/:userId')
  @ApiOperation({ 
    summary: 'Başka kullanıcının portföy resimlerini getir',
    description: 'Public endpoint - Başka bir kullanıcının (worker) portföy resimlerini görüntülemek için. Kendi portföy resimleriniz için GET /user kullanın.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Portföy resimleri. Response: { userId: string, portfolioImages: string[], totalImages: number }' 
  })
  async getUserPortfolioImages(@Param('userId') userId: string) {
    const images = await this.usersService.getPortfolioImages(userId);
    return {
      userId,
      portfolioImages: images,
      totalImages: images.length,
    };
  }

  @Post('portfolio/images/delete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Portföy resmini sil (sadece worker)',
    description: 'Belirtilen URL\'deki portföy resmini siler. Güncel portfolio listesi için GET /user kullanın.'
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['imageUrl'],
      properties: {
        imageUrl: {
          type: 'string',
          description: 'Silinecek resmin URL\'si',
          example: '/uploads/portfolio-images/portfolio-1234567890-123456789.jpg',
        },
      },
    },
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Portföy resmi silindi. Response: { message: string, portfolioImages: string[], totalImages: number }' 
  })
  @ApiResponse({ status: 400, description: 'Geçersiz URL veya resim bulunamadı' })
  async deletePortfolioImage(
    @Request() req,
    @Body('imageUrl') imageUrl: string,
  ) {
    if (!imageUrl) {
      throw new BadRequestException('Resim URL\'si gerekli');
    }
    
    const user = await this.usersService.deletePortfolioImage(req.user.sub, imageUrl);
    return {
      message: 'Portföy resmi başarıyla silindi',
      portfolioImages: user.portfolioImages,
      totalImages: user.portfolioImages.length,
    };
  }

  @Post('portfolio/images/delete-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Tüm portföy resimlerini sil (sadece worker)',
    description: 'Kullanıcının tüm portföy resimlerini siler. Güncel bilgi için GET /user kullanın.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tüm portföy resimleri silindi. Response: { message: string, portfolioImages: [], totalImages: 0 }' 
  })
  async deleteAllPortfolioImages(@Request() req) {
    await this.usersService.deleteAllPortfolioImages(req.user.sub);
    return {
      message: 'Tüm portföy resimleri başarıyla silindi',
      portfolioImages: [],
      totalImages: 0,
    };
  }

  // ⚠️ Bu endpoint en sonda olmalı - genel parametreli route
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Başka kullanıcının detaylarını getir (UUID ile)',
    description: 'Başka bir kullanıcının profil bilgilerini görüntülemek için kullanılır (chat, profil görüntüleme vb.). Kendi bilgileriniz için GET /user kullanın.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Kullanıcı bilgileri. Response: User entity (şifre hariç)' 
  })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
  @ApiResponse({ status: 400, description: 'Geçersiz UUID formatı' })
  async findById(@Param('id') id: string) {
    // UUID formatını kontrol et
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException(`Geçersiz UUID formatı: ${id}. Lütfen geçerli bir kullanıcı ID'si girin.`);
    }
    return this.usersService.findById(id);
  }
} 