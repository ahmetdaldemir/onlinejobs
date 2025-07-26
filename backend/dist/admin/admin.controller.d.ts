import { AdminService } from './admin.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { CreateCategoryDto } from '../categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../categories/dto/update-category.dto';
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
                inProgress: number;
                completed: number;
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
        inProgress: number;
        completed: number;
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
    createUser(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: import("../users/entities/user.entity").User;
    }>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<{
        message: string;
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
    getAllCategories(): Promise<import("../categories/entities/category.entity").Category[]>;
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
}
