import { Repository } from 'typeorm';
import { Admin } from '../auth/entities/admin.entity';
export declare class AdminSeedService {
    private adminRepository;
    constructor(adminRepository: Repository<Admin>);
    seed(): Promise<void>;
}
