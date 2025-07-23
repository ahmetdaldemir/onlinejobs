import { UserInfo } from './user-info.entity';
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    userType: string;
    status: UserStatus;
    bio: string;
    profileImage: string;
    isVerified: boolean;
    isOnline: boolean;
    rating: number;
    totalReviews: number;
    createdAt: Date;
    updatedAt: Date;
    lastSeen: Date;
    jobs: any[];
    sentMessages: any[];
    receivedMessages: any[];
    category: any;
    userInfos: UserInfo[];
}
