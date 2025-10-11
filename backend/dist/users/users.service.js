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
const user_verification_entity_1 = require("./entities/user-verification.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const upload_service_1 = require("../upload/upload.service");
const bcrypt = require("bcryptjs");
let UsersService = class UsersService {
    constructor(userRepository, userInfoRepository, userVerificationRepository, categoryRepository, uploadService) {
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
        this.userVerificationRepository = userVerificationRepository;
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
            relations: ['userInfos', 'verifications']
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        if (user.categories && user.categories.length > 0) {
            user.categoryIds = user.categories.map(cat => cat.id);
            console.log('🔄 CategoryIds senkronize edildi:', {
                userId: user.id,
                categoryIds: user.categoryIds,
                categoriesCount: user.categories.length
            });
        }
        else if (!user.categoryIds || user.categoryIds.length === 0) {
            user.categoryIds = [];
            console.log('⚠️ Kullanıcının kategorisi yok:', user.id);
        }
        return user;
    }
    async findOnlineWorkers(latitude, longitude, radius, categoryId) {
        let query = this.userRepository
            .createQueryBuilder('user')
            .where('user.userType = :userType', { userType: 'worker' })
            .andWhere('user.isOnline = :isOnline', { isOnline: true })
            .andWhere('user.status = :status', { status: user_entity_1.UserStatus.ACTIVE });
        if (categoryId) {
            query = query.andWhere('user.categoryIds @> ARRAY[:categoryId]', { categoryId });
        }
        if (latitude && longitude && radius) {
            query = query.andWhere('user.latitude IS NOT NULL')
                .andWhere('user.longitude IS NOT NULL')
                .andWhere(`(
            6371 * acos(
              cos(radians(:latitude)) * cos(radians(user.latitude)) *
              cos(radians(user.longitude) - radians(:longitude)) +
              sin(radians(:latitude)) * sin(radians(user.latitude))
            )
          ) <= :radius`, { latitude, longitude, radius })
                .addSelect(`(
            6371 * acos(
              cos(radians(:latitude)) * cos(radians(user.latitude)) *
              cos(radians(user.longitude) - radians(:longitude)) +
              sin(radians(:latitude)) * sin(radians(user.latitude))
            )
          )`, 'distance')
                .orderBy('distance', 'ASC');
        }
        const results = await query.getMany();
        const processedResults = await Promise.all(results.map(async (user) => {
            let processedUser = { ...user };
            if (latitude && longitude && user.latitude && user.longitude) {
                const distance = this.calculateDistance(latitude, longitude, user.latitude, user.longitude);
                processedUser.distance = Math.round(distance * 100) / 100;
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
        if (user.userType !== 'worker') {
            throw new common_1.BadRequestException('Koordinat bilgisi sadece worker kullanıcıları tarafından güncellenebilir');
        }
        if (latitude < -90 || latitude > 90) {
            throw new Error('Latitude değeri -90 ile 90 arasında olmalıdır');
        }
        if (longitude < -180 || longitude > 180) {
            throw new Error('Longitude değeri -180 ile 180 arasında olmalıdır');
        }
        user.latitude = latitude;
        user.longitude = longitude;
        if (name) {
            user.city = name;
        }
        await this.userRepository.save(user);
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
        if ((updateUserInfoDto.latitude !== undefined || updateUserInfoDto.longitude !== undefined) && user.userType !== 'worker') {
            throw new common_1.BadRequestException('Koordinat bilgisi sadece worker kullanıcıları tarafından güncellenebilir');
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
            if (updateUserInfoDto.name !== undefined && updateUserInfoDto.name !== null && updateUserInfoDto.name.trim() !== '') {
                userInfo.name = updateUserInfoDto.name;
            }
            if (user.userType === 'worker') {
                if (updateUserInfoDto.latitude !== undefined && updateUserInfoDto.latitude !== null) {
                    userInfo.latitude = updateUserInfoDto.latitude;
                }
                if (updateUserInfoDto.longitude !== undefined && updateUserInfoDto.longitude !== null) {
                    userInfo.longitude = updateUserInfoDto.longitude;
                }
            }
            if (updateUserInfoDto.address !== undefined && updateUserInfoDto.address !== null && updateUserInfoDto.address.trim() !== '') {
                userInfo.address = updateUserInfoDto.address;
            }
            if (updateUserInfoDto.neighborhood !== undefined && updateUserInfoDto.neighborhood !== null && updateUserInfoDto.neighborhood.trim() !== '') {
                userInfo.neighborhood = updateUserInfoDto.neighborhood;
            }
            if (updateUserInfoDto.buildingNo !== undefined && updateUserInfoDto.buildingNo !== null && updateUserInfoDto.buildingNo.trim() !== '') {
                userInfo.buildingNo = updateUserInfoDto.buildingNo;
            }
            if (updateUserInfoDto.floor !== undefined && updateUserInfoDto.floor !== null && updateUserInfoDto.floor.trim() !== '') {
                userInfo.floor = updateUserInfoDto.floor;
            }
            if (updateUserInfoDto.apartmentNo !== undefined && updateUserInfoDto.apartmentNo !== null && updateUserInfoDto.apartmentNo.trim() !== '') {
                userInfo.apartmentNo = updateUserInfoDto.apartmentNo;
            }
            if (updateUserInfoDto.description !== undefined && updateUserInfoDto.description !== null && updateUserInfoDto.description.trim() !== '') {
                userInfo.description = updateUserInfoDto.description;
            }
        }
        else {
            const createData = { ...updateUserInfoDto };
            if (user.userType !== 'worker') {
                delete createData.latitude;
                delete createData.longitude;
            }
            userInfo = this.userInfoRepository.create({
                user: { id: userId },
                ...createData
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
    async updateProfileWithFile(userId, file) {
        const user = await this.findById(userId);
        if (!file) {
            throw new common_1.BadRequestException('Dosya bulunamadı');
        }
        if (user.profileImage && !user.profileImage.includes('default')) {
            try {
                const oldFilename = user.profileImage.split('/').pop();
                await this.uploadService.deleteFile(oldFilename);
                console.log('🗑️ Eski profil fotoğrafı silindi:', oldFilename);
            }
            catch (error) {
                console.error('⚠️ Eski profil fotoğrafı silinirken hata:', error.message);
            }
        }
        const fs = require('fs');
        const path = require('path');
        const uploadsPath = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsPath)) {
            fs.mkdirSync(uploadsPath, { recursive: true });
        }
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const filename = `profile-${uniqueSuffix}${extension}`;
        const filepath = path.join(uploadsPath, filename);
        fs.writeFileSync(filepath, file.buffer);
        const imageUrl = this.uploadService.getFileUrl(filename);
        user.profileImage = imageUrl;
        const savedUser = await this.userRepository.save(user);
        console.log('✅ Profil fotoğrafı güncellendi:', {
            userId: user.id,
            filename: filename,
            url: imageUrl
        });
        return savedUser;
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
    async getUserIsVerified(userId) {
        const user = await this.findById(userId);
        return user.isVerified;
    }
    async addPortfolioImage(userId, file) {
        const user = await this.findById(userId);
        if (user.userType !== 'worker') {
            throw new common_1.BadRequestException('Sadece worker kullanıcılar portföy resmi ekleyebilir');
        }
        if (user.portfolioImages && user.portfolioImages.length >= 10) {
            throw new common_1.BadRequestException('Maksimum 10 portföy resmi eklenebilir');
        }
        const fs = require('fs');
        const path = require('path');
        const portfolioPath = path.join(process.cwd(), 'uploads', 'portfolio-images');
        if (!fs.existsSync(portfolioPath)) {
            fs.mkdirSync(portfolioPath, { recursive: true });
        }
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const filename = `portfolio-${uniqueSuffix}${extension}`;
        const filepath = path.join(portfolioPath, filename);
        fs.writeFileSync(filepath, file.buffer);
        const imageUrl = this.uploadService.getPortfolioImageUrl(filename);
        if (!user.portfolioImages) {
            user.portfolioImages = [];
        }
        user.portfolioImages.push(imageUrl);
        const savedUser = await this.userRepository.save(user);
        console.log('✅ Portföy resmi eklendi:', {
            userId: user.id,
            filename: filename,
            totalImages: user.portfolioImages.length
        });
        return savedUser;
    }
    async deletePortfolioImage(userId, imageUrl) {
        const user = await this.findById(userId);
        if (user.userType !== 'worker') {
            throw new common_1.BadRequestException('Sadece worker kullanıcılar portföy resmi silebilir');
        }
        if (!user.portfolioImages || user.portfolioImages.length === 0) {
            throw new common_1.BadRequestException('Silinecek portföy resmi bulunamadı');
        }
        if (!user.portfolioImages.includes(imageUrl)) {
            throw new common_1.BadRequestException('Bu resim kullanıcıya ait değil');
        }
        try {
            const filename = imageUrl.split('/').pop();
            await this.uploadService.deletePortfolioImage(filename);
            console.log('🗑️ Portföy resmi dosyası silindi:', filename);
        }
        catch (error) {
            console.error('⚠️ Portföy resmi dosyası silinirken hata:', error.message);
        }
        user.portfolioImages = user.portfolioImages.filter(img => img !== imageUrl);
        const savedUser = await this.userRepository.save(user);
        console.log('✅ Portföy resmi kaldırıldı:', {
            userId: user.id,
            remainingImages: user.portfolioImages.length
        });
        return savedUser;
    }
    async getPortfolioImages(userId) {
        const user = await this.findById(userId);
        return user.portfolioImages || [];
    }
    async deleteAllPortfolioImages(userId) {
        const user = await this.findById(userId);
        if (!user.portfolioImages || user.portfolioImages.length === 0) {
            return user;
        }
        for (const imageUrl of user.portfolioImages) {
            try {
                const filename = imageUrl.split('/').pop();
                await this.uploadService.deletePortfolioImage(filename);
            }
            catch (error) {
                console.error('⚠️ Portföy resmi silinirken hata:', error.message);
            }
        }
        user.portfolioImages = [];
        const savedUser = await this.userRepository.save(user);
        console.log('✅ Tüm portföy resimleri silindi:', {
            userId: user.id
        });
        return savedUser;
    }
    async updateIsOffline(userId, isOffline) {
        const user = await this.findById(userId);
        user.isOnline = !isOffline;
        user.lastSeen = new Date();
        return this.userRepository.save(user);
    }
    async getCompleteUserProfile(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['userInfos', 'verifications']
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        let userCategories = [];
        if (user.categoryIds && user.categoryIds.length > 0) {
            const categories = await this.categoryRepository
                .createQueryBuilder('category')
                .where('category.id = ANY(:ids)', { ids: user.categoryIds })
                .getMany();
            userCategories = categories.map(cat => ({
                id: cat.id,
                name: cat.name,
                parentId: cat.parentId
            }));
        }
        const userVerified = user.verifications && user.verifications.length > 0
            ? user.verifications.some(v => v.status === user_verification_entity_1.VerificationStatus.APPROVED)
            : false;
        const { password, categoryIds, categories, verifications, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            userCategories,
            userInfos: user.userInfos || [],
            userVerifications: user.verifications || [],
            userVerified
        };
    }
    async updateCompleteUserProfile(userId, completeUserDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['userInfos']
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        if (completeUserDto.firstName !== undefined && completeUserDto.firstName.trim() !== '') {
            user.firstName = completeUserDto.firstName;
        }
        if (completeUserDto.lastName !== undefined && completeUserDto.lastName.trim() !== '') {
            user.lastName = completeUserDto.lastName;
        }
        if (completeUserDto.email !== undefined && completeUserDto.email.trim() !== '') {
            user.email = completeUserDto.email;
        }
        if (completeUserDto.phone !== undefined && completeUserDto.phone.trim() !== '') {
            user.phone = completeUserDto.phone;
        }
        if (completeUserDto.userType !== undefined) {
            user.userType = completeUserDto.userType;
        }
        if (completeUserDto.bio !== undefined) {
            user.bio = completeUserDto.bio;
        }
        if (completeUserDto.profileImage !== undefined) {
            user.profileImage = completeUserDto.profileImage;
        }
        if (completeUserDto.categoryIds !== undefined) {
            user.categoryIds = completeUserDto.categoryIds;
        }
        if (completeUserDto.isOnline !== undefined) {
            user.isOnline = completeUserDto.isOnline;
        }
        if (completeUserDto.password !== undefined && completeUserDto.password.trim() !== '') {
            user.password = await bcrypt.hash(completeUserDto.password, 10);
        }
        if (user.userType === 'worker') {
            if (completeUserDto.city !== undefined && completeUserDto.city.trim() !== '') {
                user.city = completeUserDto.city;
            }
            if (completeUserDto.district !== undefined && completeUserDto.district.trim() !== '') {
                user.district = completeUserDto.district;
            }
            if (completeUserDto.neighborhood !== undefined && completeUserDto.neighborhood.trim() !== '') {
                user.neighborhood = completeUserDto.neighborhood;
            }
            if (completeUserDto.latitude !== undefined) {
                if (completeUserDto.latitude < -90 || completeUserDto.latitude > 90) {
                    throw new common_1.BadRequestException('Latitude değeri -90 ile 90 arasında olmalıdır');
                }
                user.latitude = completeUserDto.latitude;
            }
            if (completeUserDto.longitude !== undefined) {
                if (completeUserDto.longitude < -180 || completeUserDto.longitude > 180) {
                    throw new common_1.BadRequestException('Longitude değeri -180 ile 180 arasında olmalıdır');
                }
                user.longitude = completeUserDto.longitude;
            }
        }
        else {
            if (completeUserDto.city || completeUserDto.district || completeUserDto.neighborhood ||
                completeUserDto.latitude !== undefined || completeUserDto.longitude !== undefined) {
                throw new common_1.BadRequestException('Konum bilgileri (city, district, neighborhood, latitude, longitude) sadece worker kullanıcıları için geçerlidir');
            }
        }
        await this.userRepository.save(user);
        if (user.userType === 'employer') {
            if (completeUserDto.addressName ||
                completeUserDto.address ||
                completeUserDto.buildingNo ||
                completeUserDto.floor ||
                completeUserDto.apartmentNo ||
                completeUserDto.description) {
                let userInfo = user.userInfos && user.userInfos.length > 0 ? user.userInfos[0] : null;
                if (!userInfo) {
                    const createData = {};
                    if (completeUserDto.addressName)
                        createData.name = completeUserDto.addressName;
                    if (completeUserDto.address)
                        createData.address = completeUserDto.address;
                    if (completeUserDto.buildingNo)
                        createData.buildingNo = completeUserDto.buildingNo;
                    if (completeUserDto.floor)
                        createData.floor = completeUserDto.floor;
                    if (completeUserDto.apartmentNo)
                        createData.apartmentNo = completeUserDto.apartmentNo;
                    if (completeUserDto.description)
                        createData.description = completeUserDto.description;
                    userInfo = this.userInfoRepository.create({
                        user: { id: userId },
                        ...createData
                    });
                }
                else {
                    if (completeUserDto.addressName !== undefined && completeUserDto.addressName.trim() !== '') {
                        userInfo.name = completeUserDto.addressName;
                    }
                    if (completeUserDto.address !== undefined && completeUserDto.address.trim() !== '') {
                        userInfo.address = completeUserDto.address;
                    }
                    if (completeUserDto.buildingNo !== undefined && completeUserDto.buildingNo.trim() !== '') {
                        userInfo.buildingNo = completeUserDto.buildingNo;
                    }
                    if (completeUserDto.floor !== undefined && completeUserDto.floor.trim() !== '') {
                        userInfo.floor = completeUserDto.floor;
                    }
                    if (completeUserDto.apartmentNo !== undefined && completeUserDto.apartmentNo.trim() !== '') {
                        userInfo.apartmentNo = completeUserDto.apartmentNo;
                    }
                    if (completeUserDto.description !== undefined && completeUserDto.description.trim() !== '') {
                        userInfo.description = completeUserDto.description;
                    }
                }
                await this.userInfoRepository.save(userInfo);
            }
        }
        else {
            if (completeUserDto.addressName || completeUserDto.address || completeUserDto.buildingNo ||
                completeUserDto.floor || completeUserDto.apartmentNo || completeUserDto.description) {
                throw new common_1.BadRequestException('UserInfo bilgileri (addressName, address, buildingNo, floor, apartmentNo, description) sadece employer kullanıcıları için geçerlidir');
            }
        }
        return this.getCompleteUserProfile(userId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_info_entity_1.UserInfo)),
    __param(2, (0, typeorm_1.InjectRepository)(user_verification_entity_1.UserVerification)),
    __param(3, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        upload_service_1.UploadService])
], UsersService);
//# sourceMappingURL=users.service.js.map