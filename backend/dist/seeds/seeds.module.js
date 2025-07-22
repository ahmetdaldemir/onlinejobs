"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const seed_service_1 = require("./seed.service");
const category_entity_1 = require("../categories/entities/category.entity");
const country_entity_1 = require("../locations/entities/country.entity");
const city_entity_1 = require("../locations/entities/city.entity");
const district_entity_1 = require("../locations/entities/district.entity");
const neighborhood_entity_1 = require("../locations/entities/neighborhood.entity");
const locations_seed_1 = require("./locations.seed");
let SeedsModule = class SeedsModule {
};
exports.SeedsModule = SeedsModule;
exports.SeedsModule = SeedsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                category_entity_1.Category,
                country_entity_1.Country,
                city_entity_1.City,
                district_entity_1.District,
                neighborhood_entity_1.Neighborhood,
            ]),
        ],
        providers: [seed_service_1.SeedService, locations_seed_1.LocationsSeedService],
        exports: [seed_service_1.SeedService, locations_seed_1.LocationsSeedService],
    })
], SeedsModule);
//# sourceMappingURL=seeds.module.js.map