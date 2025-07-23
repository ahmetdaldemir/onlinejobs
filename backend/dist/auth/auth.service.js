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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../users/entities/user.entity");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, phone, password, userType, ...rest } = registerDto;
        const existingUser = await this.userRepository.findOne({
            where: [{ userType }, { phone }],
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email veya telefon numarası zaten kullanımda');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = this.userRepository.create({
            ...rest,
            email,
            phone,
            userType,
            password: hashedPassword,
        });
        const savedUser = await this.userRepository.save(user);
        const payload = { sub: savedUser.id, email: savedUser.email };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            user: {
                id: savedUser.id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                phone: savedUser.phone,
                userType: savedUser.userType,
                status: savedUser.status,
                isVerified: savedUser.isVerified,
                isOnline: savedUser.isOnline,
                rating: savedUser.rating,
                totalReviews: savedUser.totalReviews,
                profileImage: savedUser.profileImage,
                bio: savedUser.bio,
                category: savedUser.category ? {
                    id: savedUser.category.id,
                    name: savedUser.category.name,
                } : undefined,
            },
            message: 'Kullanıcı başarıyla kayıt oldu',
            status: 'success',
            statusCode: 201,
        };
    }
    async login(loginDto) {
        const { phone, password, userType } = loginDto;
        const user = await this.userRepository.findOne({
            where: { phone, userType },
            relations: ['category', 'userInfos'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Geçersiz telefon numarası veya şifre');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Geçersiz email veya şifre');
        }
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                userType: user.userType,
                status: user.status,
                isVerified: user.isVerified,
                isOnline: user.isOnline,
                rating: user.rating,
                totalReviews: user.totalReviews,
                profileImage: user.profileImage,
                bio: user.bio,
                category: user.category ? {
                    id: user.category.id,
                    name: user.category.name,
                } : undefined,
                userInfos: user.userInfos ? user.userInfos.map(userInfo => ({
                    id: userInfo.id,
                    name: userInfo.name,
                    latitude: userInfo.latitude,
                    longitude: userInfo.longitude,
                    address: userInfo.address,
                    neighborhood: userInfo.neighborhood,
                    buildingNo: userInfo.buildingNo,
                    floor: userInfo.floor,
                    apartmentNo: userInfo.apartmentNo,
                    description: userInfo.description,
                })) : [],
            },
            message: 'Giriş başarılı',
            status: 'success',
            statusCode: 200,
        };
    }
    async validateUser(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['category'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Kullanıcı bulunamadı');
        }
        return user;
    }
    async checkPhone(checkPhoneDto) {
        const { phone } = checkPhoneDto;
        const existingUser = await this.userRepository.findOne({
            where: { phone },
        });
        if (existingUser) {
            return {
                message: 'Telefon numarası zaten kullanımda',
                status: 'error',
                statusCode: 400,
            };
        }
        return {
            message: 'Telefon numarası kontrolü başarılı',
            status: 'success',
            statusCode: 200,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map