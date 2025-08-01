import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { UsersService } from '../users/users.service';
import { AiService } from '../ai/ai.service';
import { JwtService } from '@nestjs/jwt';
export declare class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly messagesService;
    private readonly usersService;
    private readonly aiService;
    private readonly jwtService;
    server: Server;
    private connectedUsers;
    constructor(messagesService: MessagesService, usersService: UsersService, aiService: AiService, jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleSendMessage(data: {
        receiverId: string;
        content: string;
        type?: string;
    }, client: Socket): Promise<void>;
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
    handleGetOnlineUsers(client: Socket): Promise<void>;
    handleGetUserStatus(data: {
        userId: string;
    }, client: Socket): Promise<void>;
    handleSubscribeUserStatus(data: {
        userId: string;
    }, client: Socket): Promise<void>;
    handleUnsubscribeUserStatus(data: {
        userId: string;
    }, client: Socket): Promise<void>;
    broadcastUserStatusChange(userId: string, isOnline: boolean): Promise<void>;
}
