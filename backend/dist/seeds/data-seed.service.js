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
exports.DataSeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const user_info_entity_1 = require("../users/entities/user-info.entity");
const fs = require("fs");
const path = require("path");
let DataSeedService = class DataSeedService {
    constructor(userRepository, categoryRepository, userInfoRepository) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.userInfoRepository = userInfoRepository;
    }
    readJsonFile(filename) {
        try {
            const filePath = path.join(__dirname, '../../data', filename);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(fileContent);
        }
        catch (error) {
            console.error(`Error reading ${filename}:`, error);
            return [];
        }
    }
    async seedUsers() {
        console.log('Users seed işlemi başlatılıyor...');
        const usersData = this.readJsonFile('users.json');
        let added = 0;
        let updated = 0;
        for (const userData of usersData) {
            const existingUser = await this.userRepository.findOne({
                where: { email: userData.email },
                relations: ['categories']
            });
            let categories = [];
            if (userData.categoryIds && Array.isArray(userData.categoryIds)) {
                categories = await this.categoryRepository.findByIds(userData.categoryIds);
            }
            else if (userData.categoryId) {
                const category = await this.categoryRepository.findOne({
                    where: { id: userData.categoryId }
                });
                if (category) {
                    categories = [category];
                }
            }
            if (existingUser) {
                await this.userRepository.update(existingUser.id, {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    phone: userData.phone,
                    password: userData.password,
                    userType: userData.userType,
                    status: userData.status,
                    bio: userData.bio,
                    profileImage: userData.profileImage,
                    isVerified: userData.isVerified,
                    isOnline: userData.isOnline,
                    rating: userData.rating,
                    totalReviews: userData.totalReviews,
                    lastSeen: userData.lastSeen,
                    categoryIds: userData.categoryIds || userData.categoryId ? [userData.categoryId] : [],
                    updatedAt: new Date()
                });
                if (categories.length > 0) {
                    existingUser.categories = categories;
                    await this.userRepository.save(existingUser);
                }
                updated++;
                console.log(`✅ User güncellendi: ${userData.email}${categories.length > 0 ? ` (Categories: ${categories.map(c => c.name).join(', ')})` : ''}`);
            }
            else {
                const newUser = this.userRepository.create({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phone: userData.phone,
                    password: userData.password,
                    userType: userData.userType,
                    status: userData.status,
                    bio: userData.bio,
                    profileImage: userData.profileImage,
                    isVerified: userData.isVerified,
                    isOnline: userData.isOnline,
                    rating: userData.rating,
                    totalReviews: userData.totalReviews,
                    lastSeen: userData.lastSeen,
                    categoryIds: userData.categoryIds || userData.categoryId ? [userData.categoryId] : [],
                    categories: categories,
                    createdAt: new Date(userData.createdAt),
                    updatedAt: new Date(userData.updatedAt)
                });
                await this.userRepository.save(newUser);
                added++;
                console.log(`✅ User eklendi: ${userData.email}${categories.length > 0 ? ` (Categories: ${categories.map(c => c.name).join(', ')})` : ''}`);
            }
        }
        console.log(`Users seed tamamlandı: ${added} eklendi, ${updated} güncellendi`);
        return { added, updated };
    }
    async seedCategories() {
        console.log('Categories seed işlemi başlatılıyor...');
        const categoriesData = this.readJsonFile('categories.json');
        let added = 0;
        let updated = 0;
        for (const categoryData of categoriesData) {
            const existingCategory = await this.categoryRepository.findOne({
                where: { id: categoryData.id }
            });
            if (existingCategory) {
                await this.categoryRepository.update(existingCategory.id, {
                    name: categoryData.name,
                    description: categoryData.description,
                    icon: categoryData.icon,
                    isActive: categoryData.isActive,
                    orderIndex: categoryData.orderIndex,
                    parentId: categoryData.parentId,
                    updatedAt: new Date()
                });
                updated++;
                console.log(`✅ Category güncellendi: ${categoryData.name}`);
            }
            else {
                const newCategory = this.categoryRepository.create({
                    id: categoryData.id,
                    name: categoryData.name,
                    description: categoryData.description,
                    icon: categoryData.icon,
                    isActive: categoryData.isActive,
                    orderIndex: categoryData.orderIndex,
                    parentId: categoryData.parentId,
                    createdAt: new Date(categoryData.createdAt),
                    updatedAt: new Date(categoryData.updatedAt)
                });
                await this.categoryRepository.save(newCategory);
                added++;
                console.log(`✅ Category eklendi: ${categoryData.name}`);
            }
        }
        console.log(`Categories seed tamamlandı: ${added} eklendi, ${updated} güncellendi`);
        return { added, updated };
    }
    async seedUserInfos() {
        console.log('UserInfos seed işlemi başlatılıyor...');
        const userInfosData = this.readJsonFile('user_infos.json');
        let added = 0;
        let updated = 0;
        for (const userInfoData of userInfosData) {
            const existingUserInfo = await this.userInfoRepository.findOne({
                where: { user: { id: userInfoData.userId } }
            });
            if (existingUserInfo) {
                await this.userInfoRepository.update(existingUserInfo.id, {
                    ...userInfoData,
                    updatedAt: new Date()
                });
                updated++;
                console.log(`✅ UserInfo güncellendi: ${userInfoData.userId}`);
            }
            else {
                const newUserInfo = this.userInfoRepository.create({
                    ...userInfoData,
                    createdAt: new Date(userInfoData.createdAt || new Date()),
                    updatedAt: new Date(userInfoData.updatedAt || new Date())
                });
                await this.userInfoRepository.save(newUserInfo);
                added++;
                console.log(`✅ UserInfo eklendi: ${userInfoData.userId}`);
            }
        }
        console.log(`UserInfos seed tamamlandı: ${added} eklendi, ${updated} güncellendi`);
        return { added, updated };
    }
    async seedAll() {
        console.log('🚀 Tüm data seed işlemi başlatılıyor...');
        const users = await this.seedUsers();
        const categories = await this.seedCategories();
        const userInfos = await this.seedUserInfos();
        console.log('🎉 Tüm data seed işlemi tamamlandı!');
        console.log(`📊 Özet:`);
        console.log(`   Users: ${users.added} eklendi, ${users.updated} güncellendi`);
        console.log(`   Categories: ${categories.added} eklendi, ${categories.updated} güncellendi`);
        console.log(`   UserInfos: ${userInfos.added} eklendi, ${userInfos.updated} güncellendi`);
        return { users, categories, userInfos };
    }
};
exports.DataSeedService = DataSeedService;
exports.DataSeedService = DataSeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(user_info_entity_1.UserInfo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DataSeedService);
//# sourceMappingURL=data-seed.service.js.map