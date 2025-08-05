export declare enum JobStatus {
    OPEN = "open",
    CANCELLED = "cancelled"
}
export declare class Job {
    id: string;
    title: string;
    description: string;
    status: JobStatus;
    budget: string;
    userInfo: any;
    userInfoId: string;
    scheduledDate: Date;
    scheduledTime: string;
    isUrgent: boolean;
    viewCount: number;
    applicationCount: number;
    isFeatured: boolean;
    featuredScore: number;
    featuredAt: Date;
    featuredReason: string;
    createdAt: Date;
    updatedAt: Date;
    employer: any;
    employerId: string;
    category: any;
    categoryId: string;
    applications: any[];
    comments: any[];
}
