import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { LocationsSeedService } from './locations.seed';
import { UsersSeedService } from './users.seed';
import { UserInfoSeedService } from './user-info.seed';
export declare class SeedService {
    private categoryRepository;
    private locationsSeedService;
    private usersSeedService;
    private userInfoSeedService;
    constructor(categoryRepository: Repository<Category>, locationsSeedService: LocationsSeedService, usersSeedService: UsersSeedService, userInfoSeedService: UserInfoSeedService);
    seedCategories(): Promise<void>;
    seedLocations(): Promise<void>;
    seedUsers(): Promise<void>;
    seedUserInfos(): Promise<void>;
    runSeeds(): Promise<void>;
}
