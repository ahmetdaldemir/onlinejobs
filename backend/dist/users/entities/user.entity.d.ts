export declare enum UserType {
    JOB_SEEKER = "job_seeker",
    EMPLOYER = "employer"
}
export declare enum UserRole {
    JOB_SEEKER = "job_seeker",
    EMPLOYER = "employer",
    BOTH = "both"
}
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
    userTypes: string[];
    status: UserStatus;
    bio: string;
    profileImage: string;
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    district: string;
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
}
