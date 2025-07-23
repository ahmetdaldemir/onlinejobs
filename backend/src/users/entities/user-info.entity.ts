import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

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

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Açıklama' })
  description: string;

  @Column({ length: 100, nullable: true })
  @ApiProperty({ description: 'Mahalle/Cadde/Sokak' })
  neighborhood: string;

  @Column({ length: 50, nullable: true })
  @ApiProperty({ description: 'Bina No' })
  buildingNo: string;

  @Column({ length: 20, nullable: true })
  @ApiProperty({ description: 'Kat' })
  floor: string;

  @Column({ length: 20, nullable: true })
  @ApiProperty({ description: 'Daire No' })
  apartmentNo: string;
} 