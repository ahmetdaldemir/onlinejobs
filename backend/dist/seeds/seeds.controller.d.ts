import { SeedService } from './seed.service';
import { DataSeedService } from './data-seed.service';
export declare class SeedsController {
    private readonly seedService;
    private readonly dataSeedService;
    constructor(seedService: SeedService, dataSeedService: DataSeedService);
    runAllSeeds(): Promise<void>;
    seedLocations(): Promise<void>;
    seedUsers(): Promise<void>;
    seedUserInfos(): Promise<void>;
    seedAdmin(): Promise<void>;
    seedAllData(): Promise<{
        users: {
            added: number;
            updated: number;
        };
        categories: {
            added: number;
            updated: number;
        };
        userInfos: {
            added: number;
            updated: number;
        };
    }>;
    seedDataUsers(): Promise<{
        added: number;
        updated: number;
    }>;
    seedDataCategories(): Promise<{
        added: number;
        updated: number;
    }>;
    seedDataUserInfos(): Promise<{
        added: number;
        updated: number;
    }>;
    getSeedStatus(): Promise<{
        message: string;
        endpoints: {
            'POST /seeds/run-all': string;
            'POST /seeds/locations': string;
            'POST /seeds/users': string;
            'POST /seeds/user-info': string;
            'POST /seeds/admin': string;
            'POST /seeds/data/all': string;
            'POST /seeds/data/users': string;
            'POST /seeds/data/categories': string;
            'POST /seeds/data/user-infos': string;
        };
    }>;
}
