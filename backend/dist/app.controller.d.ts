import { SeedService } from './seeds/seed.service';
export declare class AppController {
    private readonly seedService;
    constructor(seedService: SeedService);
    getHello(): string;
    seedUsers(): Promise<{
        message: string;
        status: string;
    }>;
    seedAll(): Promise<{
        message: string;
        status: string;
    }>;
    seedCategories(): Promise<{
        message: string;
        status: string;
    }>;
    seedLocations(): Promise<{
        message: string;
        status: string;
    }>;
    seedUserInfos(): Promise<{
        message: string;
        status: string;
    }>;
}
