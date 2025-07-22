import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export enum UserType {
  JOB_SEEKER = 'job_seeker',
  EMPLOYER = 'employer',
}

export enum UserRole {
  JOB_SEEKER = 'job_seeker',
  EMPLOYER = 'employer',
  BOTH = 'both', // Hem iş arayan hem işveren
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['phone'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ length: 100 })
  @ApiProperty()
  firstName: string;

  @Column({ length: 100 })
  @ApiProperty()
  lastName: string;

  @Column({ length: 255, unique: true })
  @IsOptional()
  email: string;

  @Column({ length: 20, unique: true })
  @ApiProperty()
  phone: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: [UserType.JOB_SEEKER],
  })
  @ApiProperty({ type: [String], description: 'Kullanıcı tipleri: job_seeker, employer, both' })
  userTypes: string[];

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  bio: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  profileImage: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  @ApiProperty()
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  @ApiProperty()
  longitude: number;

  @Column({ length: 255, nullable: true })
  @ApiProperty()
  address: string;

  @Column({ length: 100, nullable: true })
  @ApiProperty()
  city: string;

  @Column({ length: 100, nullable: true })
  @ApiProperty()
  district: string;

  @Column({ default: false })
  @ApiProperty()
  isVerified: boolean;

  @Column({ default: false })
  @ApiProperty()
  isOnline: boolean;

  @Column({ default: 0 })
  @ApiProperty()
  rating: number;

  @Column({ default: 0 })
  @ApiProperty()
  totalReviews: number;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @Column({ nullable: true })
  @ApiProperty()
  lastSeen: Date;

  // İlişkiler
  @OneToMany('Job', 'employer')
  jobs: any[];

  @OneToMany('Message', 'sender')
  sentMessages: any[];

  @OneToMany('Message', 'receiver')
  receivedMessages: any[];

  @ManyToOne('Category', 'users', { nullable: true })
  category: any;
} 