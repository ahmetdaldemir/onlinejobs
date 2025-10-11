import { JobPriority } from '../entities/job.entity';
export declare class CreateJobDto {
    title: string;
    description: string;
    budget?: string;
    jobImages?: string[];
    scheduledDate?: Date;
    scheduledTime?: string;
    priority?: JobPriority;
    categoryId?: string;
    userInfoId?: string;
}
