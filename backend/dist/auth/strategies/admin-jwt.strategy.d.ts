import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AdminAuthService } from '../admin-auth.service';
declare const AdminJwtStrategy_base: new (...args: any[]) => Strategy;
export declare class AdminJwtStrategy extends AdminJwtStrategy_base {
    private configService;
    private adminAuthService;
    constructor(configService: ConfigService, adminAuthService: AdminAuthService);
    validate(payload: any): Promise<{
        id: string;
        username: string;
        isAdmin: boolean;
        isSuperAdmin: boolean;
    }>;
}
export {};
