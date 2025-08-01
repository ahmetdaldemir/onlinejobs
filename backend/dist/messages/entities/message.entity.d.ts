export declare enum MessageType {
    TEXT = "text",
    IMAGE = "image",
    LOCATION = "location"
}
export declare class Message {
    id: string;
    content: string;
    type: MessageType;
    isRead: boolean;
    readAt: Date;
    isAIGenerated: boolean;
    createdAt: Date;
    updatedAt: Date;
    sender: any;
    senderId: string;
    receiver: any;
    receiverId: string;
}
