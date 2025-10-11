export declare enum JobStatus {
    OPEN = "open",
    CANCELLED = "cancelled"
}
export declare enum JobPriority {
    URGENT = "urgent",
    IMMEDIATE = "immediate",
    SCHEDULED = "scheduled",
    NORMAL = "normal"
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
    priority: JobPriority;
    jobImages: string[];
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
