import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, ValidateIf } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({required: false, description: 'Email zorunlu değil (worker için opsiyonel, employer için zorunlu)'})
  @ValidateIf((o) => o.userType === 'employer')
  @IsEmail({}, { message: 'Geçerli bir email adresi giriniz' })
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ type: String, description: 'Kullanıcı tipi: worker, employer' })
  @IsString()
  userType: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;
}

export class LoginDto {
  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  userType: string;
}

export class CheckPhoneDto {
  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  userType: string;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    userType: string;
    status: string;
    isVerified: boolean;
    isOnline: boolean;
    rating: number;
    totalReviews: number;
    profileImage?: string;
    bio?: string;
    userInfos?: {
      id: string;
      name: string;
      latitude?: number;
      longitude?: number;
      address?: string;
      neighborhood?: string;
      buildingNo?: string;
      floor?: string;
      apartmentNo?: string;
      description?: string;
    }[];

    categories?: {
      id: string;
      name: string;
    }[];
  };

  @ApiProperty()
  message: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  statusCode: number;


} 