import { District } from './district.entity';
export declare class Neighborhood {
    id: string;
    name: string;
    districtId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    district: District;
}
