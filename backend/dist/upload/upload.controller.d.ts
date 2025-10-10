import { Response } from 'express';
import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadProfileImage(file: any, req: any): Promise<{
        message: string;
        filename: any;
        originalName: any;
        size: any;
        url: string;
    }>;
    uploadAdminProfileImage(file: any, userId: string): Promise<{
        message: string;
        userId: string;
        filename: any;
        originalName: any;
        size: any;
        url: string;
    }>;
    serveFile(filename: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    servePortfolioImage(filename: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    testUpload(): Promise<{
        message: string;
        uploadPath: string;
        timestamp: string;
    }>;
    testUploadFile(file: any): Promise<{
        message: string;
        filename: any;
        originalName: any;
        size: any;
        url: string;
        test: boolean;
    }>;
}
