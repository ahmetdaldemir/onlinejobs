import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../locations/entities/country.entity';
import { City } from '../locations/entities/city.entity';
import { District } from '../locations/entities/district.entity';
import { Neighborhood } from '../locations/entities/neighborhood.entity';

@Injectable()
export class LocationsSeedService {
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

  async seed() {
    // Önce mevcut verileri kontrol et
    const existingCountries = await this.countryRepository.count();
    if (existingCountries > 0) {
      console.log('Countries already exist, skipping seed...');
      return;
    }

    // Ülkeleri oluştur
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

    // Türkiye şehirleri
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

    // İstanbul ilçeleri
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

    // Ankara ilçeleri
    const cankaya = await this.districtRepository.save({
      name: 'Çankaya',
      cityId: ankara.id,
    });

    const kecioren = await this.districtRepository.save({
      name: 'Keçiören',
      cityId: ankara.id,
    });

    // İzmir ilçeleri
    const konak = await this.districtRepository.save({
      name: 'Konak',
      cityId: izmir.id,
    });

    const bornova = await this.districtRepository.save({
      name: 'Bornova',
      cityId: izmir.id,
    });

    // Kadıköy mahalleleri
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

    // Beşiktaş mahalleleri
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

    // Şişli mahalleleri
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

    // Çankaya mahalleleri
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

    // Keçiören mahalleleri
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

    // Konak mahalleleri
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

    // Bornova mahalleleri
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
} 