import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JobsService } from '../jobs/jobs.service';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly jobsService: JobsService,
    private readonly adminService: AdminService,
  ) {}

  // Her gün gece yarısı tüm işlerin skorlarını güncelle
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateFeaturedScores() {
    this.logger.log('🔄 Öne çıkan iş skorları güncelleniyor...');
    
    try {
      await this.jobsService.updateAllFeaturedScores();
      this.logger.log('✅ Öne çıkan iş skorları başarıyla güncellendi');
    } catch (error) {
      this.logger.error('❌ Öne çıkan iş skorları güncellenirken hata:', error);
    }
  }

  // Her saat başı yüksek skorlu işleri kontrol et
  @Cron(CronExpression.EVERY_HOUR)
  async checkHighScoreJobs() {
    this.logger.log('🔍 Yüksek skorlu işler kontrol ediliyor...');
    
    try {
      const highScoreJobs = await this.jobsService.getHighScoreJobs(5);
      this.logger.log(`📊 En yüksek skorlu 5 iş: ${highScoreJobs.map(job => `${job.title} (${job.featuredScore} puan)`).join(', ')}`);
    } catch (error) {
      this.logger.error('❌ Yüksek skorlu işler kontrol edilirken hata:', error);
    }
  }

  // Her gün sabah 6'da süresi dolmuş işleri kapat
  @Cron('0 6 * * *') // Her gün sabah 6'da
  async closeExpiredJobs() {
    this.logger.log('🔄 Süresi dolmuş işler kontrol ediliyor...');
    
    try {
      const result = await this.adminService.closeExpiredJobs();
      this.logger.log(`✅ ${result.message}`);
    } catch (error) {
      this.logger.error('❌ Süresi dolmuş işler kapatılırken hata:', error);
    }
  }
} 