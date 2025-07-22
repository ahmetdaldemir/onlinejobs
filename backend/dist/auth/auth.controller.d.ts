import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponseDto, CheckPhoneDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    checkPhone(checkPhoneDto: CheckPhoneDto): Promise<{
        message: string;
        status: string;
        statusCode: number;
    }>;
    getProfile(req: any): Promise<import("../users/entities/user.entity").User>;
}
