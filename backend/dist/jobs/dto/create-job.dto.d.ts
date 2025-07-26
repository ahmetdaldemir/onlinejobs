import { JobType } from '../entities/job.entity';
export declare class CreateJobDto {
    title: string;
    description: string;
    jobType: JobType;
    budget?: number;
    location?: string;
    latitude?: number;
    longitude?: number;
    scheduledDate?: Date;
    scheduledTime?: string;
    isUrgent?: boolean;
    categoryId?: string;
}
