import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
export declare class CategoriesService {
    private categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    findAll(): Promise<Category[]>;
    findById(id: string): Promise<Category>;
    create(createCategoryDto: any): Promise<Category>;
    update(id: string, updateCategoryDto: any): Promise<Category>;
    delete(id: string): Promise<void>;
}
