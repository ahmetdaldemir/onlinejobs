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
const category_entity_1 = require("../categories/entities/category.entity");
const upload_service_1 = require("../upload/upload.service");
let UsersService = class UsersService {
    constructor(userRepository, userInfoRepository, categoryRepository, uploadService) {
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
        this.categoryRepository = categoryRepository;
        this.uploadService = uploadService;
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
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['userInfos', 'categories']
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        return user;
    }
    async findOnlineWorkers(latitude, longitude, radius, categoryId) {
        let query = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.userInfos', 'userInfo')
            .where('user.userType = :userType', { userType: 'worker' })
            .andWhere('user.isOnline = :isOnline', { isOnline: true })
            .andWhere('user.status = :status', { status: user_entity_1.UserStatus.ACTIVE });
        if (categoryId) {
            query = query.andWhere('user.categoryIds @> ARRAY[:categoryId]', { categoryId });
        }
        if (latitude && longitude && radius) {
            query = query.andWhere('userInfo.latitude IS NOT NULL')
                .andWhere('userInfo.longitude IS NOT NULL')
                .andWhere(`(
            6371 * acos(
              cos(radians(:latitude)) * cos(radians(userInfo.latitude)) *
              cos(radians(userInfo.longitude) - radians(:longitude)) +
              sin(radians(:latitude)) * sin(radians(userInfo.latitude))
            )
          ) <= :radius`, { latitude, longitude, radius })
                .addSelect(`(
            6371 * acos(
              cos(radians(:latitude)) * cos(radians(userInfo.latitude)) *
              cos(radians(userInfo.longitude) - radians(:longitude)) +
              sin(radians(:latitude)) * sin(radians(userInfo.latitude))
            )
          )`, 'distance')
                .orderBy('distance', 'ASC');
        }
        const results = await query.getMany();
        const processedResults = await Promise.all(results.map(async (user) => {
            let processedUser = { ...user };
            if (latitude && longitude) {
                const userInfo = user.userInfos?.[0];
                if (userInfo && userInfo.latitude && userInfo.longitude) {
                    const distance = this.calculateDistance(latitude, longitude, userInfo.latitude, userInfo.longitude);
                    processedUser.distance = Math.round(distance * 100) / 100;
                }
            }
            if (user.categoryIds && user.categoryIds.length > 0) {
                const hierarchicalCategories = await this.buildHierarchicalCategories(user.categoryIds);
                processedUser.categoryIds = hierarchicalCategories;
            }
            return processedUser;
        }));
        return processedResults;
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    async buildHierarchicalCategories(categoryIds) {
        if (!categoryIds || categoryIds.length === 0) {
            return {};
        }
        const allCategories = await this.categoryRepository.find();
        const categoryMap = new Map();
        allCategories.forEach(category => {
            categoryMap.set(category.id, category);
        });
        const hierarchicalStructure = {};
        categoryIds.forEach(categoryId => {
            const category = categoryMap.get(categoryId);
            if (category) {
                if (category.parentId) {
                    const parentCategory = categoryMap.get(category.parentId);
                    if (parentCategory) {
                        if (!hierarchicalStructure[parentCategory.name]) {
                            hierarchicalStructure[parentCategory.name] = [];
                        }
                        hierarchicalStructure[parentCategory.name].push({
                            name: category.name,
                            id: category.id
                        });
                    }
                }
                else {
                    const childCategories = allCategories.filter(cat => cat.parentId === category.id);
                    if (childCategories.length > 0) {
                        if (!hierarchicalStructure[category.name]) {
                            hierarchicalStructure[category.name] = [];
                        }
                        childCategories.forEach(child => {
                            if (categoryIds.includes(child.id)) {
                                hierarchicalStructure[category.name].push({
                                    name: child.name,
                                    id: child.id
                                });
                            }
                        });
                    }
                    else {
                        if (!hierarchicalStructure[category.name]) {
                            hierarchicalStructure[category.name] = [];
                        }
                    }
                }
            }
        });
        return hierarchicalStructure;
    }
    async findOnlineEmployers(latitude, longitude, radius, categoryId) {
        let query = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.userInfos', 'userInfo')
            .where('user.userType = :userType', { userType: 'employer' })
            .andWhere('user.isOnline = :isOnline', { isOnline: true })
            .andWhere('user.status = :status', { status: user_entity_1.UserStatus.ACTIVE });
        if (categoryId) {
            query = query.andWhere('user.categoryIds LIKE :categoryId', { categoryId: `%${categoryId}%` });
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
        const results = await query.getMany();
        const processedResults = await Promise.all(results.map(async (user) => {
            let processedUser = { ...user };
            if (user.categoryIds && user.categoryIds.length > 0) {
                const hierarchicalCategories = await this.buildHierarchicalCategories(user.categoryIds);
                processedUser.categoryIds = hierarchicalCategories;
            }
            return processedUser;
        }));
        return processedResults;
    }
    async findUsersByType(userType) {
        return this.userRepository
            .createQueryBuilder('user')
            .where('user.userType = :userType', { userType })
            .andWhere('user.status = :status', { status: user_entity_1.UserStatus.ACTIVE })
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
        return this.userInfoRepository.find({
            where: { user: { id: userId } },
            relations: ['user']
        });
    }
    async updateUserInfo(userId, updateUserInfoDto) {
        const user = await this.findById(userId);
        if (!updateUserInfoDto.userInfoId && !updateUserInfoDto.name) {
            throw new common_1.BadRequestException('Adres adı (name) zorunludur veya userInfoId belirtilmelidir');
        }
        if (updateUserInfoDto.latitude !== undefined) {
            if (updateUserInfoDto.latitude < -90 || updateUserInfoDto.latitude > 90) {
                throw new common_1.BadRequestException('Latitude değeri -90 ile 90 arasında olmalıdır');
            }
        }
        if (updateUserInfoDto.longitude !== undefined) {
            if (updateUserInfoDto.longitude < -180 || updateUserInfoDto.longitude > 180) {
                throw new common_1.BadRequestException('Longitude değeri -180 ile 180 arasında olmalıdır');
            }
        }
        let userInfo = null;
        if (updateUserInfoDto.userInfoId) {
            userInfo = await this.userInfoRepository.findOne({
                where: {
                    id: updateUserInfoDto.userInfoId,
                    user: { id: userId }
                },
                relations: ['user']
            });
            if (!userInfo) {
                throw new common_1.BadRequestException('Belirtilen userInfoId ile kayıt bulunamadı veya bu kullanıcıya ait değil');
            }
            console.log(`🔄 UserInfo güncelleniyor (ID: ${userInfo.id})`);
        }
        else {
            userInfo = await this.userInfoRepository.findOne({
                where: {
                    user: { id: userId },
                    name: updateUserInfoDto.name
                },
                relations: ['user']
            });
            if (userInfo) {
                console.log(`🔄 UserInfo güncelleniyor (Name: ${userInfo.name})`);
            }
            else {
                console.log(`➕ Yeni UserInfo oluşturuluyor (Name: ${updateUserInfoDto.name})`);
            }
        }
        if (userInfo) {
            if (updateUserInfoDto.name !== undefined)
                userInfo.name = updateUserInfoDto.name;
            if (updateUserInfoDto.latitude !== undefined)
                userInfo.latitude = updateUserInfoDto.latitude;
            if (updateUserInfoDto.longitude !== undefined)
                userInfo.longitude = updateUserInfoDto.longitude;
            if (updateUserInfoDto.address !== undefined)
                userInfo.address = updateUserInfoDto.address;
            if (updateUserInfoDto.neighborhood !== undefined)
                userInfo.neighborhood = updateUserInfoDto.neighborhood;
            if (updateUserInfoDto.buildingNo !== undefined)
                userInfo.buildingNo = updateUserInfoDto.buildingNo;
            if (updateUserInfoDto.floor !== undefined)
                userInfo.floor = updateUserInfoDto.floor;
            if (updateUserInfoDto.apartmentNo !== undefined)
                userInfo.apartmentNo = updateUserInfoDto.apartmentNo;
            if (updateUserInfoDto.description !== undefined)
                userInfo.description = updateUserInfoDto.description;
        }
        else {
            userInfo = this.userInfoRepository.create({
                user: { id: userId },
                ...updateUserInfoDto
            });
        }
        const savedUserInfo = await this.userInfoRepository.save(userInfo);
        console.log(`✅ UserInfo ${userInfo.id ? 'güncellendi' : 'oluşturuldu'}:`, {
            id: savedUserInfo.id,
            name: savedUserInfo.name,
            address: savedUserInfo.address
        });
        return user;
    }
    async createUserInfo(userId, createUserInfoDto) {
        const user = await this.findById(userId);
        if (!createUserInfoDto.name) {
            throw new common_1.BadRequestException('Adres adı (name) zorunludur');
        }
        const existingUserInfo = await this.userInfoRepository.findOne({
            where: {
                user: { id: userId },
                name: createUserInfoDto.name
            },
            relations: ['user']
        });
        if (existingUserInfo) {
            throw new common_1.BadRequestException(`Bu kullanıcı için '${createUserInfoDto.name}' adında bir adres zaten mevcut`);
        }
        if (createUserInfoDto.latitude !== undefined) {
            if (createUserInfoDto.latitude < -90 || createUserInfoDto.latitude > 90) {
                throw new common_1.BadRequestException('Latitude değeri -90 ile 90 arasında olmalıdır');
            }
        }
        if (createUserInfoDto.longitude !== undefined) {
            if (createUserInfoDto.longitude < -180 || createUserInfoDto.longitude > 180) {
                throw new common_1.BadRequestException('Longitude değeri -180 ile 180 arasında olmalıdır');
            }
        }
        const userInfo = this.userInfoRepository.create({
            user: { id: userId },
            ...createUserInfoDto
        });
        await this.userInfoRepository.save(userInfo);
        console.log(`✅ UserInfo oluşturuldu: ${createUserInfoDto.name}`);
        return user;
    }
    async updateProfile(userId, updateData, file) {
        const user = await this.findById(userId);
        if (file) {
            console.log('📸 Profil fotoğrafı yükleniyor (Users Service):', {
                originalName: file.originalname,
                filename: file.filename,
                size: file.size,
                mimetype: file.mimetype
            });
            const fileUrl = this.uploadService.getFileUrl(file.filename);
            user.profileImage = fileUrl;
            console.log('✅ Profil fotoğrafı URL\'i oluşturuldu (Users Service):', fileUrl);
        }
        else {
            console.log('ℹ️ Profil fotoğrafı yüklenmedi (Users Service)');
        }
        if (updateData.categoryIds) {
            const { Category } = await Promise.resolve().then(() => require('../categories/entities/category.entity'));
            const categoryRepository = this.userRepository.manager.getRepository(Category);
            const categories = await categoryRepository.findByIds(updateData.categoryIds);
            user.categories = categories;
            user.categoryIds = updateData.categoryIds;
        }
        Object.assign(user, updateData);
        return this.userRepository.save(user);
    }
    async updateProfileImage(userId, imageUrl) {
        const user = await this.findById(userId);
        user.profileImage = imageUrl;
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
    __param(2, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        upload_service_1.UploadService])
], UsersService);
//# sourceMappingURL=users.service.js.map