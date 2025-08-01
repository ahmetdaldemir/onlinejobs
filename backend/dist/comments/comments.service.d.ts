import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
export declare class CommentsService {
    private commentRepository;
    private userRepository;
    private jobRepository;
    constructor(commentRepository: Repository<Comment>, userRepository: Repository<User>, jobRepository: Repository<Job>);
    create(createCommentDto: CreateCommentDto, commenterId: string): Promise<Comment>;
    findAll(filters?: any): Promise<Comment[]>;
    findById(id: string): Promise<Comment>;
    update(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<Comment>;
    delete(id: string, userId: string): Promise<void>;
    getUserComments(userId: string): Promise<Comment[]>;
    getMyComments(userId: string): Promise<Comment[]>;
    getJobComments(jobId: string): Promise<Comment[]>;
    private updateUserAverageRating;
}
