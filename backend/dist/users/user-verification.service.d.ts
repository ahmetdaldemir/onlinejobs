import { Repository } from 'typeorm';
import { UserVerification, DocumentType } from './entities/user-verification.entity';
import { User } from './entities/user.entity';
import { UpdateVerificationStatusDto } from './dto/upload-verification-document.dto';
export declare class UserVerificationService {
    private verificationRepository;
    private userRepository;
    constructor(verificationRepository: Repository<UserVerification>, userRepository: Repository<User>);
    getUserVerifications(userId: string): Promise<UserVerification[]>;
    uploadDocument(userId: string, documentType: DocumentType, file: any, description?: string): Promise<UserVerification>;
    updateVerificationStatus(verificationId: string, adminId: string, updateDto: UpdateVerificationStatusDto): Promise<UserVerification>;
    checkAndUpdateUserVerification(userId: string): Promise<void>;
    deleteDocument(verificationId: string, userId: string): Promise<void>;
    getPendingVerifications(): Promise<UserVerification[]>;
    getVerificationsByUserId(userId: string): Promise<UserVerification[]>;
    private isValidFileType;
    getUserVerificationStatus(userId: string): Promise<{
        isVerified: boolean;
        totalDocuments: number;
        approvedDocuments: number;
        pendingDocuments: number;
        rejectedDocuments: number;
        documents: UserVerification[];
    }>;
    getRequiredDocumentTypes(): {
        type: DocumentType;
        name: string;
        description: string;
    }[];
}
