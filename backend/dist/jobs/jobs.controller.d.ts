import { JobsService } from './jobs.service';
import { ApplicationStatus } from './entities/job-application.entity';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    create(createJobDto: any, req: any): Promise<import("./entities/job.entity").Job>;
    findAll(filters: any): Promise<import("./entities/job.entity").Job[]>;
    findById(id: string): Promise<import("./entities/job.entity").Job>;
    update(id: string, updateJobDto: any, req: any): Promise<import("./entities/job.entity").Job>;
    delete(id: string, req: any): Promise<void>;
    applyForJob(jobId: string, applicationData: any, req: any): Promise<import("./entities/job-application.entity").JobApplication>;
    updateApplicationStatus(applicationId: string, status: ApplicationStatus, req: any): Promise<import("./entities/job-application.entity").JobApplication>;
    getMyApplications(req: any): Promise<import("./entities/job-application.entity").JobApplication[]>;
    getJobApplications(jobId: string, req: any): Promise<import("./entities/job-application.entity").JobApplication[]>;
}
