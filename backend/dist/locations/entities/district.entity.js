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
Object.defineProperty(exports, "__esModule", { value: true });
exports.District = void 0;
const typeorm_1 = require("typeorm");
const city_entity_1 = require("./city.entity");
const neighborhood_entity_1 = require("./neighborhood.entity");
const user_info_entity_1 = require("../../users/entities/user-info.entity");
let District = class District {
};
exports.District = District;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], District.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], District.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'city_id' }),
    __metadata("design:type", String)
], District.prototype, "cityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], District.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], District.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], District.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => city_entity_1.City, city => city.districts),
    (0, typeorm_1.JoinColumn)({ name: 'city_id' }),
    __metadata("design:type", city_entity_1.City)
], District.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => neighborhood_entity_1.Neighborhood, neighborhood => neighborhood.district),
    __metadata("design:type", Array)
], District.prototype, "neighborhoods", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_info_entity_1.UserInfo, userInfo => userInfo.district),
    __metadata("design:type", Array)
], District.prototype, "userInfos", void 0);
exports.District = District = __decorate([
    (0, typeorm_1.Entity)('districts')
], District);
//# sourceMappingURL=district.entity.js.map