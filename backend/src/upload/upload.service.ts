import { Injectable } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  public uploadPath = 'uploads';
  public verificationPath = 'uploads/verifications';
  public jobImagesPath = 'uploads/job-images';

  constructor() {
    // Uploads klasörünü oluştur (eğer yoksa)
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
    
    // Verifications klasörünü oluştur (eğer yoksa)
    if (!fs.existsSync(this.verificationPath)) {
      fs.mkdirSync(this.verificationPath, { recursive: true });
    }
    
    // Job images klasörünü oluştur (eğer yoksa)
    if (!fs.existsSync(this.jobImagesPath)) {
      fs.mkdirSync(this.jobImagesPath, { recursive: true });
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

  // Verification dosyaları için özel konfigürasyon
  getVerificationMulterConfig(): MulterOptions {
    return {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, this.verificationPath);
        },
        filename: (req, file, cb) => {
          // Benzersiz dosya adı oluştur
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const extension = path.extname(file.originalname);
          cb(null, `verification-${uniqueSuffix}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // PDF ve resim dosyalarını kabul et
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
    };
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadPath, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  async deleteVerificationFile(filename: string): Promise<void> {
    const filePath = path.join(this.verificationPath, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  getFileUrl(filename: string): string {
    const url = `/uploads/${filename}`;
    console.log('🔗 Dosya URL\'i oluşturuldu:', url);
    return url;
  }

  getVerificationFileUrl(filename: string): string {
    const url = `/uploads/verifications/${filename}`;
    console.log('🔗 Verification dosya URL\'i oluşturuldu:', url);
    return url;
  }

  // Job images için özel konfigürasyon
  getJobImagesMulterConfig(): MulterOptions {
    return {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, this.jobImagesPath);
        },
        filename: (req, file, cb) => {
          // Benzersiz dosya adı oluştur
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const extension = path.extname(file.originalname);
          cb(null, `job-${uniqueSuffix}${extension}`);
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

  async deleteJobImage(filename: string): Promise<void> {
    const filePath = path.join(this.jobImagesPath, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  getJobImageUrl(filename: string): string {
    const url = `/uploads/job-images/${filename}`;
    console.log('🔗 Job image URL\'i oluşturuldu:', url);
    return url;
  }
} 