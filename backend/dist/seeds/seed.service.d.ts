import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { LocationsSeedService } from './locations.seed';
export declare class SeedService {
    private categoryRepository;
    private locationsSeedService;
    constructor(categoryRepository: Repository<Category>, locationsSeedService: LocationsSeedService);
    seedCategories(): Promise<void>;
    seedLocations(): Promise<void>;
    runSeeds(): Promise<void>;
}
