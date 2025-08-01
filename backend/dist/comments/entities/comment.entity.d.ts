export declare class Comment {
    id: string;
    commenterId: string;
    commentedUserId: string;
    description: string;
    rating: number;
    jobId?: string;
    showName: boolean;
    createdAt: Date;
    updatedAt: Date;
    commenter: any;
    commentedUser: any;
    job: any;
}
