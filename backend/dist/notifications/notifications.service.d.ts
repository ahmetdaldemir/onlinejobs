import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { UserInfo } from '../users/entities/user-info.entity';
export declare class NotificationsService {
    private notificationRepository;
    private userRepository;
    private userInfoRepository;
    constructor(notificationRepository: Repository<Notification>, userRepository: Repository<User>, userInfoRepository: Repository<UserInfo>);
    createJobNotification(job: Job, employer: User): Promise<{
        message: string;
        notifiedWorkers: number;
        totalWorkers: number;
        jobLocation: {
            address: any;
            latitude: any;
            longitude: any;
        };
        details: {
            jobId: string;
            jobTitle: string;
            userInfoId: string;
            categoryId: string;
            searchRadius: string;
        };
    } | {
        message: string;
        notifiedWorkers: number;
        totalWorkers: number;
        error: string;
    }>;
    getUserNotifications(userId: string): Promise<Notification[]>;
    markAsRead(notificationId: string): Promise<Notification>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    getUnreadCount(userId: string): Promise<number>;
    private calculateDistance;
    private deg2rad;
}
