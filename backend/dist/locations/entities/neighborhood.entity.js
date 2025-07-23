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
exports.Neighborhood = void 0;
const typeorm_1 = require("typeorm");
const district_entity_1 = require("./district.entity");
const user_info_entity_1 = require("../../users/entities/user-info.entity");
let Neighborhood = class Neighborhood {
};
exports.Neighborhood = Neighborhood;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Neighborhood.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Neighborhood.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'district_id' }),
    __metadata("design:type", String)
], Neighborhood.prototype, "districtId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Neighborhood.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Neighborhood.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Neighborhood.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => district_entity_1.District, district => district.neighborhoods),
    (0, typeorm_1.JoinColumn)({ name: 'district_id' }),
    __metadata("design:type", district_entity_1.District)
], Neighborhood.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_info_entity_1.UserInfo, userInfo => userInfo.neighborhood),
    __metadata("design:type", Array)
], Neighborhood.prototype, "userInfos", void 0);
exports.Neighborhood = Neighborhood = __decorate([
    (0, typeorm_1.Entity)('neighborhoods')
], Neighborhood);
//# sourceMappingURL=neighborhood.entity.js.map