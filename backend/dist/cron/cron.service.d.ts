import { JobsService } from '../jobs/jobs.service';
import { AdminService } from '../admin/admin.service';
export declare class CronService {
    private readonly jobsService;
    private readonly adminService;
    private readonly logger;
    constructor(jobsService: JobsService, adminService: AdminService);
    updateFeaturedScores(): Promise<void>;
    checkHighScoreJobs(): Promise<void>;
    closeExpiredJobs(): Promise<void>;
}
