import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
export declare class SeedService {
    private categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    seedCategories(): Promise<void>;
    runSeeds(): Promise<void>;
}
