import { Repository } from 'typeorm';
import { Country } from '../locations/entities/country.entity';
import { City } from '../locations/entities/city.entity';
import { District } from '../locations/entities/district.entity';
import { Neighborhood } from '../locations/entities/neighborhood.entity';
export declare class LocationsSeedService {
    private countryRepository;
    private cityRepository;
    private districtRepository;
    private neighborhoodRepository;
    constructor(countryRepository: Repository<Country>, cityRepository: Repository<City>, districtRepository: Repository<District>, neighborhoodRepository: Repository<Neighborhood>);
    seed(): Promise<void>;
}
