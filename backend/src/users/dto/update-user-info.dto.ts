import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';

export class UpdateUserInfoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  countryId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  cityId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  districtId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  neighborhoodId?: string;
} 