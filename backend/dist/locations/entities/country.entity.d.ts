import { City } from './city.entity';
import { UserInfo } from '../../users/entities/user-info.entity';
export declare class Country {
    id: string;
    name: string;
    code: string;
    phoneCode: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    cities: City[];
    userInfos: UserInfo[];
}
