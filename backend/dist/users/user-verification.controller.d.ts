import { UserVerificationService } from './user-verification.service';
import { UploadVerificationDocumentDto, UpdateVerificationStatusDto } from './dto/upload-verification-document.dto';
import { DocumentType } from './entities/user-verification.entity';
import { UploadService } from '../upload/upload.service';
export declare class UserVerificationController {
    private readonly verificationService;
    private readonly uploadService;
    constructor(verificationService: UserVerificationService, uploadService: UploadService);
    getMyDocuments(req: any): Promise<import("./entities/user-verification.entity").UserVerification[]>;
    getMyVerificationStatus(req: any): Promise<{
        isVerified: boolean;
        totalDocuments: number;
        approvedDocuments: number;
        pendingDocuments: number;
        rejectedDocuments: number;
        documents: import("./entities/user-verification.entity").UserVerification[];
    }>;
    getRequiredDocuments(): Promise<{
        type: DocumentType;
        name: string;
        description: string;
    }[]>;
    uploadDocument(req: any, uploadDto: UploadVerificationDocumentDto, file: Express.Multer.File): Promise<import("./entities/user-verification.entity").UserVerification>;
    deleteDocument(id: string, req: any): Promise<{
        message: string;
    }>;
    getPendingVerifications(): Promise<import("./entities/user-verification.entity").UserVerification[]>;
    getUserVerifications(userId: string): Promise<import("./entities/user-verification.entity").UserVerification[]>;
    updateVerificationStatus(id: string, updateDto: UpdateVerificationStatusDto, req: any): Promise<import("./entities/user-verification.entity").UserVerification>;
    getVerificationStatistics(): Promise<{
        totalPending: number;
        totalApproved: number;
        totalRejected: number;
        recentSubmissions: any[];
    }>;
}
