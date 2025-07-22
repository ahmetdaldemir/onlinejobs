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
exports.UsersSeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const bcrypt = require("bcryptjs");
let UsersSeedService = class UsersSeedService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async seed() {
        const existingUsers = await this.userRepository.count();
        if (existingUsers > 0) {
            console.log('Users already exist, skipping seed...');
            return;
        }
        console.log('Creating test users...');
        const user1 = this.userRepository.create({
            firstName: 'Test',
            lastName: 'User 1',
            email: 'testuser1@example.com',
            phone: '+905551234567',
            password: await bcrypt.hash('password123', 10),
            userType: user_entity_1.UserType.JOB_SEEKER,
            status: user_entity_1.UserStatus.ACTIVE,
            isVerified: true,
        });
        const user2 = this.userRepository.create({
            firstName: 'Test',
            lastName: 'User 2',
            email: 'testuser2@example.com',
            phone: '+905559876543',
            password: await bcrypt.hash('password123', 10),
            userType: user_entity_1.UserType.EMPLOYER,
            status: user_entity_1.UserStatus.ACTIVE,
            isVerified: true,
        });
        const savedUsers = await this.userRepository.save([user1, user2]);
        console.log('Test users created successfully!');
        console.log('User 1 ID:', savedUsers[0].id);
        console.log('User 2 ID:', savedUsers[1].id);
        return savedUsers;
    }
};
exports.UsersSeedService = UsersSeedService;
exports.UsersSeedService = UsersSeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersSeedService);
//# sourceMappingURL=users.seed.js.map