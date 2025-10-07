import { ApplicationTag } from '../entities/job-application.entity';
export declare class CreateJobApplicationDto {
    coverLetter?: string;
    proposedPrice?: string;
    estimatedDuration?: string;
    proposedStartDate?: Date;
    tag?: ApplicationTag;
}
