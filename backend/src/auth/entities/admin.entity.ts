import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('admins')
@Index(['username'], { unique: true })
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ length: 100, unique: true })
  @ApiProperty()
  username: string;

  @Column({ length: 255 })
  @Exclude()
  password: string;

  @Column({ length: 100 })
  @ApiProperty()
  firstName: string;

  @Column({ length: 100 })
  @ApiProperty()
  lastName: string;

  @Column({ length: 255, nullable: true })
  @ApiProperty()
  email: string;

  @Column({ default: true })
  @ApiProperty()
  isActive: boolean;

  @Column({ default: false })
  @ApiProperty()
  isSuperAdmin: boolean;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  permissions: string; // JSON string of permissions

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @Column({ nullable: true })
  @ApiProperty()
  lastLoginAt: Date;
} 