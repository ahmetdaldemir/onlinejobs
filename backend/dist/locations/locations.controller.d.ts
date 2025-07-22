import { LocationsService } from './locations.service';
import { Country } from './entities/country.entity';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';
import { Neighborhood } from './entities/neighborhood.entity';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    getCountries(): Promise<Country[]>;
    getCitiesByCountry(countryId: string): Promise<City[]>;
    getDistrictsByCity(cityId: string): Promise<District[]>;
    getNeighborhoodsByDistrict(districtId: string): Promise<Neighborhood[]>;
    syncFromExternalAPI(force?: boolean): Promise<{
        message: string;
        syncedCountries: number;
        syncedCities: number;
    }>;
    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): Promise<{
        distance: number;
    }>;
}
