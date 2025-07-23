import { City } from './city.entity';
import { Neighborhood } from './neighborhood.entity';
import { UserInfo } from '../../users/entities/user-info.entity';
export declare class District {
    id: string;
    name: string;
    cityId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    city: City;
    neighborhoods: Neighborhood[];
    userInfos: UserInfo[];
}
