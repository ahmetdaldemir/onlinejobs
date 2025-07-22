import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { UsersService } from '../users/users.service';
export declare class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly messagesService;
    private readonly usersService;
    server: Server;
    private connectedUsers;
    private connectionCount;
    constructor(messagesService: MessagesService, usersService: UsersService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleSendMessage(data: {
        receiverId: string;
        content: string;
        type?: string;
    }, client: Socket): Promise<{
        success: boolean;
        messageId: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        messageId?: undefined;
    }>;
    handleJoinConversation(data: {
        otherUserId: string;
    }, client: Socket): Promise<void>;
    handleLeaveConversation(data: {
        otherUserId: string;
    }, client: Socket): Promise<void>;
    handleTyping(data: {
        receiverId: string;
        isTyping: boolean;
    }, client: Socket): Promise<void>;
    handleReadMessages(data: {
        senderId: string;
    }, client: Socket): Promise<void>;
    handleMarkMessageRead(data: {
        messageId: string;
    }, client: Socket): Promise<void>;
    private getConversationRoomName;
    sendMessageToUser(userId: string, event: string, data: any): void;
}
