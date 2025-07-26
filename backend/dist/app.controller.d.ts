import { SeedService } from './seeds/seed.service';
export declare class AppController {
    private readonly seedService;
    constructor(seedService: SeedService);
    getHello(): string;
    getHealth(): {
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
        version: string;
    };
    seedAdmin(): Promise<{
        message: string;
        status: string;
    }>;
}
