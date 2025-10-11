import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsEnum, IsBoolean, IsArray, IsNumber } from 'class-validator';

export class CompleteUserDto {
  // User bilgileri
  @ApiProperty({ required: false, description: 'Ad' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, description: 'Soyad' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false, description: 'E-posta' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, description: 'Telefon' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, description: 'Şifre' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ enum: ['worker', 'employer'], required: false, description: 'Kullanıcı tipi' })
  @IsOptional()
  @IsEnum(['worker', 'employer'])
  userType?: string;

  @ApiProperty({ required: false, description: 'Biyografi' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false, description: 'Profil resmi URL' })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ required: false, type: [String], description: 'Kategori ID\'leri (sadece worker için)' })
  @IsOptional()
  @IsArray()
  categoryIds?: string[];

  @ApiProperty({ required: false, description: 'Online durumu' })
  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;

  // UserInfo bilgileri
  @ApiProperty({ required: false, description: 'Adres adı' })
  @IsOptional()
  @IsString()
  addressName?: string;

  @ApiProperty({ required: false, description: 'Enlem (latitude) - Sadece worker için' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false, description: 'Boylam (longitude) - Sadece worker için' })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ required: false, description: 'Genel adres' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, description: 'Mahalle/Cadde/Sokak' })
  @IsOptional()
  @IsString()
  neighborhood?: string;

  @ApiProperty({ required: false, description: 'Bina numarası' })
  @IsOptional()
  @IsString()
  buildingNo?: string;

  @ApiProperty({ required: false, description: 'Kat bilgisi' })
  @IsOptional()
  @IsString()
  floor?: string;

  @ApiProperty({ required: false, description: 'Daire numarası' })
  @IsOptional()
  @IsString()
  apartmentNo?: string;

  @ApiProperty({ required: false, description: 'Adres açıklaması' })
  @IsOptional()
  @IsString()
  description?: string;
}

