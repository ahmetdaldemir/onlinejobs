import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, IsUUID } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ description: 'Kategori adı', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Kategori açıklaması', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Kategori ikonu', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: 'Aktif durumu', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Sıralama indeksi', required: false })
  @IsOptional()
  @IsNumber()
  orderIndex?: number;

  @ApiProperty({ description: 'Üst kategori ID', required: false })
  @IsOptional()
  @IsUUID()
  parentId?: string;
} 