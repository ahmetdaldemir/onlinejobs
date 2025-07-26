"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const admin_entity_1 = require("./entities/admin.entity");
let AdminAuthService = class AdminAuthService {
    constructor(adminRepository, jwtService) {
        this.adminRepository = adminRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { username, password, ...rest } = registerDto;
        const existingAdmin = await this.adminRepository.findOne({
            where: { username },
        });
        if (existingAdmin) {
            throw new common_1.ConflictException('Bu kullanıcı adı zaten kullanımda');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const admin = this.adminRepository.create({
            ...rest,
            username,
            password: hashedPassword,
        });
        const savedAdmin = await this.adminRepository.save(admin);
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
    async login(loginDto) {
        const { username, password } = loginDto;
        const admin = await this.adminRepository.findOne({
            where: { username },
        });
        if (!admin) {
            throw new common_1.UnauthorizedException('Geçersiz kullanıcı adı veya şifre');
        }
        if (!admin.isActive) {
            throw new common_1.UnauthorizedException('Hesap aktif değil');
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Geçersiz kullanıcı adı veya şifre');
        }
        admin.lastLoginAt = new Date();
        await this.adminRepository.save(admin);
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
    async validateAdmin(adminId) {
        const admin = await this.adminRepository.findOne({
            where: { id: adminId, isActive: true },
        });
        if (!admin) {
            throw new common_1.UnauthorizedException('Geçersiz admin token');
        }
        return admin;
    }
};
exports.AdminAuthService = AdminAuthService;
exports.AdminAuthService = AdminAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AdminAuthService);
//# sourceMappingURL=admin-auth.service.js.map