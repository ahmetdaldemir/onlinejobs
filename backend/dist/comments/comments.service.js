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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("./entities/comment.entity");
const user_entity_1 = require("../users/entities/user.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
let CommentsService = class CommentsService {
    constructor(commentRepository, userRepository, jobRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
    }
    async create(createCommentDto, commenterId) {
        if (createCommentDto.jobId === '') {
            createCommentDto.jobId = undefined;
        }
        if (createCommentDto.commentedUserId === commenterId) {
            throw new common_1.BadRequestException('Kendinize yorum yapamazsınız');
        }
        const commentedUser = await this.userRepository.findOne({
            where: { id: createCommentDto.commentedUserId }
        });
        if (!commentedUser) {
            throw new common_1.NotFoundException('Yorum yapılacak kullanıcı bulunamadı');
        }
        if (createCommentDto.jobId) {
            const job = await this.jobRepository.findOne({
                where: { id: createCommentDto.jobId }
            });
            if (!job) {
                throw new common_1.NotFoundException('Belirtilen iş bulunamadı');
            }
        }
        const existingComment = await this.commentRepository.findOne({
            where: {
                commenterId,
                commentedUserId: createCommentDto.commentedUserId,
                jobId: createCommentDto.jobId || null
            }
        });
        if (existingComment) {
            throw new common_1.BadRequestException('Bu kullanıcıya zaten yorum yapmışsınız');
        }
        const comment = this.commentRepository.create({
            ...createCommentDto,
            commenterId,
            showName: createCommentDto.showName ?? true
        });
        const savedComment = await this.commentRepository.save(comment);
        await this.updateUserAverageRating(createCommentDto.commentedUserId);
        return savedComment;
    }
    async findAll(filters) {
        const query = this.commentRepository
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.commenter', 'commenter')
            .leftJoinAndSelect('comment.commentedUser', 'commentedUser')
            .leftJoinAndSelect('comment.job', 'job');
        if (filters?.commentedUserId) {
            query.andWhere('comment.commentedUserId = :commentedUserId', {
                commentedUserId: filters.commentedUserId
            });
        }
        if (filters?.commenterId) {
            query.andWhere('comment.commenterId = :commenterId', {
                commenterId: filters.commenterId
            });
        }
        if (filters?.jobId) {
            query.andWhere('comment.jobId = :jobId', { jobId: filters.jobId });
        }
        if (filters?.rating) {
            query.andWhere('comment.rating = :rating', { rating: filters.rating });
        }
        return query.orderBy('comment.createdAt', 'DESC').getMany();
    }
    async findById(id) {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ['commenter', 'commentedUser', 'job'],
        });
        if (!comment) {
            throw new common_1.NotFoundException('Yorum bulunamadı');
        }
        return comment;
    }
    async update(id, updateCommentDto, userId) {
        const comment = await this.findById(id);
        if (comment.commenterId !== userId) {
            throw new common_1.ForbiddenException('Bu yorumu düzenleme yetkiniz yok');
        }
        Object.assign(comment, updateCommentDto);
        const updatedComment = await this.commentRepository.save(comment);
        await this.updateUserAverageRating(comment.commentedUserId);
        return updatedComment;
    }
    async delete(id, userId) {
        const comment = await this.findById(id);
        if (comment.commenterId !== userId) {
            throw new common_1.ForbiddenException('Bu yorumu silme yetkiniz yok');
        }
        await this.commentRepository.remove(comment);
        await this.updateUserAverageRating(comment.commentedUserId);
    }
    async getUserComments(userId) {
        return this.commentRepository.find({
            where: { commentedUserId: userId },
            relations: ['commenter', 'job'],
            order: { createdAt: 'DESC' }
        });
    }
    async getMyComments(userId) {
        return this.commentRepository.find({
            where: { commenterId: userId },
            relations: ['commentedUser', 'job'],
            order: { createdAt: 'DESC' }
        });
    }
    async getJobComments(jobId) {
        return this.commentRepository.find({
            where: { jobId },
            relations: ['commenter', 'commentedUser'],
            order: { createdAt: 'DESC' }
        });
    }
    async updateUserAverageRating(userId) {
        const result = await this.commentRepository
            .createQueryBuilder('comment')
            .select('AVG(comment.rating)', 'averageRating')
            .addSelect('COUNT(comment.id)', 'totalComments')
            .where('comment.commentedUserId = :userId', { userId })
            .getRawOne();
        const averageRating = result.averageRating ? parseFloat(result.averageRating) : 0;
        const totalReviews = parseInt(result.totalComments) || 0;
        await this.userRepository.update(userId, {
            rating: averageRating,
            totalReviews: totalReviews
        });
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CommentsService);
//# sourceMappingURL=comments.service.js.map