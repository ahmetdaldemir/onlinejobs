import { Repository } from 'typeorm';
import { Message, MessageType } from './entities/message.entity';
export declare class MessagesService {
    private messageRepository;
    constructor(messageRepository: Repository<Message>);
    sendMessage(senderId: string, receiverId: string, content: string, type?: MessageType): Promise<Message>;
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
