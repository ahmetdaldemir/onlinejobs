import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
export declare class UploadService {
    uploadPath: string;
    verificationPath: string;
    constructor();
    getMulterConfig(): MulterOptions;
    getVerificationMulterConfig(): MulterOptions;
    deleteFile(filename: string): Promise<void>;
    deleteVerificationFile(filename: string): Promise<void>;
    getFileUrl(filename: string): string;
    getVerificationFileUrl(filename: string): string;
}
