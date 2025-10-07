export declare enum ApplicationStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    WITHDRAWN = "withdrawn"
}
export declare enum ApplicationTag {
    URGENT = "urgent",
    IMMEDIATE = "immediate",
    SCHEDULED = "scheduled"
}
export declare class JobApplication {
    id: string;
    status: ApplicationStatus;
    tag: ApplicationTag;
    coverLetter: string;
    proposedPrice: string;
    estimatedDuration: string;
    proposedStartDate: Date;
    createdAt: Date;
    updatedAt: Date;
    job: any;
    jobId: string;
    applicant: any;
    applicantId: string;
}
