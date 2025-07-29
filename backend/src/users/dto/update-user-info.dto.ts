import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';

export class UpdateUserInfoDto {
  @ApiProperty({ required: false, description: 'UserInfo ID (güncelleme için)' })
  @IsOptional()
  @IsUUID()
  userInfoId?: string;

  @ApiProperty({ required: false, description: 'Adres adı' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: 'Enlem (latitude)' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false, description: 'Boylam (longitude)' })
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