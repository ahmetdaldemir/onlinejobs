import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException,
  UseGuards,
  Request,
  Get,
  Param,
  Res
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('profile-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil fotoğrafı yükle' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Profil fotoğrafı (max 5MB)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Dosya yüklenmedi');
    }

    // Dosya URL'ini oluştur
    const fileUrl = this.uploadService.getFileUrl(file.filename);

    return {
      message: 'Profil fotoğrafı başarıyla yüklendi',
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: fileUrl,
    };
  }

  @Post('admin/profile-image/:userId')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: Kullanıcı profil fotoğrafı yükle' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Profil fotoğrafı (max 5MB)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAdminProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('Dosya yüklenmedi');
    }

    // Dosya URL'ini oluştur
    const fileUrl = this.uploadService.getFileUrl(file.filename);

    return {
      message: 'Profil fotoğrafı başarıyla yüklendi',
      userId: userId,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: fileUrl,
    };
  }

  @Get('uploads/:filename')
  @ApiOperation({ summary: 'Yüklenen dosyayı görüntüle' })
  async serveFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Dosya bulunamadı' });
    }

    return res.sendFile(filePath);
  }
} 