import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async create(createCommentDto: CreateCommentDto, commenterId: string): Promise<Comment> {
    // jobId boş string ise undefined yap
    if (createCommentDto.jobId === '') {
      createCommentDto.jobId = undefined;
    }

    // Kendine yorum yapmasını engelle
    if (createCommentDto.commentedUserId === commenterId) {
      throw new BadRequestException('Kendinize yorum yapamazsınız');
    }

    // Yorum yapılacak kullanıcının var olup olmadığını kontrol et
    const commentedUser = await this.userRepository.findOne({
      where: { id: createCommentDto.commentedUserId }
    });

    if (!commentedUser) {
      throw new NotFoundException('Yorum yapılacak kullanıcı bulunamadı');
    }

    // Eğer jobId verilmişse, işin var olup olmadığını kontrol et
    if (createCommentDto.jobId) {
      const job = await this.jobRepository.findOne({
        where: { id: createCommentDto.jobId }
      });

      if (!job) {
        throw new NotFoundException('Belirtilen iş bulunamadı');
      }
    }

    // Daha önce aynı kullanıcıya yorum yapılmış mı kontrol et
    const existingComment = await this.commentRepository.findOne({
      where: {
        commenterId,
        commentedUserId: createCommentDto.commentedUserId,
        jobId: createCommentDto.jobId || null
      }
    });

    if (existingComment) {
      throw new BadRequestException('Bu kullanıcıya zaten yorum yapmışsınız');
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      commenterId,
      showName: createCommentDto.showName ?? true
    });

    const savedComment = await this.commentRepository.save(comment);

    // Kullanıcının ortalama rating'ini güncelle
    await this.updateUserAverageRating(createCommentDto.commentedUserId);

    return savedComment;
  }

  async findAll(filters?: any): Promise<Comment[]> {
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

  async findById(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['commenter', 'commentedUser', 'job'],
    });

    if (!comment) {
      throw new NotFoundException('Yorum bulunamadı');
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<Comment> {
    const comment = await this.findById(id);

    if (comment.commenterId !== userId) {
      throw new ForbiddenException('Bu yorumu düzenleme yetkiniz yok');
    }

    Object.assign(comment, updateCommentDto);
    const updatedComment = await this.commentRepository.save(comment);

    // Kullanıcının ortalama rating'ini güncelle
    await this.updateUserAverageRating(comment.commentedUserId);

    return updatedComment;
  }

  async delete(id: string, userId: string): Promise<void> {
    const comment = await this.findById(id);

    if (comment.commenterId !== userId) {
      throw new ForbiddenException('Bu yorumu silme yetkiniz yok');
    }

    await this.commentRepository.remove(comment);

    // Kullanıcının ortalama rating'ini güncelle
    await this.updateUserAverageRating(comment.commentedUserId);
  }

  async getUserComments(userId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { commentedUserId: userId },
      relations: ['commenter', 'job'],
      order: { createdAt: 'DESC' }
    });
  }

  async getMyComments(userId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { commenterId: userId },
      relations: ['commentedUser', 'job'],
      order: { createdAt: 'DESC' }
    });
  }

  async getJobComments(jobId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { jobId },
      relations: ['commenter', 'commentedUser'],
      order: { createdAt: 'DESC' }
    });
  }

  private async updateUserAverageRating(userId: string): Promise<void> {
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
} 