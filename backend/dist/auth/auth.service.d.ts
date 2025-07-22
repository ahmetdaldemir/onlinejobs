import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto, LoginDto, AuthResponseDto, ChckPhoneDto } from './dto/auth.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    validateUser(userId: string): Promise<User>;
    chckPhone(chckPhoneDto: ChckPhoneDto): Promise<{
        message: string;
        status: string;
        statusCode: number;
    }>;
}
