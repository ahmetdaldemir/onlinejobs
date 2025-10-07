import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApplicationTag } from '../entities/job-application.entity';

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

  @ApiProperty({ 
    required: false, 
    enum: ApplicationTag,
    description: 'Başvuru zamanlaması: urgent (Acil), immediate (Hemen), scheduled (İleri zamanlı)'
  })
  @IsOptional()
  @IsEnum(ApplicationTag)
  tag?: ApplicationTag;
} 