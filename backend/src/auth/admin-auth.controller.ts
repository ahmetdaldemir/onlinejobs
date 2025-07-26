import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto, AdminRegisterDto, AdminResponseDto } from './dto/admin-auth.dto';
import { AdminJwtGuard } from './guards/admin-jwt.guard';

@ApiTags('Admin Authentication')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Admin kayıt' })
  @ApiResponse({ status: 201, description: 'Admin başarıyla kayıt oldu', type: AdminResponseDto })
  @ApiResponse({ status: 409, description: 'Kullanıcı adı zaten kullanımda' })
  async register(@Body() registerDto: AdminRegisterDto): Promise<AdminResponseDto> {
    return this.adminAuthService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Admin giriş' })
  @ApiResponse({ status: 200, description: 'Admin başarıyla giriş yaptı', type: AdminResponseDto })
  @ApiResponse({ status: 401, description: 'Geçersiz kullanıcı adı veya şifre' })
  async login(@Body() loginDto: AdminLoginDto): Promise<AdminResponseDto> {
    return this.adminAuthService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin profili' })
  @ApiResponse({ status: 200, description: 'Admin profili' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  async getProfile(@Request() req) {
    return {
      id: req.user.id,
      username: req.user.username,
      isAdmin: req.user.isAdmin,
      isSuperAdmin: req.user.isSuperAdmin,
    };
  }
} 