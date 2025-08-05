import { AdminService } from './admin.service';
import { CreateCategoryDto } from '../categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../categories/dto/update-category.dto';
import { JobStatus } from '../jobs/entities/job.entity';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
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
    getAllUsers(): Promise<import("../users/entities/user.entity").User[]>;
    getUserById(id: string): Promise<import("../users/entities/user.entity").User>;
    createUser(createUserDto: any, file?: any): Promise<{
        message: string;
        user: import("../users/entities/user.entity").User;
    }>;
    updateUser(id: string, updateUserDto: any, file?: any): Promise<{
        message: string;
        profileImage: string;
    }>;
    toggleUserStatus(id: string, body: {
        status: string;
    }): Promise<{
        message: string;
        user: {
            id: string;
            status: import("../users/entities/user.entity").UserStatus;
        };
    }>;
    toggleUserOnline(id: string, body: {
        isOnline: boolean;
    }): Promise<{
        message: string;
        user: {
            id: string;
            isOnline: boolean;
        };
    }>;
    deleteUser(id: string): Promise<{
        message: string;
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
    assignCategoriesToUser(id: string, body: {
        categoryIds: string[];
    }): Promise<{
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
    removeCategoriesFromUser(id: string, body: {
        categoryIds: string[];
    }): Promise<{
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
    getAllCategories(): Promise<import("../categories/entities/category.entity").Category[]>;
    getActiveCategories(): Promise<import("../categories/entities/category.entity").Category[]>;
    getCategoryById(id: string): Promise<import("../categories/entities/category.entity").Category>;
    createCategory(createCategoryDto: CreateCategoryDto): Promise<{
        message: string;
        category: import("../categories/entities/category.entity").Category;
    }>;
    updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        message: string;
    }>;
    deleteCategory(id: string): Promise<{
        message: string;
    }>;
    updateUserProfileImage(id: string, body: {
        imageUrl: string;
    }): Promise<{
        message: string;
        profileImage: string;
    }>;
    getFeaturedJobs(): Promise<import("../jobs/entities/job.entity").Job[]>;
    getHighScoreJobs(): Promise<import("../jobs/entities/job.entity").Job[]>;
    setJobFeatured(jobId: string, body: {
        isFeatured: boolean;
        reason?: string;
    }): Promise<{
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
    toggleJobStatus(jobId: string, body: {
        status: string;
    }): Promise<{
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
    getAllJobs(): Promise<import("../jobs/entities/job.entity").Job[]>;
}
