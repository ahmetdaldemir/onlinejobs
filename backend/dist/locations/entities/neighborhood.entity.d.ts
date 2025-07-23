import { District } from './district.entity';
import { UserInfo } from '../../users/entities/user-info.entity';
export declare class Neighborhood {
    id: string;
    name: string;
    districtId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    district: District;
    userInfos: UserInfo[];
}
