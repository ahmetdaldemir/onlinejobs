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
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findTestUsers() {
        return this.userRepository.find({
            where: [
                { email: 'ahmet.yilmaz@example.com' },
                { email: 'ayse.demir@example.com' },
                { email: 'mehmet.kaya@example.com' },
                { email: 'zeynep.aydin@example.com' },
                { email: 'emre.sahin@example.com' }
            ],
            select: ['id', 'firstName', 'lastName', 'email', 'phone', 'userTypes', 'status']
        });
    }
    async findRealUsers() {
        return this.userRepository.find({
            select: ['id', 'firstName', 'lastName', 'email', 'phone', 'userTypes', 'status'],
            order: { createdAt: 'DESC' },
            take: 10
        });
    }
    async findActiveUsers() {
        return this.userRepository.find({
            where: { status: user_entity_1.UserStatus.ACTIVE },
            select: ['id', 'firstName', 'lastName', 'email', 'phone', 'userTypes', 'status', 'isOnline', 'lastSeen'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOnlineUsers() {
        return this.userRepository.find({
            where: { isOnline: true },
            select: ['id', 'firstName', 'lastName', 'email', 'phone', 'userTypes', 'status', 'isOnline', 'lastSeen'],
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
            .where("'job_seeker' = ANY(user.userTypes)")
            .andWhere('user.isOnline = :isOnline', { isOnline: true })
            .andWhere('user.status = :status', { status: user_entity_1.UserStatus.ACTIVE });
        if (categoryId) {
            query = query.andWhere('user.categoryId = :categoryId', { categoryId });
        }
        if (latitude && longitude && radius) {
            query = query.andWhere(`(
          6371 * acos(
            cos(radians(:latitude)) * cos(radians(user.latitude)) *
            cos(radians(user.longitude) - radians(:longitude)) +
            sin(radians(:latitude)) * sin(radians(user.latitude))
          )
        ) <= :radius`, { latitude, longitude, radius });
        }
        return query.getMany();
    }
    async findOnlineEmployers(latitude, longitude, radius, categoryId) {
        let query = this.userRepository
            .createQueryBuilder('user')
            .where("'employer' = ANY(user.userTypes)")
            .andWhere('user.isOnline = :isOnline', { isOnline: true })
            .andWhere('user.status = :status', { status: user_entity_1.UserStatus.ACTIVE });
        if (categoryId) {
            query = query.andWhere('user.categoryId = :categoryId', { categoryId });
        }
        if (latitude && longitude && radius) {
            query = query.andWhere(`(
          6371 * acos(
            cos(radians(:latitude)) * cos(radians(user.latitude)) *
            cos(radians(user.longitude) - radians(:longitude)) +
            sin(radians(:latitude)) * sin(radians(user.latitude))
          )
        ) <= :radius`, { latitude, longitude, radius });
        }
        return query.getMany();
    }
    async findUsersByType(userType) {
        return this.userRepository
            .createQueryBuilder('user')
            .where(":userType = ANY(user.userTypes)")
            .andWhere('user.status = :status', { status: user_entity_1.UserStatus.ACTIVE })
            .setParameter('userType', userType)
            .getMany();
    }
    async updateUserTypes(userId, userTypes) {
        const user = await this.findById(userId);
        user.userTypes = userTypes;
        return this.userRepository.save(user);
    }
    async updateStatus(userId, status) {
        const user = await this.findById(userId);
        user.status = status;
        return this.userRepository.save(user);
    }
    async updateLocation(userId, latitude, longitude) {
        const user = await this.findById(userId);
        user.latitude = latitude;
        user.longitude = longitude;
        return this.userRepository.save(user);
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
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map