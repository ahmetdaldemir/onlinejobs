import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
export declare class UsersSeedService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    seed(): Promise<boolean>;
}
