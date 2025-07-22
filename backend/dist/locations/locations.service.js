"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var LocationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const country_entity_1 = require("./entities/country.entity");
const city_entity_1 = require("./entities/city.entity");
const district_entity_1 = require("./entities/district.entity");
const neighborhood_entity_1 = require("./entities/neighborhood.entity");
const axios_1 = require("axios");
let LocationsService = LocationsService_1 = class LocationsService {
    constructor(countryRepository, cityRepository, districtRepository, neighborhoodRepository) {
        this.countryRepository = countryRepository;
        this.cityRepository = cityRepository;
        this.districtRepository = districtRepository;
        this.neighborhoodRepository = neighborhoodRepository;
        this.logger = new common_1.Logger(LocationsService_1.name);
    }
    async scheduledSync() {
        this.logger.log('Starting scheduled sync...');
        try {
            await this.syncCountriesFromAPI(false);
            this.logger.log('Scheduled sync completed successfully');
        }
        catch (error) {
            this.logger.error('Scheduled sync failed:', error.message);
        }
    }
    async getCountries() {
        let countries = await this.countryRepository.find({
            where: { isActive: true },
            order: { name: 'ASC' },
        });
        if (countries.length === 0) {
            this.logger.log('Countries not found in DB, fetching from external API...');
            await this.syncCountriesFromAPI(false);
            countries = await this.countryRepository.find({
                where: { isActive: true },
                order: { name: 'ASC' },
            });
        }
        return countries;
    }
    async getCitiesByCountry(countryId) {
        let cities = await this.cityRepository.find({
            where: {
                countryId,
                isActive: true
            },
            order: { name: 'ASC' },
        });
        if (cities.length === 0) {
            const country = await this.countryRepository.findOne({
                where: { id: countryId }
            });
            if (country) {
                this.logger.log(`Cities not found for ${country.name}, fetching from external API...`);
                await this.syncCitiesFromAPI(country, false);
                cities = await this.cityRepository.find({
                    where: {
                        countryId,
                        isActive: true
                    },
                    order: { name: 'ASC' },
                });
            }
        }
        return cities;
    }
    async getDistrictsByCity(cityId) {
        return this.districtRepository.find({
            where: {
                cityId,
                isActive: true
            },
            order: { name: 'ASC' },
        });
    }
    async getNeighborhoodsByDistrict(districtId) {
        return this.neighborhoodRepository.find({
            where: {
                districtId,
                isActive: true
            },
            order: { name: 'ASC' },
        });
    }
    async syncCountriesFromAPI(forceSync = false) {
        try {
            this.logger.log('Fetching countries from REST Countries API...');
            const response = await axios_1.default.get('https://restcountries.com/v3.1/all?fields=name,cca2,idd');
            const countries = response.data;
            this.logger.log(`Received ${countries.length} countries from API`);
            const countryEntities = countries
                .filter(country => country.name &&
                country.name.common &&
                country.cca2 &&
                country.idd &&
                country.idd.root)
                .map(country => {
                let phoneCode = country.idd.root;
                if (country.idd.suffixes && country.idd.suffixes.length > 0) {
                    phoneCode += country.idd.suffixes[0];
                }
                return {
                    name: country.name.common,
                    code: country.cca2,
                    phoneCode: phoneCode,
                    isActive: true,
                };
            });
            this.logger.log(`Filtered and processed ${countryEntities.length} countries`);
            const existingCountryCodes = await this.countryRepository.find({
                select: ['code']
            });
            const existingCodes = existingCountryCodes.map(c => c.code);
            const newCountries = countryEntities.filter(country => !existingCodes.includes(country.code));
            if (newCountries.length > 0) {
                await this.countryRepository.save(newCountries);
                this.logger.log(`Added ${newCountries.length} new countries`);
            }
            else {
                this.logger.log('No new countries to add');
                return;
            }
        }
        catch (error) {
            this.logger.error('Failed to sync countries from API:', error.message);
            await this.addFallbackCountries();
        }
    }
    async syncCitiesFromAPI(country, forceSync = false) {
        try {
            const existingCities = await this.cityRepository.count({
                where: { countryId: country.id }
            });
            if (existingCities > 0 && !forceSync) {
                this.logger.log(`Cities already exist for ${country.name}, skipping API sync`);
                return;
            }
            this.logger.log(`Fetching cities for ${country.name} (${country.code})...`);
            const geonamesResponse = await axios_1.default.get(`http://api.geonames.org/searchJSON?country=${country.code}&featureClass=P&featureCode=PPLA&maxRows=50&username=ahmetdaldemir`);
            if (geonamesResponse.data && geonamesResponse.data.geonames) {
                const cities = geonamesResponse.data.geonames;
                this.logger.log(`Received ${cities.length} cities for ${country.name}`);
                const cityEntities = cities.map(city => ({
                    name: city.name,
                    countryId: country.id,
                    isActive: true,
                }));
                const savedCities = await this.cityRepository.save(cityEntities);
                this.logger.log(`Synced ${savedCities.length} cities for ${country.name}`);
                for (const city of savedCities) {
                    await this.addDistrictsAndNeighborhoodsForCity(city);
                }
            }
            else {
                await this.addManualCitiesForCountry(country);
            }
        }
        catch (error) {
            this.logger.error(`Failed to sync cities for ${country.name}:`, error.message);
            await this.addManualCitiesForCountry(country);
        }
    }
    async addManualCitiesForCountry(country) {
        const cityMap = {
            'TR': ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Mersin', 'Diyarbakır'],
            'US': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
            'DE': ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'],
            'GB': ['London', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Bradford', 'Edinburgh', 'Liverpool', 'Manchester', 'Bristol'],
            'FR': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
        };
        const cities = cityMap[country.code] || [];
        if (cities.length > 0) {
            const cityEntities = cities.map(cityName => ({
                name: cityName,
                countryId: country.id,
                isActive: true,
            }));
            await this.cityRepository.save(cityEntities);
            this.logger.log(`Added ${cityEntities.length} manual cities for ${country.name}`);
        }
    }
    async addDistrictsAndNeighborhoodsForCity(city) {
        const districtMap = {
            'İstanbul': ['Kadıköy', 'Beşiktaş', 'Şişli', 'Beyoğlu', 'Fatih', 'Üsküdar', 'Bakırköy', 'Pendik', 'Kartal', 'Maltepe'],
            'Ankara': ['Çankaya', 'Keçiören', 'Mamak', 'Yenimahalle', 'Etimesgut', 'Sincan', 'Altındağ', 'Gölbaşı', 'Polatlı', 'Kazan'],
            'İzmir': ['Konak', 'Bornova', 'Karşıyaka', 'Buca', 'Çiğli', 'Bayraklı', 'Gaziemir', 'Karabağlar', 'Narlıdere', 'Urla'],
            'New York': ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'],
            'Los Angeles': ['Downtown', 'Hollywood', 'Venice', 'Santa Monica', 'Beverly Hills'],
            'London': ['Westminster', 'Camden', 'Greenwich', 'Hackney', 'Islington'],
            'Paris': ['1st Arrondissement', '2nd Arrondissement', '3rd Arrondissement', '4th Arrondissement', '5th Arrondissement'],
            'Berlin': ['Mitte', 'Friedrichshain-Kreuzberg', 'Pankow', 'Charlottenburg-Wilmersdorf', 'Spandau'],
        };
        const districts = districtMap[city.name] || [`${city.name} Central`, `${city.name} North`, `${city.name} South`, `${city.name} East`, `${city.name} West`];
        const districtEntities = districts.map(districtName => ({
            name: districtName,
            cityId: city.id,
            isActive: true,
        }));
        const savedDistricts = await this.districtRepository.save(districtEntities);
        this.logger.log(`Added ${savedDistricts.length} districts for ${city.name}`);
        for (const district of savedDistricts) {
            await this.addNeighborhoodsForDistrict(district);
        }
    }
    async addNeighborhoodsForDistrict(district) {
        const neighborhoodMap = {
            'Kadıköy': ['Fenerbahçe', 'Caddebostan', 'Sahrayıcedit', 'Göztepe', 'Eğitim'],
            'Beşiktaş': ['Levent', 'Etiler', 'Bebek', 'Ortaköy', 'Arnavutköy'],
            'Şişli': ['Teşvikiye', 'Nişantaşı', 'Mecidiyeköy', 'Harbiye', 'Maçka'],
            'Çankaya': ['Kızılay', 'Çankaya', 'Bahçelievler', 'Emek', 'Aşağı Ayrancı'],
            'Konak': ['Alsancak', 'Konak', 'Basmane', 'Güzelyalı', 'Bostanlı'],
            'Manhattan': ['Upper East Side', 'Upper West Side', 'Midtown', 'Downtown', 'Harlem'],
            'Westminster': ['Mayfair', 'Soho', 'Covent Garden', 'Belgravia', 'Knightsbridge'],
            'Mitte': ['Alexanderplatz', 'Unter den Linden', 'Museum Island', 'Hackescher Markt', 'Prenzlauer Berg'],
        };
        const neighborhoods = neighborhoodMap[district.name] || [
            `${district.name} Center`,
            `${district.name} North`,
            `${district.name} South`,
            `${district.name} East`,
            `${district.name} West`,
        ];
        const neighborhoodEntities = neighborhoods.map(neighborhoodName => ({
            name: neighborhoodName,
            districtId: district.id,
            isActive: true,
        }));
        await this.neighborhoodRepository.save(neighborhoodEntities);
        this.logger.log(`Added ${neighborhoodEntities.length} neighborhoods for ${district.name}`);
    }
    async addFallbackCountries() {
        try {
            const existingCountries = await this.countryRepository.count();
            if (existingCountries > 0) {
                this.logger.log('Fallback countries already exist, skipping...');
                return;
            }
            const fallbackCountries = [
                { name: 'Türkiye', code: 'TR', phoneCode: '+90' },
                { name: 'United States', code: 'US', phoneCode: '+1' },
                { name: 'Germany', code: 'DE', phoneCode: '+49' },
                { name: 'United Kingdom', code: 'GB', phoneCode: '+44' },
                { name: 'France', code: 'FR', phoneCode: '+33' },
            ];
            const entities = fallbackCountries.map(country => ({
                ...country,
                isActive: true,
            }));
            await this.countryRepository.save(entities);
            this.logger.log('Added fallback countries');
        }
        catch (error) {
            this.logger.error('Failed to add fallback countries:', error.message);
        }
    }
    async manualSync(forceSync = false) {
        this.logger.log('Starting manual sync...');
        try {
            await this.syncCountriesFromAPI(forceSync);
            const countries = await this.countryRepository.find();
            let totalCities = 0;
            for (const country of countries) {
                await this.syncCitiesFromAPI(country, forceSync);
                const cities = await this.cityRepository.find({ where: { countryId: country.id } });
                totalCities += cities.length;
            }
            return {
                message: 'Manual sync completed successfully',
                syncedCountries: countries.length,
                syncedCities: totalCities,
            };
        }
        catch (error) {
            this.logger.error('Manual sync failed:', error.message);
            return {
                message: 'Manual sync failed: ' + error.message,
                syncedCountries: 0,
                syncedCities: 0,
            };
        }
    }
    async calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
};
exports.LocationsService = LocationsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LocationsService.prototype, "scheduledSync", null);
exports.LocationsService = LocationsService = LocationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    __param(1, (0, typeorm_1.InjectRepository)(city_entity_1.City)),
    __param(2, (0, typeorm_1.InjectRepository)(district_entity_1.District)),
    __param(3, (0, typeorm_1.InjectRepository)(neighborhood_entity_1.Neighborhood)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LocationsService);
//# sourceMappingURL=locations.service.js.map