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
  @ApiOperation({ 
    summary: 'Kullanıcının tüm bilgilerini güncelle',
    description: `Token'dan kullanıcıyı bulup bilgilerini günceller.
    
    🔹 User Bilgileri: firstName, lastName, email, phone, userType, bio, profileImage, categoryIds, isOnline
    🔹 UserInfo Bilgileri: addressName, latitude, longitude, address, neighborhood, buildingNo, floor, apartmentNo, description
    
    ⚠️ Önemli Kurallar:
    • Sadece doldurulan alanlar güncellenir
    • Boş string veya null gönderilirse güncelleme yapılmaz
    • Koordinat (latitude/longitude) sadece worker kullanıcıları için geçerlidir
    • Şifre gönderilirse otomatik hash'lenir
    • Mevcut UserInfo varsa güncellenir, yoksa yeni oluşturulur
    
    📊 Response: Güncellenmiş kullanıcı bilgileri (GET /user ile aynı format)` 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Kullanıcı bilgileri başarıyla güncellendi. Response: { user bilgileri, userInfos: [], userCategories: [], userVerifications: [], userVerified: boolean }' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Geçersiz veri (Koordinat worker olmayana gönderilemez, geçersiz latitude/longitude değerleri, vb.)' 
  })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
  async updateMyCompleteProfile(
    @Request() req,
    @Body() completeUserDto: CompleteUserDto,
  ) {
    return this.usersService.updateCompleteUserProfile(req.user.sub, completeUserDto);
  }
}

