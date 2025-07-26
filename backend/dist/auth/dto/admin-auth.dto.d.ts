export declare class AdminLoginDto {
    username: string;
    password: string;
}
export declare class AdminRegisterDto {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email?: string;
    isSuperAdmin?: boolean;
}
export declare class AdminResponseDto {
    accessToken: string;
    admin: {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
        email?: string;
        isActive: boolean;
        isSuperAdmin: boolean;
        lastLoginAt?: Date;
    };
    message: string;
    status: string;
    statusCode: number;
}
