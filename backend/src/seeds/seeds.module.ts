import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { LocationsSeedService } from './locations.seed';
import { UsersSeedService } from './users.seed';
import { UserInfoSeedService } from './user-info.seed';
import { AdminSeedService } from './admin.seed';
import { Category } from '../categories/entities/category.entity';
import { Country } from '../locations/entities/country.entity';
import { City } from '../locations/entities/city.entity';
import { District } from '../locations/entities/district.entity';
import { Neighborhood } from '../locations/entities/neighborhood.entity';
import { User } from '../users/entities/user.entity';
import { UserInfo } from '../users/entities/user-info.entity';
import { Admin } from '../auth/entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Country,
      City,
      District,
      Neighborhood,
      User,
      UserInfo,
      Admin,
    ]),
  ],
  providers: [
    SeedService,
    LocationsSeedService,
    UsersSeedService,
    UserInfoSeedService,
    AdminSeedService,
  ],
  exports: [
    SeedService,
    LocationsSeedService,
    UsersSeedService,
    UserInfoSeedService,
    AdminSeedService,
  ],
})
export class SeedsModule {} 