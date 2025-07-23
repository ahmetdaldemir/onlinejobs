import { City } from './city.entity';
export declare class Country {
    id: string;
    name: string;
    code: string;
    phoneCode: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    cities: City[];
}
