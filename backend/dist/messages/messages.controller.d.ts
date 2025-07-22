import { MessagesService } from './messages.service';
import { MessageType } from './entities/message.entity';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    sendMessage(sendMessageDto: {
        receiverId: string;
        content: string;
        type?: MessageType;
    }, req: any): Promise<import("./entities/message.entity").Message>;
    getMyConversations(req: any): Promise<any[]>;
    getConversation(otherUserId: string, req: any): Promise<import("./entities/message.entity").Message[]>;
    markAsRead(messageId: string, req: any): Promise<import("./entities/message.entity").Message>;
    markConversationAsRead(otherUserId: string, req: any): Promise<void>;
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
    getMessageStatus(messageId: string): Promise<{
        isDelivered: boolean;
        isRead: boolean;
        readAt?: Date;
    }>;
    getSentMessagesStatus(req: any): Promise<import("./entities/message.entity").Message[]>;
}
