export declare class RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    userType: string;
    categoryId?: string;
}
export declare class LoginDto {
    phone: string;
    password: string;
    userType: string;
}
export declare class CheckPhoneDto {
    phone: string;
    userType: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        userType: string;
        status: string;
        isVerified: boolean;
        isOnline: boolean;
        rating: number;
        totalReviews: number;
        profileImage?: string;
        bio?: string;
        userInfos?: {
            id: string;
            name: string;
            latitude?: number;
            longitude?: number;
            address?: string;
            neighborhood?: string;
            buildingNo?: string;
            floor?: string;
            apartmentNo?: string;
            description?: string;
        }[];
        categories?: {
            id: string;
            name: string;
        }[];
    };
    message: string;
    status: string;
    statusCode: number;
}
