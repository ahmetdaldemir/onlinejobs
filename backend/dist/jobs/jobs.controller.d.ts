import { JobsService } from './jobs.service';
import { ApplicationStatus } from './entities/job-application.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UsersService } from '../users/users.service';
export declare class JobsController {
    private readonly jobsService;
    private readonly usersService;
    constructor(jobsService: JobsService, usersService: UsersService);
    create(createJobDto: CreateJobDto, req: any): Promise<import("./entities/job.entity").Job>;
    findAll(filters: any): Promise<import("./entities/job.entity").Job[]>;
    findById(id: string): Promise<import("./entities/job.entity").Job>;
    update(id: string, updateJobDto: any, req: any): Promise<import("./entities/job.entity").Job>;
    delete(id: string, req: any): Promise<void>;
    applyForJob(jobId: string, applicationData: any, req: any): Promise<import("./entities/job-application.entity").JobApplication>;
    updateApplicationStatus(applicationId: string, status: ApplicationStatus, req: any): Promise<import("./entities/job-application.entity").JobApplication>;
    getMyApplications(req: any): Promise<import("./entities/job-application.entity").JobApplication[]>;
    getJobApplications(jobId: string, req: any): Promise<import("./entities/job-application.entity").JobApplication[]>;
}
