import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Country } from './entities/country.entity';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';
import { Neighborhood } from './entities/neighborhood.entity';
import axios from 'axios';

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);

  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(Neighborhood)
    private neighborhoodRepository: Repository<Neighborhood>,
  ) {}

  // Her gün gece 2'de otomatik sync
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async scheduledSync() {
    this.logger.log('Starting scheduled sync...');
    try {
      await this.syncCountriesFromAPI(false); // forceSync = false
      this.logger.log('Scheduled sync completed successfully');
    } catch (error) {
      this.logger.error('Scheduled sync failed:', error.message);
    }
  }

  async getCountries(): Promise<Country[]> {
    // Önce DB'den kontrol et
    let countries = await this.countryRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });

    // Eğer DB'de veri yoksa external API'den çek
    if (countries.length === 0) {
      this.logger.log('Countries not found in DB, fetching from external API...');
      await this.syncCountriesFromAPI(false); // forceSync = false
      countries = await this.countryRepository.find({
        where: { isActive: true },
        order: { name: 'ASC' },
      });
    }

    return countries;
  }

  async getCitiesByCountry(countryId: string): Promise<City[]> {
    let cities = await this.cityRepository.find({
      where: { 
        countryId,
        isActive: true 
      },
      order: { name: 'ASC' },
    });

    // Eğer şehir yoksa, ülkeyi bul ve şehirleri çek
    if (cities.length === 0) {
      const country = await this.countryRepository.findOne({
        where: { id: countryId }
      });
      
      if (country) {
        this.logger.log(`Cities not found for ${country.name}, fetching from external API...`);
        await this.syncCitiesFromAPI(country, false); // forceSync = false
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

  async getDistrictsByCity(cityId: string): Promise<District[]> {
    return this.districtRepository.find({
      where: { 
        cityId,
        isActive: true 
      },
      order: { name: 'ASC' },
    });
  }

  async getNeighborhoodsByDistrict(districtId: string): Promise<Neighborhood[]> {
    return this.neighborhoodRepository.find({
      where: { 
        districtId,
        isActive: true 
      },
      order: { name: 'ASC' },
    });
  }

  private async syncCountriesFromAPI(forceSync: boolean = false): Promise<void> {
    try {
      // Önce mevcut ülkeleri kontrol et
     
      this.logger.log('Fetching countries from REST Countries API...');
      
      // REST Countries API'den ülkeleri çek
      const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,cca2,idd');
      const countries = response.data;

      this.logger.log(`Received ${countries.length} countries from API`);

      const countryEntities = countries
        .filter(country => 
          country.name && 
          country.name.common && 
          country.cca2 && 
          country.idd && 
          country.idd.root
        )
        .map(country => {
          // Phone code'u düzgün formatla
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
      
      const newCountries = countryEntities.filter(country => 
        !existingCodes.includes(country.code)
      );
      
      if (newCountries.length > 0) {
        await this.countryRepository.save(newCountries);
        this.logger.log(`Added ${newCountries.length} new countries`);
      } else {
        this.logger.log('No new countries to add');
        return;
      }
 
    } catch (error) {
      this.logger.error('Failed to sync countries from API:', error.message);
      // Fallback: Temel ülkeleri ekle
      await this.addFallbackCountries();
    }
  }

  private async syncCitiesFromAPI(country: Country, forceSync: boolean = false): Promise<void> {
    try {
      // Önce mevcut şehirleri kontrol et
      const existingCities = await this.cityRepository.count({
        where: { countryId: country.id }
      });
      
      if (existingCities > 0 && !forceSync) {
        this.logger.log(`Cities already exist for ${country.name}, skipping API sync`);
        return;
      }

      this.logger.log(`Fetching cities for ${country.name} (${country.code})...`);

      // GeoNames API'den şehirleri çek
      const geonamesResponse = await axios.get(
        `http://api.geonames.org/searchJSON?country=${country.code}&featureClass=P&featureCode=PPLA&maxRows=50&username=ahmetdaldemir`
      );

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

        // Her şehir için district ve neighborhood'lar ekle
        for (const city of savedCities) {
          await this.addDistrictsAndNeighborhoodsForCity(city);
        }
      } else {
        // GeoNames API çalışmazsa, manuel şehirler ekle
        await this.addManualCitiesForCountry(country);
      }
    } catch (error) {
      this.logger.error(`Failed to sync cities for ${country.name}:`, error.message);
      // Fallback: Manuel şehirler ekle
      await this.addManualCitiesForCountry(country);
    }
  }

  private async addManualCitiesForCountry(country: Country): Promise<void> {
    // Her ülke için manuel şehir listesi
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

  private async addDistrictsAndNeighborhoodsForCity(city: City): Promise<void> {
    // Her şehir için manuel district listesi
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

    // Her district için neighborhood'lar ekle
    for (const district of savedDistricts) {
      await this.addNeighborhoodsForDistrict(district);
    }
  }

  private async addNeighborhoodsForDistrict(district: District): Promise<void> {
    // Her district için manuel neighborhood listesi
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

  private async addFallbackCountries(): Promise<void> {
    try {
      // Önce mevcut ülkeleri kontrol et
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
    } catch (error) {
      this.logger.error('Failed to add fallback countries:', error.message);
    }
  }

  // Manuel sync endpoint'i (admin için)
  async manualSync(forceSync: boolean = false): Promise<{ message: string; syncedCountries: number; syncedCities: number }> {
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
    } catch (error) {
      this.logger.error('Manual sync failed:', error.message);
      return {
        message: 'Manual sync failed: ' + error.message,
        syncedCountries: 0,
        syncedCities: 0,
      };
    }
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