import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiModel } from './entities/ai-model.entity';
import { AiTrainingData } from './entities/ai-training-data.entity';
import { Message } from '../messages/entities/message.entity';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiModel, AiTrainingData, Message, User, Job]),
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {} 