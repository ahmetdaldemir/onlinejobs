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
exports.UserInfoSeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const user_info_entity_1 = require("../users/entities/user-info.entity");
let UserInfoSeedService = class UserInfoSeedService {
    constructor(userRepository, userInfoRepository) {
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
    }
    async seed() {
        console.log('Starting UserInfo seed...');
        const users = await this.userRepository.find();
        console.log(`Found ${users.length} users to add UserInfo data`);
        if (users.length === 0) {
            console.log('No users found, skipping UserInfo seed...');
            return;
        }
        const userInfoData = [];
        for (const user of users) {
            const addresses = this.generateAddressesForUser(user);
            for (const address of addresses) {
                userInfoData.push({
                    ...address,
                    user: user,
                });
            }
        }
        const existingUserInfos = await this.userInfoRepository.count();
        if (existingUserInfos > 0) {
            console.log('UserInfo data already exists, skipping seed...');
            return;
        }
        await this.userInfoRepository.save(userInfoData);
        console.log(`Successfully added UserInfo data for ${users.length} users`);
    }
    generateAddressesForUser(user) {
        const addresses = [];
        const istanbulCenter = {
            latitude: 41.0082,
            longitude: 28.9784,
        };
        if (user.userType === 'worker') {
            addresses.push({
                name: 'Ev Adresi',
                latitude: istanbulCenter.latitude + (Math.random() - 0.5) * 0.1,
                longitude: istanbulCenter.longitude + (Math.random() - 0.5) * 0.1,
                address: this.getRandomIstanbulAddress(),
                neighborhood: this.getRandomNeighborhood(),
                buildingNo: Math.floor(Math.random() * 100) + 1 + '',
                floor: Math.floor(Math.random() * 10) + 1 + '',
                apartmentNo: Math.floor(Math.random() * 20) + 1 + '',
                description: 'Ana ikamet adresi',
            });
            if (Math.random() > 0.5) {
                addresses.push({
                    name: 'İş Yeri',
                    latitude: istanbulCenter.latitude + (Math.random() - 0.5) * 0.1,
                    longitude: istanbulCenter.longitude + (Math.random() - 0.5) * 0.1,
                    address: this.getRandomIstanbulAddress(),
                    neighborhood: this.getRandomNeighborhood(),
                    buildingNo: Math.floor(Math.random() * 50) + 1 + '',
                    floor: Math.floor(Math.random() * 5) + 1 + '',
                    apartmentNo: Math.floor(Math.random() * 10) + 1 + '',
                    description: 'Çalışma adresi',
                });
            }
        }
        else {
            addresses.push({
                name: 'Ofis Adresi',
                latitude: istanbulCenter.latitude + (Math.random() - 0.5) * 0.1,
                longitude: istanbulCenter.longitude + (Math.random() - 0.5) * 0.1,
                address: this.getRandomIstanbulAddress(),
                neighborhood: this.getRandomNeighborhood(),
                buildingNo: Math.floor(Math.random() * 30) + 1 + '',
                floor: Math.floor(Math.random() * 15) + 1 + '',
                apartmentNo: Math.floor(Math.random() * 5) + 1 + '',
                description: 'Şirket ofisi',
            });
        }
        return addresses;
    }
    getRandomIstanbulAddress() {
        const districts = [
            'Kadıköy', 'Beşiktaş', 'Şişli', 'Beyoğlu', 'Fatih', 'Üsküdar',
            'Bakırköy', 'Maltepe', 'Ataşehir', 'Kartal', 'Pendik', 'Tuzla',
            'Sarıyer', 'Beykoz', 'Ümraniye', 'Sultanbeyli', 'Sancaktepe'
        ];
        const streets = [
            'Atatürk Caddesi', 'İstiklal Caddesi', 'Bağdat Caddesi', 'Moda Caddesi',
            'Fenerbahçe Caddesi', 'Göztepe Caddesi', 'Erenköy Caddesi', 'Sahrayıcedit Caddesi',
            'Barbaros Bulvarı', 'Levent Caddesi', 'Etiler Caddesi', 'Nişantaşı Caddesi'
        ];
        const district = districts[Math.floor(Math.random() * districts.length)];
        const street = streets[Math.floor(Math.random() * streets.length)];
        const number = Math.floor(Math.random() * 200) + 1;
        return `${street} No:${number}, ${district}/İstanbul`;
    }
    getRandomNeighborhood() {
        const neighborhoods = [
            'Moda', 'Fenerbahçe', 'Göztepe', 'Erenköy', 'Sahrayıcedit', 'Suadiye',
            'Levent', 'Etiler', 'Nişantaşı', 'Teşvikiye', 'Maçka', 'Beşiktaş',
            'Ortaköy', 'Bebek', 'Arnavutköy', 'Sarıyer', 'Tarabya', 'Yeniköy'
        ];
        return neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
    }
};
exports.UserInfoSeedService = UserInfoSeedService;
exports.UserInfoSeedService = UserInfoSeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_info_entity_1.UserInfo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserInfoSeedService);
//# sourceMappingURL=user-info.seed.js.map