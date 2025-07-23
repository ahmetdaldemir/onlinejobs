import { User } from './user.entity';
import { City } from '../../locations/entities/city.entity';
import { District } from '../../locations/entities/district.entity';
import { Neighborhood } from '../../locations/entities/neighborhood.entity';
import { Country } from '../../locations/entities/country.entity';
export declare class UserInfo {
    id: string;
    name: string;
    user: User;
    latitude: number;
    longitude: number;
    address: string;
    country: Country;
    city: City;
    district: District;
    neighborhood: Neighborhood;
}
