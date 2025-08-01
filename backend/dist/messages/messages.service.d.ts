import { Repository } from 'typeorm';
import { Message, MessageType } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { AiService } from '../ai/ai.service';
export declare class MessagesService {
    private messageRepository;
    private userRepository;
    private aiService;
    constructor(messageRepository: Repository<Message>, userRepository: Repository<User>, aiService: AiService);
    sendMessage(senderId: string, receiverId: string, content: string, type?: MessageType): Promise<Message>;
    private checkAndGenerateAIResponse;
    private isUserOnline;
    getConversation(userId1: string, userId2: string): Promise<Message[]>;
    getMyConversations(userId: string): Promise<any[]>;
    markAsRead(messageId: string, userId: string): Promise<Message>;
    markConversationAsRead(otherUserId: string, userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
    getMessageStatus(messageId: string): Promise<{
        isDelivered: boolean;
        isRead: boolean;
        readAt?: Date;
    }>;
    getSentMessagesStatus(userId: string): Promise<Message[]>;
    createSampleMessages(userId: string): Promise<Message[]>;
}
