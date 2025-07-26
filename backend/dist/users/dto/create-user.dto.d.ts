export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    password: string;
    userType: string;
    bio?: string;
    profileImage?: string;
    userInfo?: {
        address?: string;
        neighborhood?: string;
        buildingNo?: string;
        floor?: string;
        apartmentNo?: string;
        description?: string;
        latitude?: number;
        longitude?: number;
    };
}
