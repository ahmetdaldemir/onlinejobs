import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { JobsModule } from '../jobs/jobs.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [JobsModule, AdminModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {} 