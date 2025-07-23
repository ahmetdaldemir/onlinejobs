import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserInfo } from '../users/entities/user-info.entity';
export declare class UserInfoSeedService {
    private userRepository;
    private userInfoRepository;
    constructor(userRepository: Repository<User>, userInfoRepository: Repository<UserInfo>);
    seed(): Promise<void>;
    private generateAddressesForUser;
    private getRandomIstanbulAddress;
    private getRandomNeighborhood;
}
