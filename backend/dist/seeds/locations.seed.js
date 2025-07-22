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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsSeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const country_entity_1 = require("../locations/entities/country.entity");
const city_entity_1 = require("../locations/entities/city.entity");
const district_entity_1 = require("../locations/entities/district.entity");
const neighborhood_entity_1 = require("../locations/entities/neighborhood.entity");
let LocationsSeedService = class LocationsSeedService {
    constructor(countryRepository, cityRepository, districtRepository, neighborhoodRepository) {
        this.countryRepository = countryRepository;
        this.cityRepository = cityRepository;
        this.districtRepository = districtRepository;
        this.neighborhoodRepository = neighborhoodRepository;
    }
    async seed() {
        const existingCountries = await this.countryRepository.count();
        if (existingCountries > 0) {
            console.log('Countries already exist, skipping seed...');
            return;
        }
        const turkey = await this.countryRepository.save({
            name: 'Türkiye',
            code: 'TR',
            phoneCode: '+90',
        });
        const usa = await this.countryRepository.save({
            name: 'United States',
            code: 'US',
            phoneCode: '+1',
        });
        const germany = await this.countryRepository.save({
            name: 'Germany',
            code: 'DE',
            phoneCode: '+49',
        });
        const istanbul = await this.cityRepository.save({
            name: 'İstanbul',
            countryId: turkey.id,
        });
        const ankara = await this.cityRepository.save({
            name: 'Ankara',
            countryId: turkey.id,
        });
        const izmir = await this.cityRepository.save({
            name: 'İzmir',
            countryId: turkey.id,
        });
        const kadikoy = await this.districtRepository.save({
            name: 'Kadıköy',
            cityId: istanbul.id,
        });
        const besiktas = await this.districtRepository.save({
            name: 'Beşiktaş',
            cityId: istanbul.id,
        });
        const sisli = await this.districtRepository.save({
            name: 'Şişli',
            cityId: istanbul.id,
        });
        const cankaya = await this.districtRepository.save({
            name: 'Çankaya',
            cityId: ankara.id,
        });
        const kecioren = await this.districtRepository.save({
            name: 'Keçiören',
            cityId: ankara.id,
        });
        const konak = await this.districtRepository.save({
            name: 'Konak',
            cityId: izmir.id,
        });
        const bornova = await this.districtRepository.save({
            name: 'Bornova',
            cityId: izmir.id,
        });
        await this.neighborhoodRepository.save([
            {
                name: 'Fenerbahçe',
                districtId: kadikoy.id,
            },
            {
                name: 'Caddebostan',
                districtId: kadikoy.id,
            },
            {
                name: 'Sahrayıcedit',
                districtId: kadikoy.id,
            },
        ]);
        await this.neighborhoodRepository.save([
            {
                name: 'Levent',
                districtId: besiktas.id,
            },
            {
                name: 'Etiler',
                districtId: besiktas.id,
            },
            {
                name: 'Bebek',
                districtId: besiktas.id,
            },
        ]);
        await this.neighborhoodRepository.save([
            {
                name: 'Teşvikiye',
                districtId: sisli.id,
            },
            {
                name: 'Nişantaşı',
                districtId: sisli.id,
            },
            {
                name: 'Mecidiyeköy',
                districtId: sisli.id,
            },
        ]);
        await this.neighborhoodRepository.save([
            {
                name: 'Kızılay',
                districtId: cankaya.id,
            },
            {
                name: 'Çankaya',
                districtId: cankaya.id,
            },
            {
                name: 'Bahçelievler',
                districtId: cankaya.id,
            },
        ]);
        await this.neighborhoodRepository.save([
            {
                name: 'Sanatoryum',
                districtId: kecioren.id,
            },
            {
                name: 'Aşağı Eğlence',
                districtId: kecioren.id,
            },
            {
                name: 'Yukarı Eğlence',
                districtId: kecioren.id,
            },
        ]);
        await this.neighborhoodRepository.save([
            {
                name: 'Alsancak',
                districtId: konak.id,
            },
            {
                name: 'Konak',
                districtId: konak.id,
            },
            {
                name: 'Basmane',
                districtId: konak.id,
            },
        ]);
        await this.neighborhoodRepository.save([
            {
                name: 'Bornova Merkez',
                districtId: bornova.id,
            },
            {
                name: 'Çiçekliköy',
                districtId: bornova.id,
            },
            {
                name: 'Pınarbaşı',
                districtId: bornova.id,
            },
        ]);
        console.log('Locations seed completed!');
    }
};
exports.LocationsSeedService = LocationsSeedService;
exports.LocationsSeedService = LocationsSeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    __param(1, (0, typeorm_1.InjectRepository)(city_entity_1.City)),
    __param(2, (0, typeorm_1.InjectRepository)(district_entity_1.District)),
    __param(3, (0, typeorm_1.InjectRepository)(neighborhood_entity_1.Neighborhood)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LocationsSeedService);
//# sourceMappingURL=locations.seed.js.map