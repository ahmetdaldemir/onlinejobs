import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UserInfo } from './user-info.entity';
import { UserVerification } from './user-verification.entity';
 
 
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ length: 100 })
  @ApiProperty()
  firstName: string;

  @Column({ length: 100 })
  @ApiProperty()
  lastName: string;

  @Column({ length: 255, nullable: true })
  @IsOptional()
  email: string;

  @Column({ length: 20,  nullable: true })
  @ApiProperty()
  phone: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'text',
    default: 'employer',
  })
  @ApiProperty({ type: String, description: 'Kullanıcı tipleri: worker, employer' })
  userType: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  bio: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  profileImage: string;
 
  @Column({ default: false })
  @ApiProperty()
  isVerified: boolean;

  @Column({ default: false })
  @ApiProperty()
  isOnline: boolean;

  @Column({ default: 0 })
  @ApiProperty()
  rating: number;

  @Column({ default: 0 })
  @ApiProperty()
  totalReviews: number;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @Column({ nullable: true })
  @ApiProperty()
  lastSeen: Date;

  // İlişkiler
  @OneToMany('Job', 'employer')
  jobs: any[];

  @OneToMany('Message', 'sender')
  sentMessages: any[];

  @OneToMany('Message', 'receiver')
  receivedMessages: any[];

  @Column('text', { array: true, nullable: true })
  @ApiProperty({ type: [String], description: 'Kullanıcının seçtiği kategori ID\'leri' })
  categoryIds: string[];

  @ManyToMany('Category', 'users', { nullable: true })
  @JoinTable({
    name: 'user_categories',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' }
  })
  categories: any[];

  @OneToMany(() => UserInfo, 'user')
  userInfos: UserInfo[];

  // Verification ilişkisi
  @OneToMany(() => UserVerification, 'user')
  verifications: UserVerification[];

  // Comment ilişkileri
  @OneToMany('Comment', 'commenter')
  commentsGiven: any[]; // Yaptığı yorumlar

  @OneToMany('Comment', 'commentedUser')
  commentsReceived: any[]; // Aldığı yorumlar
}