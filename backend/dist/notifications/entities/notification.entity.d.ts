export declare enum NotificationType {
    JOB_CREATED = "job_created",
    JOB_UPDATED = "job_updated",
    JOB_CANCELLED = "job_cancelled",
    APPLICATION_RECEIVED = "application_received",
    APPLICATION_ACCEPTED = "application_accepted",
    APPLICATION_REJECTED = "application_rejected"
}
export declare enum NotificationStatus {
    UNREAD = "unread",
    READ = "read"
}
export declare class Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    status: NotificationStatus;
    data: any;
    jobId: string;
    employerId: string;
    workerId: string;
    createdAt: Date;
    updatedAt: Date;
    user: any;
    userId: string;
}
