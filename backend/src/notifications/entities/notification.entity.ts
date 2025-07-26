import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum NotificationType {
  JOB_CREATED = 'job_created',
  JOB_UPDATED = 'job_updated',
  JOB_CANCELLED = 'job_cancelled',
  APPLICATION_RECEIVED = 'application_received',
  APPLICATION_ACCEPTED = 'application_accepted',
  APPLICATION_REJECTED = 'application_rejected',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
}

@Entity('notifications')
@Index(['userId', 'status'])
@Index(['type'])
@Index(['createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  @ApiProperty({ enum: NotificationType })
  type: NotificationType;

  @Column({ length: 255 })
  @ApiProperty()
  title: string;

  @Column({ type: 'text' })
  @ApiProperty()
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD,
  })
  @ApiProperty({ enum: NotificationStatus })
  status: NotificationStatus;

  @Column({ type: 'json', nullable: true })
  @ApiProperty()
  data: any;

  @Column({ nullable: true })
  @ApiProperty()
  jobId: string;

  @Column({ nullable: true })
  @ApiProperty()
  employerId: string;

  @Column({ nullable: true })
  @ApiProperty()
  workerId: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  // İlişkiler
  @ManyToOne('User')
  user: any;

  @Column()
  @ApiProperty()
  userId: string;
} 