export declare class RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    userTypes: string[];
    categoryId?: string;
}
export declare class LoginDto {
    phone: string;
    password: string;
}
export declare class CheckPhoneDto {
    phone: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        userTypes: string[];
        status: string;
        isVerified: boolean;
        isOnline: boolean;
        rating: number;
        totalReviews: number;
        profileImage?: string;
        bio?: string;
        category?: {
            id: string;
            name: string;
        };
    };
    message: string;
    status: string;
    statusCode: number;
}
