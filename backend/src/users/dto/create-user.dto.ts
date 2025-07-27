import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({ enum: ['worker', 'employer'] })
  @IsEnum(['worker', 'employer'])
  userType: string;

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