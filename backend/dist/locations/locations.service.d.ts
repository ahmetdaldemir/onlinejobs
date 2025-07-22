import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';
import { Neighborhood } from './entities/neighborhood.entity';
export declare class LocationsService {
    private countryRepository;
    private cityRepository;
    private districtRepository;
    private neighborhoodRepository;
    private readonly logger;
    constructor(countryRepository: Repository<Country>, cityRepository: Repository<City>, districtRepository: Repository<District>, neighborhoodRepository: Repository<Neighborhood>);
    scheduledSync(): Promise<void>;
    getCountries(): Promise<Country[]>;
    getCitiesByCountry(countryId: string): Promise<City[]>;
    getDistrictsByCity(cityId: string): Promise<District[]>;
    getNeighborhoodsByDistrict(districtId: string): Promise<Neighborhood[]>;
    private syncCountriesFromAPI;
    private syncCitiesFromAPI;
    private addManualCitiesForCountry;
    private addDistrictsAndNeighborhoodsForCity;
    private addNeighborhoodsForDistrict;
    private addFallbackCountries;
    manualSync(forceSync?: boolean): Promise<{
        message: string;
        syncedCountries: number;
        syncedCities: number;
    }>;
    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): Promise<number>;
    private toRadians;
}
