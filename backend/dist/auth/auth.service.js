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
        const { email, phone, password, userType, categoryIds, ...rest } = registerDto;
        let existingUser;
        if (userType === 'employer') {
            existingUser = await this.userRepository.findOne({
                where: [
                    { email, userType },
                    { phone, userType }
                ],
            });
        }
        else {
            existingUser = await this.userRepository.findOne({
                where: { phone, userType },
            });
        }
        console.log('existingUser', existingUser);
        if (existingUser) {
            if (userType === 'employer') {
                throw new common_1.ConflictException('Email veya telefon numarası zaten kullanımda');
            }
            else {
                throw new common_1.ConflictException('Telefon numarası zaten kullanımda');
            }
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = this.userRepository.create({
            ...rest,
            email: userType === 'employer' ? email : null,
            phone,
            userType,
            password: hashedPassword,
        });
        const savedUser = await this.userRepository.save(user);
        if (userType === 'worker' && categoryIds && categoryIds.length > 0) {
            console.log('👷 Worker kullanıcısı için kategori ilişkileri kuruluyor:', categoryIds);
            savedUser.categoryIds = categoryIds;
            await this.userRepository.save(savedUser);
            for (const categoryId of categoryIds) {
                await this.userRepository
                    .createQueryBuilder()
                    .insert()
                    .into('user_categories')
                    .values({
                    userId: savedUser.id,
                    categoryId: categoryId
                })
                    .execute();
                console.log(`✅ Kategori ilişkisi kuruldu: ${categoryId}`);
            }
            console.log(`🎉 Toplam ${categoryIds.length} kategori ilişkisi başarıyla kuruldu`);
            console.log(`📋 CategoryIds array güncellendi:`, savedUser.categoryIds);
        }
        const userWithCategories = await this.userRepository.findOne({
            where: { id: savedUser.id },
            relations: ['categories'],
        });
        const payload = { sub: savedUser.id, email: savedUser.email };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            user: {
                id: userWithCategories.id,
                firstName: userWithCategories.firstName,
                lastName: userWithCategories.lastName,
                email: userWithCategories.email,
                phone: userWithCategories.phone,
                userType: userWithCategories.userType,
                status: userWithCategories.status,
                isVerified: userWithCategories.isVerified,
                isOnline: userWithCategories.isOnline,
                rating: userWithCategories.rating,
                totalReviews: userWithCategories.totalReviews,
                profileImage: userWithCategories.profileImage,
                bio: userWithCategories.bio,
                categories: userWithCategories.categories ? userWithCategories.categories.map(category => ({
                    id: category.id,
                    name: category.name,
                })) : [],
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
            relations: ['categories', 'userInfos'],
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
                categories: user.categories ? user.categories.map(category => ({
                    id: category.id,
                    name: category.name,
                })) : [],
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
    async checkPhone(checkPhoneDto) {
        const { phone, userType } = checkPhoneDto;
        const existingUser = await this.userRepository.findOne({
            where: { phone, userType },
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