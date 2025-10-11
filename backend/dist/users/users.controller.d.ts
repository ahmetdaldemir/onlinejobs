import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findTestUsers(): Promise<import("./entities/user.entity").User[]>;
    findRealUsers(): Promise<import("./entities/user.entity").User[]>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findActiveUsers(): Promise<import("./entities/user.entity").User[]>;
    findOnlineUsers(): Promise<import("./entities/user.entity").User[]>;
    findOnlineWorkers(latitude?: number, longitude?: number, radius?: number, categoryId?: string): Promise<any[]>;
    findOnlineEmployers(latitude?: number, longitude?: number, radius?: number, categoryId?: string): Promise<any[]>;
    findUsersByType(userType: string): Promise<import("./entities/user.entity").User[]>;
    updateProfileImage(req: any, file: Express.Multer.File): Promise<import("./entities/user.entity").User>;
    getProfileImage(userId: string): Promise<{
        profileImage: string;
    }>;
    getOnlineUsers(): Promise<import("./entities/user.entity").User[]>;
    getOnlineWorkers(latitude?: number, longitude?: number, radius?: number, categoryId?: string): Promise<any[]>;
    getOnlineEmployers(latitude?: number, longitude?: number, radius?: number, categoryId?: string): Promise<any[]>;
    getUserStatus(userId: string): Promise<{
        userId: string;
        isOnline: boolean;
        lastSeen: Date;
        firstName: string;
        lastName: string;
    }>;
    addPortfolioImage(req: any, file: Express.Multer.File): Promise<{
        message: string;
        portfolioImages: string[];
        totalImages: number;
    }>;
    getUserPortfolioImages(userId: string): Promise<{
        userId: string;
        portfolioImages: string[];
        totalImages: number;
    }>;
    deletePortfolioImage(req: any, imageUrl: string): Promise<{
        message: string;
        portfolioImages: string[];
        totalImages: number;
    }>;
    deleteAllPortfolioImages(req: any): Promise<{
        message: string;
        portfolioImages: any[];
        totalImages: number;
    }>;
    findById(id: string): Promise<import("./entities/user.entity").User>;
}
