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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const user_info_entity_1 = require("./entities/user-info.entity");
let UsersService = class UsersService {
    constructor(userRepository, userInfoRepository) {
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
    }
    async findTestUsers() {
        return this.userRepository.find({
            where: [
                { phone: '+905550000001' },
                { phone: '+905550000002' },
                { phone: '+905550000003' },
                { phone: '+905550000004' },
                { phone: '+905550000005' }
            ],
            select: ['id', 'firstName', 'lastName', 'email', 'phone', 'userType', 'status']
        });
    }
    async findRealUsers() {
        return this.userRepository.find({
            select: ['id', 'firstName', 'lastName', 'email', 'phone', 'userType', 'status'],
            order: { createdAt: 'DESC' },
            take: 10
        });
    }
    async findActiveUsers() {
        return this.userRepository.find({
            where: { status: user_entity_1.UserStatus.ACTIVE },
            select: ['id', 'firstName', 'lastName', 'email', 'phone', 'userType', 'status', 'isOnline', 'lastSeen'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOnlineUsers() {
        return this.userRepository.find({
            where: { isOnline: true },
            select: ['id', 'firstName', 'lastName', 'email', 'phone', 'userType', 'status', 'isOnline', 'lastSeen'],
            order: { lastSeen: 'DESC' }
        });
    }
    async findAll() {
        return this.userRepository.find();
    }
    async findById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        return user;
    }
    async findOnlineJobSeekers(latitude, longitude, radius, categoryId) {
        let query = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.userInfos', 'userInfo')
            .where("'worker' = ANY(user.userType)")
            .andWhere('user.isOnline = :isOnline', { isOnline: true })
            .andWhere('user.status = :status', { status: user_entity_1.UserStatus.ACTIVE });
        if (categoryId) {
            query = query.andWhere('user.categoryId = :categoryId', { categoryId });
        }
        if (latitude && longitude && radius) {
            query = query.andWhere(`(
          6371 * acos(
            cos(radians(:latitude)) * cos(radians(userInfo.latitude)) *
            cos(radians(userInfo.longitude) - radians(:longitude)) +
            sin(radians(:latitude)) * sin(radians(userInfo.latitude))
          )
        ) <= :radius`, { latitude, longitude, radius });
        }
        return query.getMany();
    }
    async findOnlineEmployers(latitude, longitude, radius, categoryId) {
        let query = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.userInfos', 'userInfo')
            .where("'employer' = ANY(user.userType)")
            .andWhere('user.isOnline = :isOnline', { isOnline: true })
            .andWhere('user.status = :status', { status: user_entity_1.UserStatus.ACTIVE });
        if (categoryId) {
            query = query.andWhere('user.categoryId = :categoryId', { categoryId });
        }
        if (latitude && longitude && radius) {
            query = query.andWhere(`(
          6371 * acos(
            cos(radians(:latitude)) * cos(radians(userInfo.latitude)) *
            cos(radians(userInfo.longitude) - radians(:longitude)) +
            sin(radians(:latitude)) * sin(radians(userInfo.latitude))
          )
        ) <= :radius`, { latitude, longitude, radius });
        }
        return query.getMany();
    }
    async findUsersByType(userType) {
        return this.userRepository
            .createQueryBuilder('user')
            .where(":userType = ANY(user.userType)")
            .andWhere('user.status = :status', { status: user_entity_1.UserStatus.ACTIVE })
            .setParameter('userType', userType)
            .getMany();
    }
    async updateUserTypes(userId, userType) {
        const user = await this.findById(userId);
        user.userType = userType;
        return this.userRepository.save(user);
    }
    async updateStatus(userId, status) {
        const user = await this.findById(userId);
        user.status = status;
        return this.userRepository.save(user);
    }
    async updateLocation(userId, latitude, longitude, name) {
        const user = await this.findById(userId);
        if (latitude < -90 || latitude > 90) {
            throw new Error('Latitude değeri -90 ile 90 arasında olmalıdır');
        }
        if (longitude < -180 || longitude > 180) {
            throw new Error('Longitude değeri -180 ile 180 arasında olmalıdır');
        }
        let userInfo = await this.userInfoRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user']
        });
        if (!userInfo) {
            userInfo = this.userInfoRepository.create({
                user: { id: userId },
                latitude,
                longitude,
                name,
            });
        }
        else {
            userInfo.latitude = latitude;
            userInfo.longitude = longitude;
            if (name) {
                userInfo.name = name;
            }
        }
        await this.userInfoRepository.save(userInfo);
        return user;
    }
    async getUserInfo(userId) {
        return this.userInfoRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user', 'country', 'city', 'district', 'neighborhood']
        });
    }
    async updateUserInfo(userId, updateUserInfoDto) {
        const user = await this.findById(userId);
        if (updateUserInfoDto.latitude !== undefined) {
            if (updateUserInfoDto.latitude < -90 || updateUserInfoDto.latitude > 90) {
                throw new Error('Latitude değeri -90 ile 90 arasında olmalıdır');
            }
        }
        if (updateUserInfoDto.longitude !== undefined) {
            if (updateUserInfoDto.longitude < -180 || updateUserInfoDto.longitude > 180) {
                throw new Error('Longitude değeri -180 ile 180 arasında olmalıdır');
            }
        }
        let userInfo = await this.userInfoRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user']
        });
        if (!userInfo) {
            userInfo = this.userInfoRepository.create({
                user: { id: userId },
                ...updateUserInfoDto
            });
        }
        else {
            if (updateUserInfoDto.name !== undefined)
                userInfo.name = updateUserInfoDto.name;
            if (updateUserInfoDto.latitude !== undefined)
                userInfo.latitude = updateUserInfoDto.latitude;
            if (updateUserInfoDto.longitude !== undefined)
                userInfo.longitude = updateUserInfoDto.longitude;
            if (updateUserInfoDto.address !== undefined)
                userInfo.address = updateUserInfoDto.address;
            if (updateUserInfoDto.countryId !== undefined)
                userInfo.country = { id: updateUserInfoDto.countryId };
            if (updateUserInfoDto.cityId !== undefined)
                userInfo.city = { id: updateUserInfoDto.cityId };
            if (updateUserInfoDto.districtId !== undefined)
                userInfo.district = { id: updateUserInfoDto.districtId };
            if (updateUserInfoDto.neighborhoodId !== undefined)
                userInfo.neighborhood = { id: updateUserInfoDto.neighborhoodId };
        }
        await this.userInfoRepository.save(userInfo);
        return user;
    }
    async updateProfile(userId, updateData) {
        const user = await this.findById(userId);
        Object.assign(user, updateData);
        return this.userRepository.save(user);
    }
    async setUserOnline(userId) {
        const user = await this.findById(userId);
        user.isOnline = true;
        user.lastSeen = new Date();
        return this.userRepository.save(user);
    }
    async setUserOffline(userId) {
        const user = await this.findById(userId);
        user.isOnline = false;
        user.lastSeen = new Date();
        return this.userRepository.save(user);
    }
    async setTestUsersOnline() {
        const testUsers = await this.findTestUsers();
        for (const user of testUsers) {
            await this.setUserOnline(user.id);
        }
    }
    async updateIsOnline(userId, isOnline) {
        const user = await this.findById(userId);
        user.isOnline = isOnline;
        user.lastSeen = new Date();
        return this.userRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_info_entity_1.UserInfo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map