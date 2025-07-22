import { Controller, Get, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserStatus } from './entities/user.entity';

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

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tüm kullanıcıları listele' })
  @ApiResponse({ status: 200, description: 'Kullanıcılar listelendi' })
  async findAll() {
    return this.usersService.findAll();
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

  @Put('location')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı konumunu güncelle' })
  @ApiResponse({ status: 200, description: 'Konum güncellendi' })
  async updateLocation(
    @Request() req,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number,
  ) {
    return this.usersService.updateLocation(req.user.sub, latitude, longitude);
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