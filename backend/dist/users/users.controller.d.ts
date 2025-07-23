import { UsersService } from './users.service';
import { UserStatus } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findTestUsers(): Promise<import("./entities/user.entity").User[]>;
    findRealUsers(): Promise<import("./entities/user.entity").User[]>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findActiveUsers(): Promise<import("./entities/user.entity").User[]>;
    findOnlineUsers(): Promise<import("./entities/user.entity").User[]>;
    findOnlineJobSeekers(latitude?: number, longitude?: number, radius?: number, categoryId?: string): Promise<import("./entities/user.entity").User[]>;
    findOnlineEmployers(latitude?: number, longitude?: number, radius?: number, categoryId?: string): Promise<import("./entities/user.entity").User[]>;
    findUsersByType(userType: string): Promise<import("./entities/user.entity").User[]>;
    updateUserTypes(req: any, userType: string): Promise<import("./entities/user.entity").User>;
    findById(id: string): Promise<import("./entities/user.entity").User>;
    updateStatus(req: any, status: UserStatus): Promise<import("./entities/user.entity").User>;
    updateIsOnline(req: any, isOnline: boolean): Promise<import("./entities/user.entity").User>;
    updateLocation(req: any, latitude: number, longitude: number): Promise<import("./entities/user.entity").User>;
    updateProfile(req: any, updateData: any): Promise<import("./entities/user.entity").User>;
}
