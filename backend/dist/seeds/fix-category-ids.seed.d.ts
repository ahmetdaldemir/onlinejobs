import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
export declare class FixCategoryIdsSeed {
    private userRepository;
    constructor(userRepository: Repository<User>);
    fixAllUserCategoryIds(): Promise<void>;
    fixSpecificUser(userId: string): Promise<User>;
}
