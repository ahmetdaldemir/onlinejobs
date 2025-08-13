import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DocumentType } from '../entities/user-verification.entity';

export class UploadVerificationDocumentDto {
  @ApiProperty({ 
    enum: DocumentType, 
    description: 'Yüklenecek belge türü',
    example: DocumentType.MASTERY_CERTIFICATE
  })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({ 
    required: false, 
    description: 'Belge için açıklama',
    example: '2023 yılı ustalık belgesi'
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateVerificationStatusDto {
  @ApiProperty({ 
    enum: ['pending', 'approved', 'rejected'], 
    description: 'Doğrulama durumu'
  })
  @IsEnum(['pending', 'approved', 'rejected'])
  status: 'pending' | 'approved' | 'rejected';

  @ApiProperty({ 
    required: false, 
    description: 'Admin notları veya red sebebi'
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Red sebebi (status rejected ise)'
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
