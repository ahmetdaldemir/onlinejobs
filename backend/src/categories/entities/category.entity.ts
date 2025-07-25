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
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ length: 100 })
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

  @Column({ nullable: true })
  @ApiProperty()
  parentId: string;
  
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