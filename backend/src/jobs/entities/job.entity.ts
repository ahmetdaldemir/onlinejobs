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
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum JobType {
  URGENT = 'urgent',
  NORMAL = 'normal',
  SCHEDULED = 'scheduled',
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

  @Column({
    type: 'enum',
    enum: JobType,
    default: JobType.NORMAL,
  })
  @ApiProperty({ enum: JobType })
  jobType: JobType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @ApiProperty()
  budget: number;

  @Column({ length: 255, nullable: true })
  @ApiProperty()
  location: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  @ApiProperty()
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  @ApiProperty()
  longitude: number;

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
} 