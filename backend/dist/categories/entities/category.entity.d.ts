export declare class Category {
    id: string;
    name: string;
    description: string;
    icon: string;
    isActive: boolean;
    orderIndex: number;
    parentId: string;
    createdAt: Date;
    updatedAt: Date;
    users: any[];
    parent: any;
    subCategories: any[];
}
