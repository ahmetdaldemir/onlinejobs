import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
export declare class UploadService {
    uploadPath: string;
    verificationPath: string;
    jobImagesPath: string;
    portfolioImagesPath: string;
    constructor();
    getMulterConfig(): MulterOptions;
    getVerificationMulterConfig(): MulterOptions;
    deleteFile(filename: string): Promise<void>;
    deleteVerificationFile(filename: string): Promise<void>;
    getFileUrl(filename: string): string;
    getVerificationFileUrl(filename: string): string;
    getJobImagesMulterConfig(): MulterOptions;
    deleteJobImage(filename: string): Promise<void>;
    getJobImageUrl(filename: string): string;
    getPortfolioImagesMulterConfig(): MulterOptions;
    deletePortfolioImage(filename: string): Promise<void>;
    getPortfolioImageUrl(filename: string): string;
}
