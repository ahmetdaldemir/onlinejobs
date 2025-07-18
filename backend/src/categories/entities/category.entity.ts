import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('categories')
@Index(['name'], { unique: true })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ length: 100, unique: true })
  @ApiProperty()
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  description: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  icon: string;

  @Column({ default: true })
  @ApiProperty()
  isActive: boolean;

  @Column({ default: 0 })
  @ApiProperty()
  orderIndex: number;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  // İlişkiler
  @OneToMany('User', 'category')
  users: any[];
} 