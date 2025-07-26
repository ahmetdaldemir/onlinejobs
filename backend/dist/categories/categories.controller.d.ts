import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<import("./entities/category.entity").Category[]>;
    findById(id: string): Promise<import("./entities/category.entity").Category>;
    create(createCategoryDto: any): Promise<import("./entities/category.entity").Category>;
    update(id: string, updateCategoryDto: any): Promise<import("./entities/category.entity").Category>;
    clearAll(): Promise<void>;
    delete(id: string): Promise<void>;
    findByParentId(parentId: string): Promise<import("./entities/category.entity").Category[]>;
}
