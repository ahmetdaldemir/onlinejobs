import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { City } from '../../locations/entities/city.entity';
import { District } from '../../locations/entities/district.entity';
import { Neighborhood } from '../../locations/entities/neighborhood.entity';
import { Country } from '../../locations/entities/country.entity';

@Entity('user_infos')
export class UserInfo {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ nullable: true })
  @ApiProperty()
  name: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @ApiProperty()
  user: User;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  @ApiProperty()
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  @ApiProperty()
  longitude: number;

  @Column({ length: 255, nullable: true })
  @ApiProperty()
  address: string;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: 'countryId' })
  @ApiProperty()
  country: Country;

  @ManyToOne(() => City, { nullable: true })
  @JoinColumn({ name: 'cityId' })
  @ApiProperty()
  city: City;

  @ManyToOne(() => District, { nullable: true })
  @JoinColumn({ name: 'districtId' })
  @ApiProperty()
  district: District;

  @ManyToOne(() => Neighborhood, { nullable: true })
  @JoinColumn({ name: 'neighborhoodId' })
  @ApiProperty()
  neighborhood: Neighborhood;
} 