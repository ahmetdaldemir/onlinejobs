import { UsersService } from './users.service';
import { UserStatus } from './entities/user.entity';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
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
    updateUserTypes(req: any, userType: string): Promise<import("./entities/user.entity").User>;
    getUserInfo(req: any): Promise<import("./entities/user-info.entity").UserInfo[]>;
    getUserInfos(req: any): Promise<import("./entities/user-info.entity").UserInfo[]>;
    findById(id: string): Promise<import("./entities/user.entity").User>;
    updateStatus(req: any, status: UserStatus): Promise<import("./entities/user.entity").User>;
    updateIsOnline(req: any, isOnline: boolean): Promise<import("./entities/user.entity").User>;
    getUserIsVerified(req: any): Promise<boolean>;
    updateLocation(req: any, locationData: {
        name?: string;
        latitude: number;
        longitude: number;
    }): Promise<import("./entities/user.entity").User>;
    updateUserInfo(req: any, updateUserInfoDto: UpdateUserInfoDto): Promise<import("./entities/user.entity").User>;
    createUserInfo(req: any, createUserInfoDto: any): Promise<import("./entities/user.entity").User>;
    updateProfile(req: any, updateData: any, file?: any): Promise<import("./entities/user.entity").User>;
    updateProfileImage(req: any, body: {
        imageUrl: string;
    }): Promise<import("./entities/user.entity").User>;
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
}
