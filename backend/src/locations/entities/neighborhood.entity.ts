import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { District } from './district.entity';
import { UserInfo } from '../../users/entities/user-info.entity';

@Entity('neighborhoods')
export class Neighborhood {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'district_id' })
  districtId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => District, district => district.neighborhoods)
  @JoinColumn({ name: 'district_id' })
  district: District;

  @OneToMany(() => UserInfo, userInfo => userInfo.neighborhood)
  userInfos: UserInfo[];
} 