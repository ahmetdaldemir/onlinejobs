"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
let LocationsService = class LocationsService {
    async getCities() {
        return [
            'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya',
            'Gaziantep', 'Mersin', 'Diyarbakır', 'Samsun', 'Denizli', 'Eskişehir',
            'Trabzon', 'Erzurum', 'Van', 'Kayseri', 'Malatya', 'Elazığ', 'Sivas'
        ];
    }
    async getDistricts(city) {
        const districtsMap = {
            'İstanbul': [
                'Kadıköy', 'Beşiktaş', 'Şişli', 'Beyoğlu', 'Fatih', 'Üsküdar',
                'Bakırköy', 'Pendik', 'Kartal', 'Maltepe', 'Ataşehir', 'Sarıyer'
            ],
            'Ankara': [
                'Çankaya', 'Keçiören', 'Mamak', 'Yenimahalle', 'Etimesgut',
                'Sincan', 'Altındağ', 'Gölbaşı', 'Polatlı', 'Kazan'
            ],
            'İzmir': [
                'Konak', 'Bornova', 'Karşıyaka', 'Buca', 'Çiğli', 'Bayraklı',
                'Gaziemir', 'Karabağlar', 'Narlıdere', 'Urla'
            ]
        };
        return districtsMap[city] || [];
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
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)()
], LocationsService);
//# sourceMappingURL=locations.service.js.map