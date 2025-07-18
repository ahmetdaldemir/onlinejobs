import { Injectable } from '@nestjs/common';

@Injectable()
export class LocationsService {
  async getCities(): Promise<string[]> {
    // Türkiye'nin büyük şehirleri
    return [
      'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya',
      'Gaziantep', 'Mersin', 'Diyarbakır', 'Samsun', 'Denizli', 'Eskişehir',
      'Trabzon', 'Erzurum', 'Van', 'Kayseri', 'Malatya', 'Elazığ', 'Sivas'
    ];
  }

  async getDistricts(city: string): Promise<string[]> {
    // Şehirlere göre ilçeler (örnek)
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

  async calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): Promise<number> {
    const R = 6371; // Dünya'nın yarıçapı (km)
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI/180);
  }
} 