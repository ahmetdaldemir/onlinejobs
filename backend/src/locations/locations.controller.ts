import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LocationsService } from './locations.service';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('cities')
  @ApiOperation({ summary: 'Şehirleri listele' })
  @ApiResponse({ status: 200, description: 'Şehirler listelendi' })
  async getCities() {
    return this.locationsService.getCities();
  }

  @Get('districts')
  @ApiOperation({ summary: 'İlçeleri listele' })
  @ApiQuery({ name: 'city', required: true })
  @ApiResponse({ status: 200, description: 'İlçeler listelendi' })
  async getDistricts(@Query('city') city: string) {
    return this.locationsService.getDistricts(city);
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