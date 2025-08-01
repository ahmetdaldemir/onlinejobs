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

@Entity('comments')
@Index(['commenterId'])
@Index(['commentedUserId'])
@Index(['jobId'])
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  commenterId: string; // Yorum yapan kullanıcı

  @Column()
  @ApiProperty()
  commentedUserId: string; // Yorum yapılan kullanıcı

  @Column({ type: 'text' })
  @ApiProperty()
  description: string;

  @Column({ type: 'int', default: 0 })
  @ApiProperty()
  rating: number; // 1-5 arası rating

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  jobId?: string; // Opsiyonel, hangi iş için yorum yapıldığı

  @Column({ default: true })
  @ApiProperty()
  showName: boolean; // Yorum yapan kişinin adının gösterilip gösterilmeyeceği

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  // İlişkiler
  @ManyToOne('User', 'commentsGiven')
  commenter: any; // Yorum yapan kullanıcı

  @ManyToOne('User', 'commentsReceived')
  commentedUser: any; // Yorum yapılan kullanıcı

  @ManyToOne('Job', { nullable: true })
  job: any; // İlgili iş (opsiyonel)
} 