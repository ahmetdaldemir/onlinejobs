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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const user_info_entity_1 = require("../users/entities/user-info.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const message_entity_1 = require("../messages/entities/message.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const bcrypt = require("bcryptjs");
const job_application_entity_1 = require("../jobs/entities/job-application.entity");
let AdminService = class AdminService {
    constructor(userRepository, userInfoRepository, jobRepository, messageRepository, categoryRepository, jobApplicationRepository) {
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
        this.jobRepository = jobRepository;
        this.messageRepository = messageRepository;
        this.categoryRepository = categoryRepository;
        this.jobApplicationRepository = jobApplicationRepository;
    }
    async getDashboardStats() {
        const [totalUsers, onlineUsers, totalJobs, activeJobs, totalMessages, totalCategories, userTypes, jobStatuses,] = await Promise.all([
            this.userRepository.count(),
            this.userRepository.count({ where: { isOnline: true } }),
            this.jobRepository.count(),
            this.jobRepository.count({ where: { status: job_entity_1.JobStatus.OPEN } }),
            this.messageRepository.count(),
            this.categoryRepository.count(),
            this.getUserTypeStats(),
            this.getJobStatusStats(),
        ]);
        return {
            users: {
                total: totalUsers,
                online: onlineUsers,
                offline: totalUsers - onlineUsers,
                types: userTypes,
            },
            jobs: {
                total: totalJobs,
                active: activeJobs,
                completed: totalJobs - activeJobs,
                statuses: jobStatuses,
            },
            messages: {
                total: totalMessages,
            },
            categories: {
                total: totalCategories,
            },
            summary: {
                totalUsers,
                onlineUsers,
                totalJobs,
                activeJobs,
                totalMessages,
                totalCategories,
            },
        };
    }
    async getUserStats() {
        const [totalUsers, onlineUsers, workerUsers, employerUsers] = await Promise.all([
            this.userRepository.count(),
            this.userRepository.count({ where: { isOnline: true } }),
            this.userRepository.count({ where: { userType: 'worker' } }),
            this.userRepository.count({ where: { userType: 'employer' } }),
        ]);
        return {
            total: totalUsers,
            online: onlineUsers,
            offline: totalUsers - onlineUsers,
            workers: workerUsers,
            employers: employerUsers,
            onlinePercentage: totalUsers > 0 ? ((onlineUsers / totalUsers) * 100).toFixed(2) : 0,
        };
    }
    async getJobStats() {
        const [totalJobs, openJobs, inProgressJobs, completedJobs] = await Promise.all([
            this.jobRepository.count(),
            this.jobRepository.count({ where: { status: job_entity_1.JobStatus.OPEN } }),
            this.jobRepository.count({ where: { status: job_entity_1.JobStatus.IN_PROGRESS } }),
            this.jobRepository.count({ where: { status: job_entity_1.JobStatus.COMPLETED } }),
        ]);
        return {
            total: totalJobs,
            open: openJobs,
            inProgress: inProgressJobs,
            completed: completedJobs,
            completionRate: totalJobs > 0 ? ((completedJobs / totalJobs) * 100).toFixed(2) : 0,
        };
    }
    async getMessageStats() {
        const totalMessages = await this.messageRepository.count();
        const readMessages = await this.messageRepository.count({ where: { isRead: true } });
        const unreadMessages = totalMessages - readMessages;
        return {
            total: totalMessages,
            read: readMessages,
            unread: unreadMessages,
            readPercentage: totalMessages > 0 ? ((readMessages / totalMessages) * 100).toFixed(2) : 0,
        };
    }
    async getCategoryStats() {
        const totalCategories = await this.categoryRepository.count();
        const activeCategories = await this.categoryRepository.count({ where: { isActive: true } });
        const parentCategories = await this.categoryRepository.count({ where: { parentId: null } });
        const childCategories = totalCategories - parentCategories;
        return {
            total: totalCategories,
            active: activeCategories,
            inactive: totalCategories - activeCategories,
            parent: parentCategories,
            child: childCategories,
        };
    }
    async getAllUsers() {
        return this.userRepository.find({
            relations: ['userInfos', 'categories'],
            order: { createdAt: 'DESC' },
        });
    }
    async getUserById(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['userInfos', 'categories'],
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        return user;
    }
    async createUser(createUserDto) {
        const existingUser = await this.userRepository.findOne({
            where: [
                { email: createUserDto.email },
                { phone: createUserDto.phone }
            ]
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email veya telefon numarası zaten kullanımda');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
        let categories = [];
        let categoryIds = [];
        if (createUserDto.userType === 'worker' && createUserDto.categoryIds) {
            categories = await this.categoryRepository.findByIds(createUserDto.categoryIds);
            categoryIds = createUserDto.categoryIds;
        }
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
            categories: categories,
            categoryIds: categoryIds,
        });
        const savedUser = await this.userRepository.save(user);
        if (createUserDto.userInfo) {
            const userInfo = this.userInfoRepository.create({
                ...createUserDto.userInfo,
                user: savedUser,
            });
            await this.userInfoRepository.save(userInfo);
        }
        return {
            message: 'Kullanıcı başarıyla oluşturuldu',
            user: savedUser,
        };
    }
    async updateUser(id, updateUserDto) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['categories']
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        if (updateUserDto.email || updateUserDto.phone) {
            const existingUser = await this.userRepository.findOne({
                where: [
                    { email: updateUserDto.email, id: (0, typeorm_2.Not)(id) },
                    { phone: updateUserDto.phone, id: (0, typeorm_2.Not)(id) }
                ]
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email veya telefon numarası zaten kullanımda');
            }
        }
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
        }
        else {
            delete updateUserDto.password;
        }
        if (updateUserDto.categoryIds !== undefined) {
            if (updateUserDto.userType === 'worker' || user.userType === 'worker') {
                const categories = await this.categoryRepository.findByIds(updateUserDto.categoryIds);
                user.categories = categories;
                user.categoryIds = updateUserDto.categoryIds;
            }
            else {
                user.categories = [];
                user.categoryIds = [];
            }
        }
        Object.assign(user, updateUserDto);
        await this.userRepository.save(user);
        return {
            message: 'Kullanıcı başarıyla güncellendi',
        };
    }
    async deleteUser(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        const hasJobs = await this.jobRepository.count({ where: { employerId: id } });
        const hasApplications = await this.jobApplicationRepository.count({ where: { applicantId: id } });
        const hasMessages = await this.messageRepository.count({
            where: [{ senderId: id }, { receiverId: id }]
        });
        if (hasJobs > 0 || hasApplications > 0 || hasMessages > 0) {
            throw new common_1.ConflictException('Bu kullanıcıya ait işler, başvurular veya mesajlar bulunduğu için silinemez');
        }
        await this.userRepository.remove(user);
        return { message: 'Kullanıcı başarıyla silindi' };
    }
    async toggleUserStatus(id, status) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        user.status = status === 'active' ? user_entity_1.UserStatus.ACTIVE : user_entity_1.UserStatus.INACTIVE;
        await this.userRepository.save(user);
        return {
            message: 'Kullanıcı durumu güncellendi',
            user: {
                id: user.id,
                status: user.status
            }
        };
    }
    async toggleUserOnline(id, isOnline) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        user.isOnline = isOnline;
        await this.userRepository.save(user);
        return {
            message: 'Kullanıcı online durumu güncellendi',
            user: {
                id: user.id,
                isOnline: user.isOnline
            }
        };
    }
    async assignCategoriesToUser(id, categoryIds) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['categories']
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        const categories = await this.categoryRepository.findByIds(categoryIds);
        if (categories.length !== categoryIds.length) {
            throw new common_1.NotFoundException('Bazı kategoriler bulunamadı');
        }
        user.categories = categories;
        user.categoryIds = categoryIds;
        await this.userRepository.save(user);
        return {
            message: 'Kullanıcıya kategoriler başarıyla atandı',
            user: {
                id: user.id,
                categoryIds: user.categoryIds,
                categories: categories.map(cat => ({
                    id: cat.id,
                    name: cat.name
                }))
            }
        };
    }
    async removeCategoriesFromUser(id, categoryIds) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['categories']
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        user.categories = user.categories.filter(cat => !categoryIds.includes(cat.id));
        user.categoryIds = user.categoryIds.filter(catId => !categoryIds.includes(catId));
        await this.userRepository.save(user);
        return {
            message: 'Kullanıcıdan kategoriler başarıyla kaldırıldı',
            user: {
                id: user.id,
                categoryIds: user.categoryIds,
                categories: user.categories.map(cat => ({
                    id: cat.id,
                    name: cat.name
                }))
            }
        };
    }
    async getUserCategories(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['categories']
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                categoryIds: user.categoryIds,
                categories: user.categories.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    description: cat.description,
                    icon: cat.icon
                }))
            }
        };
    }
    async getAllCategories() {
        return this.categoryRepository.find({
            order: { orderIndex: 'ASC', name: 'ASC' },
        });
    }
    async getActiveCategories() {
        return this.categoryRepository.find({
            where: { isActive: true },
            order: { orderIndex: 'ASC', name: 'ASC' },
        });
    }
    async getCategoryById(id) {
        const category = await this.categoryRepository.findOne({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException('Kategori bulunamadı');
        }
        return category;
    }
    async createCategory(createCategoryDto) {
        const existingCategory = await this.categoryRepository.findOne({
            where: { name: createCategoryDto.name }
        });
        if (existingCategory) {
            throw new common_1.ConflictException('Bu isimde bir kategori zaten mevcut');
        }
        if (createCategoryDto.parentId) {
            const parentCategory = await this.categoryRepository.findOne({
                where: { id: createCategoryDto.parentId }
            });
            if (!parentCategory) {
                throw new common_1.NotFoundException('Üst kategori bulunamadı');
            }
        }
        const category = this.categoryRepository.create(createCategoryDto);
        const savedCategory = await this.categoryRepository.save(category);
        return {
            message: 'Kategori başarıyla oluşturuldu',
            category: savedCategory,
        };
    }
    async updateCategory(id, updateCategoryDto) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException('Kategori bulunamadı');
        }
        if (updateCategoryDto.name) {
            const existingCategory = await this.categoryRepository.findOne({
                where: { name: updateCategoryDto.name, id: (0, typeorm_2.Not)(id) }
            });
            if (existingCategory) {
                throw new common_1.ConflictException('Bu isimde bir kategori zaten mevcut');
            }
        }
        if (updateCategoryDto.parentId) {
            const parentCategory = await this.categoryRepository.findOne({
                where: { id: updateCategoryDto.parentId }
            });
            if (!parentCategory) {
                throw new common_1.NotFoundException('Üst kategori bulunamadı');
            }
            if (updateCategoryDto.parentId === id) {
                throw new common_1.ConflictException('Kategori kendisini üst kategori olarak seçemez');
            }
        }
        await this.categoryRepository.update(id, updateCategoryDto);
        return {
            message: 'Kategori başarıyla güncellendi',
        };
    }
    async deleteCategory(id) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException('Kategori bulunamadı');
        }
        const childCategories = await this.categoryRepository.count({
            where: { parentId: id }
        });
        if (childCategories > 0) {
            throw new common_1.ConflictException('Bu kategorinin alt kategorileri var. Önce alt kategorileri silin.');
        }
        const usersWithCategory = await this.userRepository.count({
            where: { categoryIds: (0, typeorm_2.Like)(`%${id}%`) }
        });
        if (usersWithCategory > 0) {
            throw new common_1.ConflictException('Bu kategoriye bağlı kullanıcılar var. Önce kullanıcıları başka kategoriye taşıyın.');
        }
        await this.categoryRepository.remove(category);
        return {
            message: 'Kategori başarıyla silindi',
        };
    }
    async getUserTypeStats() {
        const workers = await this.userRepository.count({ where: { userType: 'worker' } });
        const employers = await this.userRepository.count({ where: { userType: 'employer' } });
        return {
            workers,
            employers,
        };
    }
    async getJobStatusStats() {
        const open = await this.jobRepository.count({ where: { status: job_entity_1.JobStatus.OPEN } });
        const inProgress = await this.jobRepository.count({ where: { status: job_entity_1.JobStatus.IN_PROGRESS } });
        const completed = await this.jobRepository.count({ where: { status: job_entity_1.JobStatus.COMPLETED } });
        const cancelled = await this.jobRepository.count({ where: { status: job_entity_1.JobStatus.CANCELLED } });
        return {
            open,
            inProgress,
            completed,
            cancelled,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_info_entity_1.UserInfo)),
    __param(2, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(3, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(4, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(5, (0, typeorm_1.InjectRepository)(job_application_entity_1.JobApplication)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map