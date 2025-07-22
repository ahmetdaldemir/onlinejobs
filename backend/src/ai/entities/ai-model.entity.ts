import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AiTrainingData } from './ai-training-data.entity';

export enum AiModelStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TRAINING = 'training',
}

@Entity('ai_models')
export class AiModel {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty()
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  description: string;

  @Column({
    type: 'enum',
    enum: AiModelStatus,
    default: AiModelStatus.INACTIVE,
  })
  @ApiProperty({ enum: AiModelStatus })
  status: AiModelStatus;

  @Column({ type: 'json', nullable: true })
  @ApiProperty()
  modelConfig: any;

  @Column({ type: 'int', default: 0 })
  @ApiProperty()
  trainingDataCount: number;

  @Column({ type: 'float', default: 0 })
  @ApiProperty()
  accuracy: number;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty()
  lastTrainedAt: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @OneToMany(() => AiTrainingData, (trainingData) => trainingData.aiModel)
  trainingData: AiTrainingData[];
} 