import { Repository } from 'typeorm';
import { User, UserStatus } from '../users/entities/user.entity';
import { UserInfo } from '../users/entities/user-info.entity';
import { Job, JobStatus } from '../jobs/entities/job.entity';
import { Message } from '../messages/entities/message.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { CreateCategoryDto } from '../categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../categories/dto/update-category.dto';
import { JobApplication } from '../jobs/entities/job-application.entity';
import { UploadService } from '../upload/upload.service';
export declare class AdminService {
    private userRepository;
    private userInfoRepository;
    private jobRepository;
    private messageRepository;
    private categoryRepository;
    private jobApplicationRepository;
    private uploadService;
    constructor(userRepository: Repository<User>, userInfoRepository: Repository<UserInfo>, jobRepository: Repository<Job>, messageRepository: Repository<Message>, categoryRepository: Repository<Category>, jobApplicationRepository: Repository<JobApplication>, uploadService: UploadService);
    getDashboardStats(): Promise<{
        users: {
            total: number;
            online: number;
            offline: number;
            types: {
                workers: number;
                employers: number;
            };
        };
        jobs: {
            total: number;
            active: number;
            completed: number;
            statuses: {
                open: number;
                cancelled: number;
            };
        };
        messages: {
            total: number;
        };
        categories: {
            total: number;
        };
        summary: {
            totalUsers: number;
            onlineUsers: number;
            totalJobs: number;
            activeJobs: number;
            totalMessages: number;
            totalCategories: number;
        };
    }>;
    getUserStats(): Promise<{
        total: number;
        online: number;
        offline: number;
        workers: number;
        employers: number;
        onlinePercentage: string | number;
    }>;
    getJobStats(): Promise<{
        total: number;
        open: number;
        cancelled: number;
        featured: number;
        completionRate: string | number;
    }>;
    getMessageStats(): Promise<{
        total: number;
        read: number;
        unread: number;
        readPercentage: string | number;
    }>;
    getCategoryStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        parent: number;
        child: number;
    }>;
    getAllUsers(): Promise<User[]>;
    getUserById(id: string): Promise<User>;
    createUser(createUserDto: CreateUserDto, file?: any): Promise<{
        message: string;
        user: User;
    }>;
    updateUser(id: string, updateUserDto: UpdateUserDto, file?: any): Promise<{
        message: string;
        profileImage: string;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    toggleUserStatus(id: string, status: string): Promise<{
        message: string;
        user: {
            id: string;
            status: UserStatus;
        };
    }>;
    toggleUserOnline(id: string, isOnline: boolean): Promise<{
        message: string;
        user: {
            id: string;
            isOnline: boolean;
        };
    }>;
    assignCategoriesToUser(id: string, categoryIds: string[]): Promise<{
        message: string;
        user: {
            id: string;
            categoryIds: string[];
            categories: {
                id: string;
                name: string;
            }[];
        };
    }>;
    removeCategoriesFromUser(id: string, categoryIds: string[]): Promise<{
        message: string;
        user: {
            id: string;
            categoryIds: string[];
            categories: {
                id: any;
                name: any;
            }[];
        };
    }>;
    getUserCategories(id: string): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            categoryIds: string[];
            categories: {
                id: any;
                name: any;
                description: any;
                icon: any;
            }[];
        };
    }>;
    getAllCategories(): Promise<Category[]>;
    getActiveCategories(): Promise<Category[]>;
    getCategoryById(id: string): Promise<Category>;
    createCategory(createCategoryDto: CreateCategoryDto): Promise<{
        message: string;
        category: Category;
    }>;
    updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        message: string;
    }>;
    deleteCategory(id: string): Promise<{
        message: string;
    }>;
    private getUserTypeStats;
    private getJobStatusStats;
    updateUserProfileImage(userId: string, imageUrl: string): Promise<{
        message: string;
        profileImage: string;
    }>;
    getFeaturedJobs(): Promise<Job[]>;
    getHighScoreJobs(limit?: number): Promise<Job[]>;
    setJobFeatured(jobId: string, isFeatured: boolean, reason?: string): Promise<{
        message: string;
        job: {
            id: string;
            title: string;
            isFeatured: boolean;
            featuredAt: Date;
            featuredReason: string;
        };
    }>;
    updateAllJobScores(): Promise<{
        message: string;
        updatedCount: number;
    }>;
    toggleJobStatus(jobId: string, status: JobStatus): Promise<{
        message: string;
        job: {
            id: string;
            title: string;
            status: JobStatus;
        };
    }>;
    closeExpiredJobs(): Promise<{
        message: string;
        closedCount: number;
    }>;
    getAllJobs(): Promise<Job[]>;
}
