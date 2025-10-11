import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompleteUserDto } from './dto/complete-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Kullanıcının tüm bilgilerini getir',
    description: 'Token\'dan kullanıcıyı bulup tüm bilgilerini döner: User bilgileri, UserInfos (array), UserCategories (array), UserVerifications (array), UserVerified (boolean)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Kullanıcı bilgileri başarıyla getirildi. Response: { user bilgileri, userInfos: [], userCategories: [], userVerifications: [], userVerified: boolean }' 
  })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
  async getMyCompleteProfile(@Request() req) {
    return this.usersService.getCompleteUserProfile(req.user.sub);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcının tüm bilgilerini güncelle (User + UserInfo)' })
  @ApiResponse({ status: 200, description: 'Kullanıcı bilgileri başarıyla güncellendi' })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
  async updateMyCompleteProfile(
    @Request() req,
    @Body() completeUserDto: CompleteUserDto,
  ) {
    return this.usersService.updateCompleteUserProfile(req.user.sub, completeUserDto);
  }
}

