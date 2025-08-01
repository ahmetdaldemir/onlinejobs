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

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  LOCATION = 'location',
}

@Entity('messages')
@Index(['senderId', 'receiverId'])
@Index(['createdAt'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'text' })
  @ApiProperty()
  content: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  @ApiProperty({ enum: MessageType })
  type: MessageType;

  @Column({ default: false })
  @ApiProperty()
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty()
  readAt: Date;

  @Column({ default: false })
  @ApiProperty()
  isAIGenerated: boolean;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  // İlişkiler
  @ManyToOne('User', 'sentMessages')
  sender: any;

  @Column()
  @ApiProperty()
  senderId: string;

  @ManyToOne('User', 'receivedMessages')
  receiver: any;

  @Column()
  @ApiProperty()
  receiverId: string;
} 