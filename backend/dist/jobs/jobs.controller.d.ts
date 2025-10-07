import { JobsService } from './jobs.service';
import { ApplicationStatus } from './entities/job-application.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UsersService } from '../users/users.service';
import { UploadService } from '../upload/upload.service';
export declare class JobsController {
    private readonly jobsService;
    private readonly usersService;
    private readonly uploadService;
    constructor(jobsService: JobsService, usersService: UsersService, uploadService: UploadService);
    create(createJobDto: CreateJobDto, images: Array<Express.Multer.File>, req: any): Promise<import("./entities/job.entity").Job>;
    findAll(filters: any, req: any): Promise<import("./entities/job.entity").Job[]>;
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
    uploadImages(id: string, images: Array<Express.Multer.File>, req: any): Promise<import("./entities/job.entity").Job>;
    deleteImage(id: string, filename: string, req: any): Promise<import("./entities/job.entity").Job>;
    update(id: string, updateJobDto: any, req: any): Promise<import("./entities/job.entity").Job>;
    delete(id: string, req: any): Promise<void>;
    applyForJob(jobId: string, applicationData: CreateJobApplicationDto, req: any): Promise<import("./entities/job-application.entity").JobApplication>;
    updateApplicationStatus(applicationId: string, status: ApplicationStatus, req: any): Promise<import("./entities/job-application.entity").JobApplication>;
    getJobApplications(jobId: string, req: any): Promise<import("./entities/job-application.entity").JobApplication[]>;
    debugLocation(): Promise<{
        totalJobs: number;
        jobsWithLocation: number;
        jobsWithLocationDetails: {
            id: string;
            title: string;
            userInfoId: string;
            latitude: any;
            longitude: any;
            address: any;
        }[];
    }>;
}
