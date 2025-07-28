import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
export declare class UploadService {
    uploadPath: string;
    constructor();
    getMulterConfig(): MulterOptions;
    deleteFile(filename: string): Promise<void>;
    getFileUrl(filename: string): string;
}
