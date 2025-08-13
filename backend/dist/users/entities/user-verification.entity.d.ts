import { User } from './user.entity';
export declare enum VerificationStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare enum DocumentType {
    MASTERY_CERTIFICATE = "mastery_certificate",
    TAX_CERTIFICATE = "tax_certificate",
    CONTRACT_PDF = "contract_pdf"
}
export declare class UserVerification {
    id: string;
    userId: string;
    documentType: DocumentType;
    documentUrl: string;
    originalFileName: string;
    mimeType: string;
    fileSize: number;
    status: VerificationStatus;
    adminNotes: string;
    rejectionReason: string;
    reviewedAt: Date;
    reviewedBy: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
