import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Admin } from './entities/admin.entity';
import { AdminLoginDto, AdminRegisterDto, AdminResponseDto } from './dto/admin-auth.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: AdminRegisterDto): Promise<AdminResponseDto> {
    const { username, password, ...rest } = registerDto;

    // Username kontrolü
    const existingAdmin = await this.adminRepository.findOne({
      where: { username },
    });

    if (existingAdmin) {
      throw new ConflictException('Bu kullanıcı adı zaten kullanımda');
    }

    // Şifre hash'leme
    const hashedPassword = await bcrypt.hash(password, 12);

    // Admin oluşturma
    const admin = this.adminRepository.create({
      ...rest,
      username,
      password: hashedPassword,
    });

    const savedAdmin = await this.adminRepository.save(admin);

    // JWT token oluşturma
    const payload = { 
      sub: savedAdmin.id, 
      username: savedAdmin.username,
      isAdmin: true,
      isSuperAdmin: savedAdmin.isSuperAdmin 
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      admin: {
        id: savedAdmin.id,
        username: savedAdmin.username,
        firstName: savedAdmin.firstName,
        lastName: savedAdmin.lastName,
        email: savedAdmin.email,
        isActive: savedAdmin.isActive,
        isSuperAdmin: savedAdmin.isSuperAdmin,
        lastLoginAt: savedAdmin.lastLoginAt,
      },
      message: 'Admin başarıyla kayıt oldu',
      status: 'success',
      statusCode: 201,
    };
  }

  async login(loginDto: AdminLoginDto): Promise<AdminResponseDto> {
    const { username, password } = loginDto;

    // Admin'i bul
    const admin = await this.adminRepository.findOne({
      where: { username },
    });

    if (!admin) {
      throw new UnauthorizedException('Geçersiz kullanıcı adı veya şifre');
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Hesap aktif değil');
    }

    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Geçersiz kullanıcı adı veya şifre');
    }

    // Son giriş zamanını güncelle
    admin.lastLoginAt = new Date();
    await this.adminRepository.save(admin);

    // JWT token oluşturma
    const payload = { 
      sub: admin.id, 
      username: admin.username,
      isAdmin: true,
      isSuperAdmin: admin.isSuperAdmin 
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      admin: {
        id: admin.id,
        username: admin.username,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        isActive: admin.isActive,
        isSuperAdmin: admin.isSuperAdmin,
        lastLoginAt: admin.lastLoginAt,
      },
      message: 'Admin başarıyla giriş yaptı',
      status: 'success',
      statusCode: 200,
    };
  }

  async validateAdmin(adminId: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId, isActive: true },
    });

    if (!admin) {
      throw new UnauthorizedException('Geçersiz admin token');
    }

    return admin;
  }
} 