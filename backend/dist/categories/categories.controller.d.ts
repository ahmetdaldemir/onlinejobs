import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(req?: any): Promise<import("./entities/category.entity").Category[]>;
    findActive(): Promise<import("./entities/category.entity").Category[]>;
    findById(id: string): Promise<import("./entities/category.entity").Category>;
    findByParentId(parentId: string): Promise<import("./entities/category.entity").Category[]>;
}
