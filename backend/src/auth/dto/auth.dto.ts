import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserType } from '../../users/entities/user.entity';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserType })
  @IsEnum(UserType)
  userType: UserType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class ChckPhoneDto {
  @ApiProperty()
  @IsString()
  phone: string;
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
    userType: UserType;
    status: string;
    isVerified: boolean;
    rating: number;
    totalReviews: number;
    profileImage?: string;
    bio?: string;
    category?: {
      id: string;
      name: string;
    };
  };

  @ApiProperty()
  message: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  statusCode: number;


} 