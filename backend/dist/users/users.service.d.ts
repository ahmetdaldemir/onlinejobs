import { Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { UserInfo } from './entities/user-info.entity';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
export declare class UsersService {
    private userRepository;
    private userInfoRepository;
    constructor(userRepository: Repository<User>, userInfoRepository: Repository<UserInfo>);
    findTestUsers(): Promise<User[]>;
    findRealUsers(): Promise<User[]>;
    findActiveUsers(): Promise<User[]>;
    findOnlineUsers(): Promise<User[]>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findOnlineWorkers(latitude?: number, longitude?: number, radius?: number, categoryId?: string): Promise<any[]>;
    private calculateDistance;
    private toRadians;
    findOnlineEmployers(latitude?: number, longitude?: number, radius?: number, categoryId?: string): Promise<User[]>;
    findUsersByType(userType: string): Promise<User[]>;
    updateUserTypes(userId: string, userType: string): Promise<User>;
    updateStatus(userId: string, status: UserStatus): Promise<User>;
    updateLocation(userId: string, latitude: number, longitude: number, name?: string): Promise<User>;
    getUserInfo(userId: string): Promise<UserInfo | null>;
    updateUserInfo(userId: string, updateUserInfoDto: UpdateUserInfoDto): Promise<User>;
    updateProfile(userId: string, updateData: any): Promise<User>;
    setUserOnline(userId: string): Promise<User>;
    setUserOffline(userId: string): Promise<User>;
    setTestUsersOnline(): Promise<void>;
    updateIsOnline(userId: string, isOnline: boolean): Promise<User>;
}
