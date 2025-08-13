import { DocumentType } from '../entities/user-verification.entity';
export declare class UploadVerificationDocumentDto {
    documentType: DocumentType;
    description?: string;
}
export declare class UpdateVerificationStatusDto {
    status: 'pending' | 'approved' | 'rejected';
    adminNotes?: string;
    rejectionReason?: string;
}
