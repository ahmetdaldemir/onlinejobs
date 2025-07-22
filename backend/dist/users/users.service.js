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
                { email: 'testuser1@example.com' },
                { email: 'testuser2@example.com' }
            ],
            select: ['id', 'firstName', 'lastName', 'email', 'phone', 'userType', 'status']
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
            .where('user.userType = :userType', { userType: 'job_seeker' })
            .andWhere('user.status = :status', { status: user_entity_1.UserStatus.ONLINE });
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map