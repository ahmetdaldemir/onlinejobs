import { Controller, Get, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserStatus } from './entities/user.entity';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';

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

  @Get('online-job-seekers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Online iş arayanları listele' })
  @ApiQuery({ name: 'latitude', required: false, type: Number })
  @ApiQuery({ name: 'longitude', required: false, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Online iş arayanlar listelendi' })
  async findOnlineJobSeekers(
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
    @Query('radius') radius?: number,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.usersService.findOnlineJobSeekers(latitude, longitude, radius, categoryId);
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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı detayı' })
  @ApiResponse({ status: 200, description: 'Kullanıcı detayı' })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
  async findById(@Param('id') id: string) {
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

  @Get('user-info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı bilgilerini getir' })
  @ApiResponse({ status: 200, description: 'Kullanıcı bilgileri getirildi' })
  async getUserInfo(@Request() req) {
    return this.usersService.getUserInfo(req.user.sub);
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
  @ApiOperation({ summary: 'Kullanıcı profilini güncelle' })
  @ApiResponse({ status: 200, description: 'Profil güncellendi' })
  async updateProfile(
    @Request() req,
    @Body() updateData: any,
  ) {
    return this.usersService.updateProfile(req.user.sub, updateData);
  }
} 