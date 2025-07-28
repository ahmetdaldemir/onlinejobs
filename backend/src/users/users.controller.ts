import { Controller, Get, Put, Body, Param, Query, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserStatus } from './entities/user.entity';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { IsUUID } from 'class-validator';

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
  @ApiOperation({ summary: 'Kullanıcı bilgilerini getir' })
  @ApiResponse({ status: 200, description: 'Kullanıcı bilgileri getirildi' })
  async getUserInfo(@Request() req) {
    return this.usersService.getUserInfo(req.user.sub);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı detayı' })
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
    return this.usersService.updateIsOnline(req.user.sub, isOnline);
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
  @ApiOperation({ summary: 'Kullanıcı bilgilerini güncelle' })
  @ApiResponse({ status: 200, description: 'Kullanıcı bilgileri güncellendi' })
  async updateUserInfo(
    @Request() req,
    @Body() updateUserInfoDto: UpdateUserInfoDto,
  ) {
    return this.usersService.updateUserInfo(req.user.sub, updateUserInfoDto);
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
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.usersService.updateProfile(req.user.sub, updateData, file);
  }

  @Put('profile-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil fotoğrafını güncelle' })
  @ApiResponse({ status: 200, description: 'Profil fotoğrafı güncellendi' })
  async updateProfileImage(
    @Request() req,
    @Body() body: { imageUrl: string },
  ) {
    const userId = req.user.sub;
    return this.usersService.updateProfileImage(userId, body.imageUrl);
  }
} 