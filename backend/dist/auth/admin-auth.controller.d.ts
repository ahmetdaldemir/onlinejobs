import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto, AdminRegisterDto, AdminResponseDto } from './dto/admin-auth.dto';
export declare class AdminAuthController {
    private readonly adminAuthService;
    constructor(adminAuthService: AdminAuthService);
    register(registerDto: AdminRegisterDto): Promise<AdminResponseDto>;
    login(loginDto: AdminLoginDto): Promise<AdminResponseDto>;
    getProfile(req: any): Promise<{
        id: any;
        username: any;
        isAdmin: any;
        isSuperAdmin: any;
    }>;
}
