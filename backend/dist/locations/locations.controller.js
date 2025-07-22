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
exports.LocationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const locations_service_1 = require("./locations.service");
const country_entity_1 = require("./entities/country.entity");
const city_entity_1 = require("./entities/city.entity");
const district_entity_1 = require("./entities/district.entity");
const neighborhood_entity_1 = require("./entities/neighborhood.entity");
let LocationsController = class LocationsController {
    constructor(locationsService) {
        this.locationsService = locationsService;
    }
    async getCountries() {
        return this.locationsService.getCountries();
    }
    async getCitiesByCountry(countryId) {
        return this.locationsService.getCitiesByCountry(countryId);
    }
    async getDistrictsByCity(cityId) {
        return this.locationsService.getDistrictsByCity(cityId);
    }
    async getNeighborhoodsByDistrict(districtId) {
        return this.locationsService.getNeighborhoodsByDistrict(districtId);
    }
    async syncFromExternalAPI(force = false) {
        return this.locationsService.manualSync(force);
    }
    async calculateDistance(lat1, lon1, lat2, lon2) {
        const distance = await this.locationsService.calculateDistance(lat1, lon1, lat2, lon2);
        return { distance: Math.round(distance * 100) / 100 };
    }
};
exports.LocationsController = LocationsController;
__decorate([
    (0, common_1.Get)('countries'),
    (0, swagger_1.ApiOperation)({ summary: 'Ülkeleri listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ülkeler listelendi', type: [country_entity_1.Country] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getCountries", null);
__decorate([
    (0, common_1.Get)('cities'),
    (0, swagger_1.ApiOperation)({ summary: 'Ülkeye göre şehirleri listele' }),
    (0, swagger_1.ApiQuery)({ name: 'countryId', required: true, description: 'Ülke ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Şehirler listelendi', type: [city_entity_1.City] }),
    __param(0, (0, common_1.Query)('countryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getCitiesByCountry", null);
__decorate([
    (0, common_1.Get)('districts'),
    (0, swagger_1.ApiOperation)({ summary: 'Şehre göre ilçeleri listele' }),
    (0, swagger_1.ApiQuery)({ name: 'cityId', required: true, description: 'Şehir ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'İlçeler listelendi', type: [district_entity_1.District] }),
    __param(0, (0, common_1.Query)('cityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getDistrictsByCity", null);
__decorate([
    (0, common_1.Get)('neighborhoods'),
    (0, swagger_1.ApiOperation)({ summary: 'İlçeye göre mahalleleri listele' }),
    (0, swagger_1.ApiQuery)({ name: 'districtId', required: true, description: 'İlçe ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mahalleler listelendi', type: [neighborhood_entity_1.Neighborhood] }),
    __param(0, (0, common_1.Query)('districtId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getNeighborhoodsByDistrict", null);
__decorate([
    (0, common_1.Post)('sync'),
    (0, swagger_1.ApiOperation)({ summary: 'External API\'den verileri senkronize et (Admin)' }),
    (0, swagger_1.ApiQuery)({ name: 'force', required: false, type: Boolean, description: 'Force sync - mevcut verileri sil ve yeniden ekle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Senkronizasyon tamamlandı' }),
    __param(0, (0, common_1.Query)('force')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "syncFromExternalAPI", null);
__decorate([
    (0, common_1.Get)('distance'),
    (0, swagger_1.ApiOperation)({ summary: 'İki nokta arası mesafe hesapla' }),
    (0, swagger_1.ApiQuery)({ name: 'lat1', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'lon1', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'lat2', required: true, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'lon2', required: true, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mesafe hesaplandı' }),
    __param(0, (0, common_1.Query)('lat1')),
    __param(1, (0, common_1.Query)('lon1')),
    __param(2, (0, common_1.Query)('lat2')),
    __param(3, (0, common_1.Query)('lon2')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "calculateDistance", null);
exports.LocationsController = LocationsController = __decorate([
    (0, swagger_1.ApiTags)('Locations'),
    (0, common_1.Controller)('locations'),
    __metadata("design:paramtypes", [locations_service_1.LocationsService])
], LocationsController);
//# sourceMappingURL=locations.controller.js.map