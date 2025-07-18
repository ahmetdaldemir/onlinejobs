import { LocationsService } from './locations.service';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    getCities(): Promise<string[]>;
    getDistricts(city: string): Promise<string[]>;
    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): Promise<{
        distance: number;
    }>;
}
