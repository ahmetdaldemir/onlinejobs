import { Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findTestUsers(): Promise<User[]>;
    findRealUsers(): Promise<User[]>;
    findActiveUsers(): Promise<User[]>;
    findOnlineUsers(): Promise<User[]>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findOnlineJobSeekers(latitude?: number, longitude?: number, radius?: number, categoryId?: string): Promise<User[]>;
    findOnlineEmployers(latitude?: number, longitude?: number, radius?: number, categoryId?: string): Promise<User[]>;
    findUsersByType(userType: string): Promise<User[]>;
    updateUserTypes(userId: string, userTypes: string[]): Promise<User>;
    updateStatus(userId: string, status: UserStatus): Promise<User>;
    updateLocation(userId: string, latitude: number, longitude: number): Promise<User>;
    updateProfile(userId: string, updateData: any): Promise<User>;
    setUserOnline(userId: string): Promise<User>;
    setUserOffline(userId: string): Promise<User>;
    setTestUsersOnline(): Promise<void>;
    updateIsOnline(userId: string, isOnline: boolean): Promise<User>;
}
