import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum JobStatus {
  OPEN = 'open',
  CANCELLED = 'cancelled',
}

 
 
@Entity('jobs')
@Index(['status'])
@Index(['categoryId'])
@Index(['employerId'])
export class Job {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ length: 255 })
  @ApiProperty()
  title: string;

  @Column({ type: 'text' })
  @ApiProperty()
  description: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.OPEN,
  })
  @ApiProperty({ enum: JobStatus })
  status: JobStatus;

 

  @Column({ nullable: true })
  @ApiProperty()
  budget: string;
 

  @ManyToOne('UserInfo', { nullable: true })
  userInfo: any;

  @Column({ nullable: true })
  @ApiProperty()
  userInfoId: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  scheduledDate: Date;

  @Column({ type: 'time', nullable: true })
  @ApiProperty()
  scheduledTime: string;

  @Column({ default: false })
  @ApiProperty()
  isUrgent: boolean;

  @Column({ default: 0 })
  @ApiProperty()
  viewCount: number;

  @Column({ default: 0 })
  @ApiProperty()
  applicationCount: number;

  @Column({ default: false })
  @ApiProperty({ description: 'Admin tarafından manuel olarak öne çıkarılan işler' })
  isFeatured: boolean;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Sistem tarafından hesaplanan öne çıkarma skoru' })
  featuredScore: number;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: 'Öne çıkarılma tarihi' })
  featuredAt: Date;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Öne çıkarılma sebebi' })
  featuredReason: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  // İlişkiler
  @ManyToOne('User', 'jobs')
  employer: any;

  @Column()
  @ApiProperty()
  employerId: string;

  @ManyToOne('Category', { nullable: true })
  category: any;

  @Column({ nullable: true })
  @ApiProperty()
  categoryId: string;

  @OneToMany('JobApplication', 'job')
  applications: any[];

  @OneToMany('Comment', 'job')
  comments: any[]; // İşe ait yorumlar
} 