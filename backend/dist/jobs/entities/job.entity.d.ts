export declare enum JobStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum JobType {
    URGENT = "urgent",
    NORMAL = "normal",
    SCHEDULED = "scheduled"
}
export declare class Job {
    id: string;
    title: string;
    description: string;
    status: JobStatus;
    jobType: JobType;
    budget: number;
    location: string;
    latitude: number;
    longitude: number;
    scheduledDate: Date;
    scheduledTime: string;
    isUrgent: boolean;
    viewCount: number;
    applicationCount: number;
    createdAt: Date;
    updatedAt: Date;
    employer: any;
    employerId: string;
    category: any;
    categoryId: string;
    applications: any[];
}
