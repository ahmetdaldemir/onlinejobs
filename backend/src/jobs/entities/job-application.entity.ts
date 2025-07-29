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

export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

@Entity('job_applications')
@Index(['jobId', 'applicantId'], { unique: true })
@Index(['status'])
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  @ApiProperty({ enum: ApplicationStatus })
  status: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  coverLetter: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  proposedPrice: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  estimatedDuration: string;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty()
  proposedStartDate: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  // İlişkiler
  @ManyToOne('Job', 'applications')
  job: any;

  @Column()
  @ApiProperty()
  jobId: string;

  @ManyToOne('User')
  applicant: any;

  @Column()
  @ApiProperty()
  applicantId: string;
} 