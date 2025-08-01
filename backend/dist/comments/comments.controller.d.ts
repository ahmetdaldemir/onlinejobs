import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(createCommentDto: CreateCommentDto, req: any): Promise<import("./entities/comment.entity").Comment>;
    findAll(filters: any): Promise<import("./entities/comment.entity").Comment[]>;
    getUserComments(userId: string): Promise<import("./entities/comment.entity").Comment[]>;
    getMyComments(req: any): Promise<import("./entities/comment.entity").Comment[]>;
    getJobComments(jobId: string): Promise<import("./entities/comment.entity").Comment[]>;
    findById(id: string): Promise<import("./entities/comment.entity").Comment>;
    update(id: string, updateCommentDto: UpdateCommentDto, req: any): Promise<import("./entities/comment.entity").Comment>;
    delete(id: string, req: any): Promise<void>;
}
