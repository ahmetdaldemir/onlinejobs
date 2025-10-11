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
    description: `Token'dan kullanıcıyı bulup tüm bilgilerini döner.
    
    📊 Response İçeriği:
    • User bilgileri (id, firstName, lastName, email, phone, userType, bio, rating, vb.)
    • userCategories: [] - Kullanıcının seçtiği kategoriler
    • userVerifications: [] - Verification kayıtları
    • userVerified: boolean - En az 1 approved verification varsa true
    
    👷 WORKER ise (userType: 'worker'):
    • city, district, neighborhood, latitude, longitude - User objesinde gelir
    • userInfos: [] - BOŞ ARRAY (Worker'ların UserInfo kaydı olmaz)
    
    👔 EMPLOYER ise (userType: 'employer'):
    • city, district, neighborhood, latitude, longitude - NULL (Employer'da olmaz)
    • userInfos: [] - Employer'ın adresleri (birden fazla olabilir)`
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Kullanıcı bilgileri başarıyla getirildi. Response: { user bilgileri, userCategories: [], userInfos: [], userVerifications: [], userVerified: boolean }' 
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
    
    🔹 User Bilgileri: firstName, lastName, email, phone, userType, bio, profileImage, categoryIds, isOnline, password
    
    👷 WORKER için (User tablosuna kaydedilir):
    • city (şehir)
    • district (ilçe)
    • neighborhood (mahalle)
    • latitude (enlem)
    • longitude (boylam)
    
    👔 EMPLOYER için (UserInfo tablosuna kaydedilir):
    • addressName (adres adı)
    • address (genel adres)
    • buildingNo (bina no)
    • floor (kat)
    • apartmentNo (daire no)
    • description (açıklama)
    
    ⚠️ Önemli Kurallar:
    • Sadece doldurulan alanlar güncellenir
    • Boş string veya null gönderilirse güncelleme yapılmaz
    • Worker'a UserInfo bilgileri gönderilemez
    • Employer'a konum bilgileri (city, district, vb.) gönderilemez
    • Şifre gönderilirse otomatik hash'lenir
    
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

