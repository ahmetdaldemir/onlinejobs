import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { UserInfo } from '../users/entities/user-info.entity';
export declare class DataSeedService {
    private userRepository;
    private categoryRepository;
    private userInfoRepository;
    constructor(userRepository: Repository<User>, categoryRepository: Repository<Category>, userInfoRepository: Repository<UserInfo>);
    private readJsonFile;
    seedUsers(): Promise<{
        added: number;
        updated: number;
    }>;
    seedCategories(): Promise<{
        added: number;
        updated: number;
    }>;
    seedUserInfos(): Promise<{
        added: number;
        updated: number;
    }>;
    seedAll(): Promise<{
        users: {
            added: number;
            updated: number;
        };
        categories: {
            added: number;
            updated: number;
        };
        userInfos: {
            added: number;
            updated: number;
        };
    }>;
}
