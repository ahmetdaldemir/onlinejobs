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
let LocationsController = class LocationsController {
    constructor(locationsService) {
        this.locationsService = locationsService;
    }
    async getCities() {
        return this.locationsService.getCities();
    }
    async getDistricts(city) {
        return this.locationsService.getDistricts(city);
    }
    async calculateDistance(lat1, lon1, lat2, lon2) {
        const distance = await this.locationsService.calculateDistance(lat1, lon1, lat2, lon2);
        return { distance: Math.round(distance * 100) / 100 };
    }
};
exports.LocationsController = LocationsController;
__decorate([
    (0, common_1.Get)('cities'),
    (0, swagger_1.ApiOperation)({ summary: 'Şehirleri listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Şehirler listelendi' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getCities", null);
__decorate([
    (0, common_1.Get)('districts'),
    (0, swagger_1.ApiOperation)({ summary: 'İlçeleri listele' }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'İlçeler listelendi' }),
    __param(0, (0, common_1.Query)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getDistricts", null);
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