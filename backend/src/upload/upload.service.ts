import { Injectable } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  public uploadPath = 'uploads';

  constructor() {
    // Uploads klasörünü oluştur (eğer yoksa)
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  getMulterConfig(): MulterOptions {
    return {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, this.uploadPath);
        },
        filename: (req, file, cb) => {
          // Benzersiz dosya adı oluştur
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const extension = path.extname(file.originalname);
          cb(null, `profile-${uniqueSuffix}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Sadece resim dosyalarını kabul et
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    };
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadPath, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  getFileUrl(filename: string): string {
    const url = `/uploads/${filename}`;
    console.log('🔗 Dosya URL\'i oluşturuldu:', url);
    return url;
  }
} 