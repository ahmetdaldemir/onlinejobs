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
  @ApiOperation({ summary: 'Test kullanıcılarını listele (Public)' })
  @ApiResponse({ status: 200, description: 'Test kullanıcıları listelendi' })
  async findTestUsers() {
    return this.usersService.findTestUsers();
  }

  @Get('real')
  @ApiOperation({ summary: 'Gerçek kullanıcıları listele (Public)' })
  @ApiResponse({ status: 200, description: 'Gerçek kullanıcılar listelendi' })
  async findRealUsers() {
    return this.usersService.findRealUsers();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tüm kullanıcıları listele' })
  @ApiResponse({ status: 200, description: 'Kullanıcılar listelendi' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aktif kullanıcıları listele' })
  @ApiResponse({ status: 200, description: 'Aktif kullanıcılar listelendi' })
  async findActiveUsers() {
    return this.usersService.findActiveUsers();
  }

  @Get('online')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Online kullanıcıları listele' })
  @ApiResponse({ status: 200, description: 'Online kullanıcılar listelendi' })
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
  @ApiOperation({ summary: 'Kullanıcıları tipe göre listele' })
  @ApiParam({ name: 'userType', description: 'Kullanıcı tipi: job_seeker, employer, both' })
  @ApiResponse({ status: 200, description: 'Kullanıcılar listelendi' })
  async findUsersByType(@Param('userType') userType: string) {
    return this.usersService.findUsersByType(userType);
  }

  @Put('user-types')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı tiplerini güncelle' })
  @ApiResponse({ status: 200, description: 'Kullanıcı tipleri güncellendi' })
  async updateUserTypes(
    @Request() req,
    @Body('userType') userType: string,
  ) {
    return this.usersService.updateUserTypes(req.user.sub, userType);
  }

  @Get('user-info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcının tüm adres bilgilerini getir' })
  @ApiResponse({ status: 200, description: 'Kullanıcının tüm adres bilgileri' })
  async getUserInfo(@Request() req) {
    return this.usersService.getUserInfo(req.user.sub);
  }

  @Get('user-infos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcının tüm adres bilgilerini getir (alias)' })
  @ApiResponse({ status: 200, description: 'Kullanıcının tüm adres bilgileri' })
  async getUserInfos(@Request() req) {
    return this.usersService.getUserInfo(req.user.sub);
  }

  @Put('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı durumunu güncelle' })
  @ApiResponse({ status: 200, description: 'Durum güncellendi' })
  async updateStatus(
    @Request() req,
    @Body('status') status: UserStatus,
  ) {
    return this.usersService.updateStatus(req.user.sub, status);
  }


  @Put('is-online')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı online durumunu güncelle' })
  @ApiResponse({ status: 200, description: 'Online durum güncellendi' })
  async updateIsOnline(
    @Request() req,
    @Body('isOnline') isOnline: boolean,
  ) {
    return this.usersService.updateIsOnline(req.user.sub, isOnline = true);
  }


  @Put('is-offline')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı offline durumunu güncelle' })
  @ApiResponse({ status: 200, description: 'Offline durum güncellendi' })
  async updateIsOffline(
    @Request() req,
    @Body('isOffline') isOffline: boolean,
  ) {
    return this.usersService.updateIsOffline(req.user.sub, isOffline = true);
  }
 

  @Get('is-verified')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcının tüm adres bilgilerini getir (alias)' })
  @ApiResponse({ status: 200, description: 'Kullanıcının tüm adres bilgileri' })
  async getUserIsVerified(@Request() req) {
    return this.usersService.getUserIsVerified(req.user.sub);
  }

  @Put('location')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı konumunu güncelle' })
  @ApiResponse({ status: 200, description: 'Konum güncellendi' })
  async updateLocation(
    @Request() req,
    @Body() locationData: { name?: string; latitude: number; longitude: number },
  ) {
    return this.usersService.updateLocation(req.user.sub, locationData.latitude, locationData.longitude, locationData.name);
  }

  @Put('user-info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı bilgilerini güncelle (ID ile güncelleme veya yeni ekleme)' })
  @ApiResponse({ status: 200, description: 'Kullanıcı bilgileri güncellendi' })
  @ApiResponse({ status: 400, description: 'Geçersiz veri veya kayıt bulunamadı' })
  async updateUserInfo(
    @Request() req,
    @Body() updateUserInfoDto: UpdateUserInfoDto,
  ) {
    return this.usersService.updateUserInfo(req.user.sub, updateUserInfoDto);
  }


  @Post('user-info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı bilgilerini güncelle (ID ile güncelleme veya yeni ekleme)' })
  @ApiResponse({ status: 200, description: 'Kullanıcı bilgileri güncellendi' })
  @ApiResponse({ status: 400, description: 'Geçersiz veri veya kayıt bulunamadı' })
  async createUserInfo(
    @Request() req,
    @Body() createUserInfoDto: any,
  ) {
    return this.usersService.createUserInfo(req.user.sub, createUserInfoDto);
  }



  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı profilini güncelle (profil fotoğrafı dahil)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        bio: { type: 'string' },
        categoryIds: { 
          type: 'array', 
          items: { type: 'string' } 
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Profil fotoğrafı (opsiyonel)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @Request() req,
    @Body() updateData: any,
    @UploadedFile() file?: any
  ) {
    return this.usersService.updateProfile(req.user.sub, updateData, file);
  }

  @Put('profile-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil fotoğrafını güncelle (Dosya yükle)' })
  @ApiResponse({ status: 200, description: 'Profil fotoğrafı güncellendi' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Profil fotoğrafı (max 5MB)',
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
  @ApiOperation({ summary: 'Kullanıcı profil fotoğrafını getir' })
  @ApiResponse({ status: 200, description: 'Profil fotoğrafı URL\'i' })
  async getProfileImage(@Param('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    return { profileImage: user.profileImage };
  }

  @Get('online-users')
  @ApiOperation({ summary: 'Online kullanıcıları listele' })
  @ApiResponse({ status: 200, description: 'Online kullanıcılar listelendi' })
  async getOnlineUsers() {
    return this.usersService.findOnlineUsers();
  }

  @Get('online-workers')
  @ApiOperation({ summary: 'Online işçileri listele' })
  @ApiResponse({ status: 200, description: 'Online işçiler listelendi' })
  async getOnlineWorkers(
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
    @Query('radius') radius?: number,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.usersService.findOnlineWorkers(latitude, longitude, radius, categoryId);
  }

  @Get('online-employers')
  @ApiOperation({ summary: 'Online işverenleri listele' })
  @ApiResponse({ status: 200, description: 'Online işverenler listelendi' })
  async getOnlineEmployers(
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
    @Query('radius') radius?: number,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.usersService.findOnlineEmployers(latitude, longitude, radius, categoryId);
  }

  @Get('user-status/:userId')
  @ApiOperation({ summary: 'Kullanıcının online durumunu getir' })
  @ApiResponse({ status: 200, description: 'Kullanıcı durumu' })
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

  // Portfolio yönetimi
  @Post('portfolio/images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Portföy resmi ekle (sadece worker kullanıcılar için)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Portföy resmi (max 5MB, max 10 resim)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Portföy resmi eklendi' })
  @ApiResponse({ status: 400, description: 'Geçersiz dosya veya maksimum resim sayısı aşıldı' })
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

  @Get('portfolio/images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcının portföy resimlerini getir' })
  @ApiResponse({ status: 200, description: 'Portföy resimleri' })
  async getPortfolioImages(@Request() req) {
    const images = await this.usersService.getPortfolioImages(req.user.sub);
    return {
      portfolioImages: images,
      totalImages: images.length,
    };
  }

  @Get('portfolio/images/:userId')
  @ApiOperation({ summary: 'Belirli bir kullanıcının portföy resimlerini getir (public)' })
  @ApiResponse({ status: 200, description: 'Portföy resimleri' })
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
  @ApiOperation({ summary: 'Portföy resmini sil' })
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
  @ApiResponse({ status: 200, description: 'Portföy resmi silindi' })
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
  @ApiOperation({ summary: 'Tüm portföy resimlerini sil' })
  @ApiResponse({ status: 200, description: 'Tüm portföy resimleri silindi' })
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
  @ApiOperation({ summary: 'Kullanıcı detayı (UUID ile)' })
  @ApiResponse({ status: 200, description: 'Kullanıcı detayı' })
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