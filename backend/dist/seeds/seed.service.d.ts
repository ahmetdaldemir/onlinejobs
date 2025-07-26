import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { LocationsSeedService } from './locations.seed';
import { UsersSeedService } from './users.seed';
import { UserInfoSeedService } from './user-info.seed';
import { AdminSeedService } from './admin.seed';
export declare class SeedService {
    private categoryRepository;
    private locationsSeedService;
    private usersSeedService;
    private userInfoSeedService;
    private adminSeedService;
    constructor(categoryRepository: Repository<Category>, locationsSeedService: LocationsSeedService, usersSeedService: UsersSeedService, userInfoSeedService: UserInfoSeedService, adminSeedService: AdminSeedService);
    seedLocations(): Promise<void>;
    seedUsers(): Promise<void>;
    seedUserInfos(): Promise<void>;
    seedAdmin(): Promise<void>;
    runSeeds(): Promise<void>;
}
