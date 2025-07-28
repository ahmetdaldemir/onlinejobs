export declare class CreateJobDto {
    title: string;
    description: string;
    budget?: number;
    location?: string;
    latitude?: number;
    longitude?: number;
    scheduledDate?: Date;
    scheduledTime?: string;
    isUrgent?: boolean;
    categoryId?: string;
    userInfoId?: string;
}
