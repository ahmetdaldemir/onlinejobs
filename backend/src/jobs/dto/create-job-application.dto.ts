import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateJobApplicationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  coverLetter?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  proposedPrice?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  estimatedDuration?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  proposedStartDate?: Date;
} 