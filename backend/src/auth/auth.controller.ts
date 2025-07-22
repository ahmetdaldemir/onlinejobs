import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Kullanıcı kaydı' })
  @ApiResponse({ status: 201, description: 'Kullanıcı başarıyla kaydedildi', type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'Email veya telefon zaten kullanımda' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Kullanıcı girişi' })
  @ApiResponse({ status: 200, description: 'Başarılı giriş', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Geçersiz kimlik bilgileri' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }


  @Post('chck-phone')
  @ApiOperation({ summary: 'Telefon numarası kontrolü' })
  @ApiResponse({ status: 200, description: 'Telefon numarası kontrolü başarılı' })
  @ApiResponse({ status: 400, description: 'Telefon numarası zaten kullanımda' })
  async chckPhone(@Body() chckPhoneDto: ChckPhoneDto): Promise<AuthResponseDto> {
    return this.authService.chckPhone(chckPhoneDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı profili' })
  @ApiResponse({ status: 200, description: 'Kullanıcı profili' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme hatası' })
  async getProfile(@Request() req) {
    return this.authService.validateUser(req.user.sub);
  }
} 