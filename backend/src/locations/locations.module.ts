import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Country } from './entities/country.entity';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';
import { Neighborhood } from './entities/neighborhood.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country, City, District, Neighborhood]),
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {} 