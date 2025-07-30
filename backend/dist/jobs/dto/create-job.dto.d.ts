export declare class CreateJobDto {
    title: string;
    description: string;
    budget?: string;
    scheduledDate?: Date;
    scheduledTime?: string;
    isUrgent?: boolean;
    categoryId?: string;
    userInfoId?: string;
}
