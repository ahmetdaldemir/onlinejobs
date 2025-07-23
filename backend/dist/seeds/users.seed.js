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
        console.log('Starting user seed...');
        const existingUsers = await this.userRepository.count();
        console.log(`Existing users count: ${existingUsers}`);
        if (existingUsers > 0) {
            console.log('Users already exist, skipping seed...');
            return;
        }
        console.log('Creating test users...');
        const demoUsers = [
            {
                firstName: 'Ahmet',
                lastName: 'Yılmaz',
                email: 'ahmet.yilmaz@example.com',
                phone: '5550000001',
                password: await bcrypt.hash('password123', 10),
                userType: 'worker',
                status: user_entity_1.UserStatus.ACTIVE,
                isVerified: true,
                isOnline: true,
            },
            {
                firstName: 'Ayşe',
                lastName: 'Demir',
                email: 'ayse.demir@example.com',
                phone: '5550000002',
                password: await bcrypt.hash('password123', 10),
                userType: 'employer',
                status: user_entity_1.UserStatus.INACTIVE,
                isVerified: false,
                isOnline: false,
            },
            {
                firstName: 'Mehmet',
                lastName: 'Kaya',
                email: 'mehmet.kaya@example.com',
                phone: '5550000003',
                password: await bcrypt.hash('password123', 10),
                userType: 'worker',
                status: user_entity_1.UserStatus.ACTIVE,
                isVerified: true,
                isOnline: true,
            },
            {
                firstName: 'Zeynep',
                lastName: 'Aydın',
                email: 'zeynep.aydin@example.com',
                phone: '5550000004',
                password: await bcrypt.hash('password123', 10),
                userType: 'employer',
                status: user_entity_1.UserStatus.ACTIVE,
                isVerified: true,
                isOnline: false,
            },
            {
                firstName: 'Emre',
                lastName: 'Şahin',
                email: 'emre.sahin@example.com',
                phone: '5550000005',
                password: await bcrypt.hash('password123', 10),
                userType: 'worker',
                status: user_entity_1.UserStatus.INACTIVE,
                isVerified: false,
                isOnline: false,
            },
            {
                firstName: 'Fatma',
                lastName: 'Koç',
                email: 'fatma.koc@example.com',
                phone: '5550000006',
                password: await bcrypt.hash('password123', 10),
                userType: 'employer',
                status: user_entity_1.UserStatus.ACTIVE,
                isVerified: true,
                isOnline: true,
            },
            {
                firstName: 'Burak',
                lastName: 'Çelik',
                email: 'burak.celik@example.com',
                phone: '5550000007',
                password: await bcrypt.hash('password123', 10),
                userType: 'worker',
                status: user_entity_1.UserStatus.ACTIVE,
                isVerified: true,
                isOnline: false,
            },
            {
                firstName: 'Elif',
                lastName: 'Arslan',
                email: 'elif.arslan@example.com',
                phone: '5550000008',
                password: await bcrypt.hash('password123', 10),
                userType: 'employer',
                status: user_entity_1.UserStatus.ACTIVE,
                isVerified: true,
                isOnline: false,
            },
            {
                firstName: 'Can',
                lastName: 'Yıldız',
                email: 'can.yildiz@example.com',
                phone: '5550000009',
                password: await bcrypt.hash('password123', 10),
                userType: 'worker',
                status: user_entity_1.UserStatus.ACTIVE,
                isVerified: true,
                isOnline: true,
            },
            {
                firstName: 'Merve',
                lastName: 'Çetin',
                email: 'merve.cetin@example.com',
                phone: '5550000010',
                password: await bcrypt.hash('password123', 10),
                userType: 'employer',
                status: user_entity_1.UserStatus.INACTIVE,
                isVerified: false,
                isOnline: false,
            },
            {
                firstName: 'Ali',
                lastName: 'Durmaz',
                email: 'ali.durmaz@example.com',
                phone: '5550000011',
                password: await bcrypt.hash('password123', 10),
                userType: 'worker',
                status: user_entity_1.UserStatus.ACTIVE,
                isVerified: true,
                isOnline: true,
            },
            {
                firstName: 'Nazlı',
                lastName: 'Erdoğan',
                email: 'nazli.erdogan@example.com',
                phone: '5550000012',
                password: await bcrypt.hash('password123', 10),
                userType: 'employer',
                status: user_entity_1.UserStatus.ACTIVE,
                isVerified: true,
                isOnline: false,
            },
            {
                firstName: 'Selim',
                lastName: 'Turan',
                email: 'selim.turan@example.com',
                phone: '5550000013',
                password: await bcrypt.hash('password123', 10),
                userType: 'worker',
                status: user_entity_1.UserStatus.INACTIVE,
                isVerified: false,
                isOnline: false,
            },
            {
                firstName: 'Ece',
                lastName: 'Yavuz',
                email: 'ece.yavuz@example.com',
                phone: '5550000014',
                password: await bcrypt.hash('password123', 10),
                userType: 'employer',
                status: user_entity_1.UserStatus.ACTIVE,
                isVerified: true,
                isOnline: true,
            },
            {
                firstName: 'Kerem',
                lastName: 'Bozkurt',
                email: 'kerem.bozkurt@example.com',
                phone: '5550000015',
                password: await bcrypt.hash('password123', 10),
                userType: 'worker',
                status: user_entity_1.UserStatus.ACTIVE,
                isVerified: true,
                isOnline: false,
            },
            {
                firstName: 'Aslı',
                lastName: 'Kurt',
                email: 'asli.kurt@example.com',
                phone: '5550000016',
                password: await bcrypt.hash('password123', 10),
                userType: 'employer',
                status: user_entity_1.UserStatus.INACTIVE,
                isVerified: false,
                isOnline: false,
            },
            {
                firstName: 'Yusuf',
                lastName: 'Acar',
                email: 'yusuf.acar@example.com',
                phone: '5550000017',
                password: await bcrypt.hash('password123', 10),
                userType: 'worker',
                status: user_entity_1.UserStatus.ACTIVE,
                isVerified: true,
                isOnline: true,
            },
            {
                firstName: 'Gül',
                lastName: 'Özkan',
                email: 'gul.ozkan@example.com',
                phone: '5550000018',
                password: await bcrypt.hash('password123', 10),
                userType: 'employer',
                status: user_entity_1.UserStatus.ACTIVE,
                isVerified: true,
                isOnline: false,
            },
            {
                firstName: 'Berk',
                lastName: 'Kara',
                email: 'berk.kara@example.com',
                phone: '5550000019',
                password: await bcrypt.hash('password123', 10),
                userType: 'worker',
                status: user_entity_1.UserStatus.INACTIVE,
                isVerified: false,
                isOnline: false,
            },
            {
                firstName: 'Melis',
                lastName: 'Tan',
                email: 'melis.tan@example.com',
                phone: '5550000020',
                password: await bcrypt.hash('password123', 10),
                userType: 'employer',
                status: user_entity_1.UserStatus.ACTIVE,
                isVerified: true,
                isOnline: true,
            },
        ];
        for (const userData of demoUsers) {
            console.log(userData);
            const user = this.userRepository.create(userData);
            await this.userRepository.save(user);
            console.log(`Created user: ${userData.firstName} ${userData.lastName} (${userData.phone})`);
        }
        console.log(`Successfully created ${demoUsers.length} test users`);
        return true;
    }
};
exports.UsersSeedService = UsersSeedService;
exports.UsersSeedService = UsersSeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersSeedService);
//# sourceMappingURL=users.seed.js.map