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

export enum JobPriority {
  URGENT = 'urgent',        // Acil
  IMMEDIATE = 'immediate',  // Hemen
  SCHEDULED = 'scheduled',  // İleri zamanlı
  NORMAL = 'normal',        // Normal
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

  @Column({
    type: 'enum',
    enum: JobPriority,
    default: JobPriority.NORMAL,
  })
  @ApiProperty({ 
    enum: JobPriority, 
    description: 'İş önceliği: Acil, Hemen, İleri zamanlı, Normal',
    default: JobPriority.NORMAL
  })
  priority: JobPriority;

  @Column({ type: 'simple-array', nullable: true })
  @ApiProperty({ type: [String], description: 'İş ilanı resimleri (URL\'ler)' })
  jobImages: string[];

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