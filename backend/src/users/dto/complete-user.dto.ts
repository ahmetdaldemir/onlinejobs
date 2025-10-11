import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsEnum, IsBoolean, IsArray, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CompleteUserDto {
  // User bilgileri
  @ApiProperty({ 
    required: false, 
    description: 'Ad', 
    example: 'Ahmet' 
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Soyad', 
    example: 'Yılmaz' 
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ 
    required: false, 
    description: 'E-posta', 
    example: 'ahmet@example.com' 
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Telefon', 
    example: '5551234567' 
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Şifre (otomatik hash\'lenir)', 
    example: 'newPassword123' 
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ 
    enum: ['worker', 'employer'], 
    required: false, 
    description: 'Kullanıcı tipi', 
    example: 'worker' 
  })
  @IsOptional()
  @IsEnum(['worker', 'employer'])
  userType?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Biyografi', 
    example: 'Deneyimli elektrikçi. 10 yıllık tecrübe.' 
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Profil resmi URL', 
    example: '/uploads/profile-123456789.jpg' 
  })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ 
    required: false, 
    type: [String], 
    description: 'Kategori ID\'leri (UUID array)', 
    example: ['4b1d469b-a737-4912-a902-40ec3eabe4f1', '741ac181-697a-4e85-9f6d-8e7e00ecf501'] 
  })
  @IsOptional()
  @IsArray()
  categoryIds?: string[];

  @ApiProperty({ 
    required: false, 
    description: 'Online durumu', 
    example: true 
  })
  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;

  // Worker için konum bilgileri (User tablosunda)
  @ApiProperty({ 
    required: false, 
    description: '🔹 Şehir - Sadece WORKER için (User tablosuna kaydedilir)', 
    example: 'İstanbul' 
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ 
    required: false, 
    description: '🔹 İlçe - Sadece WORKER için (User tablosuna kaydedilir)', 
    example: 'Kadıköy' 
  })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({ 
    required: false, 
    description: '🔹 Mahalle - Sadece WORKER için (User tablosuna kaydedilir)', 
    example: 'Fenerbahçe Mahallesi' 
  })
  @IsOptional()
  @IsString()
  neighborhood?: string;

  @ApiProperty({ 
    required: false, 
    description: '🔹 Enlem (latitude) - Sadece WORKER için! -90 ile 90 arası (User tablosuna kaydedilir)', 
    example: 41.0082376,
    minimum: -90,
    maximum: 90
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  })
  @IsNumber()
  latitude?: number;

  @ApiProperty({ 
    required: false, 
    description: '🔹 Boylam (longitude) - Sadece WORKER için! -180 ile 180 arası (User tablosuna kaydedilir)', 
    example: 28.9783589,
    minimum: -180,
    maximum: 180
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  })
  @IsNumber()
  longitude?: number;

  // Employer için UserInfo bilgileri
  @ApiProperty({ 
    required: false, 
    description: '🔸 Adres adı - Sadece EMPLOYER için (UserInfo tablosuna kaydedilir)', 
    example: 'Ev Adresim' 
  })
  @IsOptional()
  @IsString()
  addressName?: string;

  @ApiProperty({ 
    required: false, 
    description: '🔸 Genel adres - Sadece EMPLOYER için (UserInfo tablosuna kaydedilir)', 
    example: 'Bağdat Caddesi No:14, Kadıköy/İstanbul' 
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ 
    required: false, 
    description: '🔸 Bina numarası - Sadece EMPLOYER için (UserInfo tablosuna kaydedilir)', 
    example: '12/A' 
  })
  @IsOptional()
  @IsString()
  buildingNo?: string;

  @ApiProperty({ 
    required: false, 
    description: '🔸 Kat bilgisi - Sadece EMPLOYER için (UserInfo tablosuna kaydedilir)', 
    example: '3' 
  })
  @IsOptional()
  @IsString()
  floor?: string;

  @ApiProperty({ 
    required: false, 
    description: '🔸 Daire numarası - Sadece EMPLOYER için (UserInfo tablosuna kaydedilir)', 
    example: '8' 
  })
  @IsOptional()
  @IsString()
  apartmentNo?: string;

  @ApiProperty({ 
    required: false, 
    description: '🔸 Adres açıklaması - Sadece EMPLOYER için (UserInfo tablosuna kaydedilir)', 
    example: 'Kapı kodu: 1234. Zile bastığınızda açılır.' 
  })
  @IsOptional()
  @IsString()
  description?: string;
}

