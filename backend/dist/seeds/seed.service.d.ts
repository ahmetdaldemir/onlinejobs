import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { LocationsSeedService } from './locations.seed';
import { UsersSeedService } from './users.seed';
export declare class SeedService {
    private categoryRepository;
    private locationsSeedService;
    private usersSeedService;
    constructor(categoryRepository: Repository<Category>, locationsSeedService: LocationsSeedService, usersSeedService: UsersSeedService);
    seedCategories(): Promise<void>;
    seedLocations(): Promise<void>;
    seedUsers(): Promise<void>;
    runSeeds(): Promise<void>;
}
