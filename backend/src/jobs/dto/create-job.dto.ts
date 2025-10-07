import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsDateString, IsUUID } from 'class-validator';
 
export class CreateJobDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  budget?: string;


  @ApiProperty({ required: false, type: [String], description: 'İş ilanı resimleri (URL\'ler)' })
  @IsOptional()
  @IsString({ each: true })
  jobImages?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  scheduledDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  scheduledTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4', { message: 'categoryId geçerli bir UUID formatında olmalıdır' })
  categoryId?: string;

  @ApiProperty({ required: false, description: 'İş ilanının konum bilgilerini içeren UserInfo ID' })
  @IsOptional()
  @IsUUID('4', { message: 'userInfoId geçerli bir UUID formatında olmalıdır' })
  userInfoId?: string;
} 