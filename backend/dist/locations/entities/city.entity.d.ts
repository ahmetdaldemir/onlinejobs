import { Country } from './country.entity';
import { District } from './district.entity';
export declare class City {
    id: string;
    name: string;
    countryId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    country: Country;
    districts: District[];
}
