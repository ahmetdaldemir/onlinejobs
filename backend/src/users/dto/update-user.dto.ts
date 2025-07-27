import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ enum: ['worker', 'employer'], required: false })
  @IsOptional()
  @IsEnum(['worker', 'employer'])
  userType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  userInfo?: {
    address?: string;
    neighborhood?: string;
    buildingNo?: string;
    floor?: string;
    apartmentNo?: string;
    description?: string;
  };

  @ApiProperty({ required: false, type: [String], description: 'Kategori ID\'leri (sadece worker için)' })
  @IsOptional()
  categoryIds?: string[];
} 