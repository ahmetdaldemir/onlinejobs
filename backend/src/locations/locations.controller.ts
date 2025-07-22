import { Controller, Get, Query, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { Country } from './entities/country.entity';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';
import { Neighborhood } from './entities/neighborhood.entity';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('countries')
  @ApiOperation({ summary: 'Ülkeleri listele' })
  @ApiResponse({ status: 200, description: 'Ülkeler listelendi', type: [Country] })
  async getCountries(): Promise<Country[]> {
    return this.locationsService.getCountries();
  }

  @Get('cities')
  @ApiOperation({ summary: 'Ülkeye göre şehirleri listele' })
  @ApiQuery({ name: 'countryId', required: true, description: 'Ülke ID' })
  @ApiResponse({ status: 200, description: 'Şehirler listelendi', type: [City] })
  async getCitiesByCountry(@Query('countryId') countryId: string): Promise<City[]> {
    return this.locationsService.getCitiesByCountry(countryId);
  }

  @Get('districts')
  @ApiOperation({ summary: 'Şehre göre ilçeleri listele' })
  @ApiQuery({ name: 'cityId', required: true, description: 'Şehir ID' })
  @ApiResponse({ status: 200, description: 'İlçeler listelendi', type: [District] })
  async getDistrictsByCity(@Query('cityId') cityId: string): Promise<District[]> {
    return this.locationsService.getDistrictsByCity(cityId);
  }

  @Get('neighborhoods')
  @ApiOperation({ summary: 'İlçeye göre mahalleleri listele' })
  @ApiQuery({ name: 'districtId', required: true, description: 'İlçe ID' })
  @ApiResponse({ status: 200, description: 'Mahalleler listelendi', type: [Neighborhood] })
  async getNeighborhoodsByDistrict(@Query('districtId') districtId: string): Promise<Neighborhood[]> {
    return this.locationsService.getNeighborhoodsByDistrict(districtId);
  }

  @Post('sync')
  @ApiOperation({ summary: 'External API\'den verileri senkronize et (Admin)' })
  @ApiQuery({ name: 'force', required: false, type: Boolean, description: 'Force sync - mevcut verileri sil ve yeniden ekle' })
  @ApiResponse({ status: 200, description: 'Senkronizasyon tamamlandı' })
  async syncFromExternalAPI(@Query('force') force: boolean = false) {
    return this.locationsService.manualSync(force);
  }

  @Get('distance')
  @ApiOperation({ summary: 'İki nokta arası mesafe hesapla' })
  @ApiQuery({ name: 'lat1', required: true, type: Number })
  @ApiQuery({ name: 'lon1', required: true, type: Number })
  @ApiQuery({ name: 'lat2', required: true, type: Number })
  @ApiQuery({ name: 'lon2', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Mesafe hesaplandı' })
  async calculateDistance(
    @Query('lat1') lat1: number,
    @Query('lon1') lon1: number,
    @Query('lat2') lat2: number,
    @Query('lon2') lon2: number,
  ) {
    const distance = await this.locationsService.calculateDistance(lat1, lon1, lat2, lon2);
    return { distance: Math.round(distance * 100) / 100 }; // 2 ondalık basamak
  }
} 