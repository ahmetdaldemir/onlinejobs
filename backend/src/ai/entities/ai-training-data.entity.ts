import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AiModel } from './ai-model.entity';

@Entity('ai_training_data')
export class AiTrainingData {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty()
  userId: string;

  @Column({ type: 'text' })
  @ApiProperty()
  inputMessage: string;

  @Column({ type: 'text' })
  @ApiProperty()
  responseMessage: string;

  @Column({ type: 'json', nullable: true })
  @ApiProperty()
  context: any;

  @Column({ type: 'float', default: 0 })
  @ApiProperty()
  rating: number;

  @Column({ type: 'boolean', default: false })
  @ApiProperty()
  isUsedForTraining: boolean;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @ManyToOne(() => AiModel, (aiModel) => aiModel.trainingData)
  @JoinColumn({ name: 'aiModelId' })
  aiModel: AiModel;

  @Column({ type: 'uuid' })
  aiModelId: string;
} 