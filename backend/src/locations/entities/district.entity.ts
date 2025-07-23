import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { City } from './city.entity';
import { Neighborhood } from './neighborhood.entity';
import { UserInfo } from '../../users/entities/user-info.entity';

@Entity('districts')
export class District {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'city_id' })
  cityId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => City, city => city.districts)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @OneToMany(() => Neighborhood, neighborhood => neighborhood.district)
  neighborhoods: Neighborhood[];

  @OneToMany(() => UserInfo, userInfo => userInfo.district)
  userInfos: UserInfo[];
} 