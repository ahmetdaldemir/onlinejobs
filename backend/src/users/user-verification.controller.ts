import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import { UserVerificationService } from './user-verification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { UploadVerificationDocumentDto, UpdateVerificationStatusDto } from './dto/upload-verification-document.dto';
import { DocumentType, VerificationStatus } from './entities/user-verification.entity';
import { UploadService } from '../upload/upload.service';

@ApiTags('User Verification')
@Controller('verification')
export class UserVerificationController {
  constructor(
    private readonly verificationService: UserVerificationService,
    private readonly uploadService: UploadService,
  ) {}

  @Get('my-documents')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcının doğrulama belgelerini getir' })
  @ApiResponse({ status: 200, description: 'Doğrulama belgeleri listelendi' })
  async getMyDocuments(@Request() req) {
    return this.verificationService.getUserVerifications(req.user.sub);
  }

  @Get('my-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcının doğrulama durumunu getir' })
  @ApiResponse({ status: 200, description: 'Doğrulama durumu' })
  async getMyVerificationStatus(@Request() req) {
    return this.verificationService.getUserVerificationStatus(req.user.sub);
  }

  @Get('required-documents')
  @ApiOperation({ summary: 'Gerekli belge türlerini getir' })
  @ApiResponse({ status: 200, description: 'Gerekli belge türleri' })
  async getRequiredDocuments() {
    return this.verificationService.getRequiredDocumentTypes();
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Doğrulama belgesi yükle (Sadece worker\'lar)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        documentType: {
          type: 'string',
          enum: Object.values(DocumentType),
          description: 'Belge türü',
        },
        description: {
          type: 'string',
          description: 'Belge açıklaması (opsiyonel)',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Belge dosyası (PDF, JPG, PNG, max 5MB)',
        },
      },
      required: ['documentType', 'file'],
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/verifications');
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `verification-${uniqueSuffix}${extension}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
      ];
      
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Sadece PDF, JPG, PNG dosyaları yüklenebilir!'), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  }))
  async uploadDocument(
    @Request() req,
    @Body() uploadDto: UploadVerificationDocumentDto,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('Dosya yüklenmedi');
    }

    return this.verificationService.uploadDocument(
      req.user.sub,
      uploadDto.documentType,
      file,
      uploadDto.description,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Doğrulama belgesini sil (Sadece bekleyen belgeler)' })
  @ApiResponse({ status: 200, description: 'Belge silindi' })
  async deleteDocument(@Param('id') id: string, @Request() req) {
    await this.verificationService.deleteDocument(id, req.user.sub);
    return { message: 'Belge başarıyla silindi' };
  }

  // Admin endpoints
  @Get('admin/pending')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bekleyen doğrulama belgelerini listele (Admin)' })
  @ApiResponse({ status: 200, description: 'Bekleyen belgeler listelendi' })
  async getPendingVerifications() {
    return this.verificationService.getPendingVerifications();
  }

  @Get('admin/user/:userId')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcının tüm doğrulama belgelerini getir (Admin)' })
  @ApiResponse({ status: 200, description: 'Kullanıcının belgeleri' })
  async getUserVerifications(@Param('userId') userId: string) {
    return this.verificationService.getVerificationsByUserId(userId);
  }

  @Put('admin/:id/status')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Doğrulama belgesi durumunu güncelle (Admin)' })
  @ApiResponse({ status: 200, description: 'Durum güncellendi' })
  async updateVerificationStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateVerificationStatusDto,
    @Request() req,
  ) {
    return this.verificationService.updateVerificationStatus(id, req.user.sub, updateDto);
  }

  @Get('admin/statistics')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Doğrulama istatistiklerini getir (Admin)' })
  @ApiResponse({ status: 200, description: 'İstatistikler' })
  async getVerificationStatistics() {
    // Bu endpoint'i daha sonra implement edebiliriz
    return {
      totalPending: 0,
      totalApproved: 0,
      totalRejected: 0,
      recentSubmissions: [],
    };
  }
}
