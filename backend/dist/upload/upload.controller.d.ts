import { Response } from 'express';
import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadProfileImage(file: Express.Multer.File, req: any): Promise<{
        message: string;
        filename: string;
        originalName: string;
        size: number;
        url: string;
    }>;
    uploadAdminProfileImage(file: Express.Multer.File, userId: string): Promise<{
        message: string;
        userId: string;
        filename: string;
        originalName: string;
        size: number;
        url: string;
    }>;
    serveFile(filename: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
}
