import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ required: false, description: 'Yorum metni' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, description: 'Rating (1-5 arası)', minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Rating en az 1 olmalıdır' })
  @Max(5, { message: 'Rating en fazla 5 olmalıdır' })
  rating?: number;

  @ApiProperty({ required: false, description: 'Yorum yapan kişinin adının gösterilip gösterilmeyeceği' })
  @IsOptional()
  @IsBoolean()
  showName?: boolean;
} 