import { JobsService } from './jobs.service';
import { ApplicationStatus } from './entities/job-application.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UsersService } from '../users/users.service';
export declare class JobsController {
    private readonly jobsService;
    private readonly usersService;
    constructor(jobsService: JobsService, usersService: UsersService);
    create(createJobDto: CreateJobDto, req: any): Promise<import("./entities/job.entity").Job>;
    findAll(filters: any): Promise<import("./entities/job.entity").Job[]>;
    getMyApplications(req: any): Promise<import("./entities/job-application.entity").JobApplication[]>;
    getMyJobs(req: any): Promise<import("./entities/job.entity").Job[]>;
    getMyJobsApplications(req: any): Promise<import("./entities/job-application.entity").JobApplication[]>;
    getFeaturedJobs(limit?: number): Promise<import("./entities/job.entity").Job[]>;
    getHighScoreJobs(limit?: number): Promise<import("./entities/job.entity").Job[]>;
    setFeatured(jobId: string, data: {
        isFeatured: boolean;
        reason?: string;
    }, req: any): Promise<import("./entities/job.entity").Job>;
    incrementViewCount(jobId: string): Promise<void>;
    findById(id: string): Promise<import("./entities/job.entity").Job>;
    update(id: string, updateJobDto: any, req: any): Promise<import("./entities/job.entity").Job>;
    delete(id: string, req: any): Promise<void>;
    applyForJob(jobId: string, applicationData: CreateJobApplicationDto, req: any): Promise<import("./entities/job-application.entity").JobApplication>;
    updateApplicationStatus(applicationId: string, status: ApplicationStatus, req: any): Promise<import("./entities/job-application.entity").JobApplication>;
    getJobApplications(jobId: string, req: any): Promise<import("./entities/job-application.entity").JobApplication[]>;
}
