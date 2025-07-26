import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'admin123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AdminRegisterDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'admin123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'Admin' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'User' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'admin@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: false })
  @IsOptional()
  isSuperAdmin?: boolean;
}

export class AdminResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  admin: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email?: string;
    isActive: boolean;
    isSuperAdmin: boolean;
    lastLoginAt?: Date;
  };

  @ApiProperty()
  message: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  statusCode: number;
} 