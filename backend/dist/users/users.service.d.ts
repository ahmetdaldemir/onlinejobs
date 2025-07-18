import { Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findOnlineJobSeekers(latitude?: number, longitude?: number, radius?: number, categoryId?: string): Promise<User[]>;
    updateStatus(userId: string, status: UserStatus): Promise<User>;
    updateLocation(userId: string, latitude: number, longitude: number): Promise<User>;
    updateProfile(userId: string, updateData: Partial<User>): Promise<User>;
}
