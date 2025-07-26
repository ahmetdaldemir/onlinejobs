import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { AdminLoginDto, AdminRegisterDto, AdminResponseDto } from './dto/admin-auth.dto';
export declare class AdminAuthService {
    private adminRepository;
    private jwtService;
    constructor(adminRepository: Repository<Admin>, jwtService: JwtService);
    register(registerDto: AdminRegisterDto): Promise<AdminResponseDto>;
    login(loginDto: AdminLoginDto): Promise<AdminResponseDto>;
    validateAdmin(adminId: string): Promise<Admin>;
}
