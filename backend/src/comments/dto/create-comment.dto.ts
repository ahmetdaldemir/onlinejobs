import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, IsUUID, Min, Max, ValidateIf } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'Yorum yapılacak kullanıcının ID\'si' })
  @IsUUID('4', { message: 'commentedUserId geçerli bir UUID formatında olmalıdır' })
  commentedUserId: string;

  @ApiProperty({ description: 'Yorum metni' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Rating (1-5 arası)', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1, { message: 'Rating en az 1 olmalıdır' })
  @Max(5, { message: 'Rating en fazla 5 olmalıdır' })
  rating: number;

  @ApiProperty({ required: false, description: 'İlgili iş ID\'si (opsiyonel)' })
  @IsOptional()
  @ValidateIf((o) => o.jobId !== '' && o.jobId !== null && o.jobId !== undefined)
  @IsUUID('4', { message: 'jobId geçerli bir UUID formatında olmalıdır' })
  jobId?: string;

  @ApiProperty({ required: false, description: 'Yorum yapan kişinin adının gösterilip gösterilmeyeceği', default: true })
  @IsOptional()
  @IsBoolean()
  showName?: boolean;
} 