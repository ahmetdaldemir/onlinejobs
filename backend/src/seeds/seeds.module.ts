import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Category } from '../categories/entities/category.entity';
import { Country } from '../locations/entities/country.entity';
import { City } from '../locations/entities/city.entity';
import { District } from '../locations/entities/district.entity';
import { Neighborhood } from '../locations/entities/neighborhood.entity';
import { LocationsSeedService } from './locations.seed';
import { User } from '../users/entities/user.entity';
import { UsersSeedService } from './users.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Country,
      City,
      District,
      Neighborhood,
      User,
    ]),
  ],
  providers: [SeedService, LocationsSeedService, UsersSeedService],
  exports: [SeedService, LocationsSeedService, UsersSeedService],
})
export class SeedsModule {} 