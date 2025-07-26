import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { JobApplication, ApplicationStatus } from './entities/job-application.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '../users/entities/user.entity';
export declare class JobsService {
    private jobRepository;
    private applicationRepository;
    private userRepository;
    private notificationsService;
    constructor(jobRepository: Repository<Job>, applicationRepository: Repository<JobApplication>, userRepository: Repository<User>, notificationsService: NotificationsService);
    create(createJobDto: any, employerId: string): Promise<Job>;
    findAll(filters?: any): Promise<Job[]>;
    findById(id: string): Promise<Job>;
    update(id: string, updateJobDto: any, userId: string): Promise<Job>;
    delete(id: string, userId: string): Promise<void>;
    applyForJob(jobId: string, applicantId: string, applicationData: any): Promise<JobApplication>;
    updateApplicationStatus(applicationId: string, status: ApplicationStatus, employerId: string): Promise<JobApplication>;
    getMyApplications(userId: string): Promise<JobApplication[]>;
    getJobApplications(jobId: string, employerId: string): Promise<JobApplication[]>;
}
