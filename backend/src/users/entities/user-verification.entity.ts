import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum DocumentType {
  MASTERY_CERTIFICATE = 'mastery_certificate', // Ustalık belgesi
  TAX_CERTIFICATE = 'tax_certificate', // Vergi levhası
  CONTRACT_PDF = 'contract_pdf', // Sözleşme çıktısı
}

@Entity('user_verifications')
@Index(['userId', 'documentType'], { unique: true })
export class UserVerification {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  userId: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  @ApiProperty({ enum: DocumentType })
  documentType: DocumentType;

  @Column({ type: 'text' })
  @ApiProperty()
  documentUrl: string; // Yüklenen belgenin URL'i

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  originalFileName: string; // Orijinal dosya adı

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  mimeType: string; // Dosya türü

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  fileSize: number; // Dosya boyutu (bytes)

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  @ApiProperty({ enum: VerificationStatus })
  status: VerificationStatus;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  adminNotes: string; // Admin notları (red sebebi vb.)

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  rejectionReason: string; // Red sebebi

  @Column({ nullable: true })
  @ApiProperty()
  reviewedAt: Date; // İncelenme tarihi

  @Column({ nullable: true })
  @ApiProperty()
  reviewedBy: string; // İnceleyen admin ID'si

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  // İlişkiler
  @ManyToOne(() => User, 'verifications')
  @JoinColumn({ name: 'userId' })
  user: User;
}
