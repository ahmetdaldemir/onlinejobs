import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { UserInfo } from '../users/entities/user-info.entity';
import { Job } from '../jobs/entities/job.entity';
import { Message } from '../messages/entities/message.entity';
import { Category } from '../categories/entities/category.entity';
import { JobApplication } from '../jobs/entities/job-application.entity';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserInfo,
      Job,
      Message,
      Category,
      JobApplication,
    ]),
    UploadModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {} 