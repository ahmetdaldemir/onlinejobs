export declare class LocationsService {
    getCities(): Promise<string[]>;
    getDistricts(city: string): Promise<string[]>;
    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): Promise<number>;
    private toRadians;
}
