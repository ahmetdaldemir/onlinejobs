import { UserInfo } from './user-info.entity';
import { UserVerification } from './user-verification.entity';
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
    portfolioImages: string[];
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
    categoryIds: string[];
    categories: any[];
    userInfos: UserInfo[];
    verifications: UserVerification[];
    commentsGiven: any[];
    commentsReceived: any[];
}
