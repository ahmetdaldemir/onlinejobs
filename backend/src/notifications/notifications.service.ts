import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Notification, NotificationType, NotificationStatus } from './entities/notification.entity';
import { User, UserStatus } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { UserInfo } from '../users/entities/user-info.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
  ) {}

  async createJobNotification(job: Job, employer: User) {
    console.log(`🔔 Job notification başlatılıyor: Job ID: ${job.id}, UserInfo ID: ${job.userInfoId}`);
    
    // Job'un userInfoId'sini kullanarak konum bilgilerini al
    let jobLocation = null;
    if (job.userInfoId) {
      jobLocation = await this.userInfoRepository.findOne({
        where: { id: job.userInfoId }
      });
      console.log(`📍 Job konum bilgisi:`, jobLocation ? {
        address: jobLocation.address,
        latitude: jobLocation.latitude,
        longitude: jobLocation.longitude
      } : 'Bulunamadı');
    } else {
      console.log(`⚠️ Job'da userInfoId bulunamadı`);
    }

    // Eğer job'un konum bilgisi yoksa notification gönderme
    if (!jobLocation || !jobLocation.latitude || !jobLocation.longitude) {
      console.log(`❌ Job konum bilgisi eksik, bildirim gönderilmedi`);
      return {
        message: 'İş ilanının konum bilgisi bulunamadı, bildirim gönderilmedi',
        notifiedWorkers: 0,
        totalWorkers: 0,
        error: 'Konum bilgisi eksik'
      };
    }

    // Kategoriye bağlı worker'ları bul
    const workers = await this.userRepository.find({
      where: {
        userType: 'worker',
        status: UserStatus.ACTIVE,
        categoryIds: Like(`%${job.categoryId}%`)
      },
      relations: ['userInfos']
    });

    console.log(`👥 Kategoriye uygun ${workers.length} worker bulundu`);

    // 20km içindeki worker'ları filtrele
    const nearbyWorkers = workers.filter(worker => {
      if (!worker.userInfos || worker.userInfos.length === 0) {
        console.log(`⚠️ Worker ${worker.id} konum bilgisi yok`);
        return false;
      }

      const workerLocation = worker.userInfos[0];
      if (!workerLocation.latitude || !workerLocation.longitude) {
        console.log(`⚠️ Worker ${worker.id} koordinat bilgisi yok`);
        return false;
      }

      const distance = this.calculateDistance(
        jobLocation.latitude,
        jobLocation.longitude,
        workerLocation.latitude,
        workerLocation.longitude
      );

      const isNearby = distance <= 20; // 20km içinde
      if (isNearby) {
        console.log(`✅ Worker ${worker.id} (${worker.firstName} ${worker.lastName}) ${distance.toFixed(1)}km uzaklıkta`);
      }

      return isNearby;
    });

    console.log(`📍 20km içinde ${nearbyWorkers.length} worker bulundu`);

    // Her worker için bildirim oluştur
    const notifications = nearbyWorkers.map(worker => {
      const notification = new Notification();
      notification.type = NotificationType.JOB_CREATED;
      notification.title = 'Yeni İş İlanı';
      notification.message = `${employer.firstName} ${employer.lastName} tarafından "${job.title}" başlıklı yeni bir iş ilanı oluşturuldu.`;
      notification.status = NotificationStatus.UNREAD;
      notification.userId = worker.id;
      notification.jobId = job.id;
      notification.employerId = employer.id;
      notification.data = {
        jobTitle: job.title,
        jobDescription: job.description,
        budget: job.budget,
        location: jobLocation.address,
        employerName: `${employer.firstName} ${employer.lastName}`,
        distance: this.calculateDistance(
          jobLocation.latitude,
          jobLocation.longitude,
          worker.userInfos[0].latitude,
          worker.userInfos[0].longitude
        ).toFixed(1)
      };

      return notification;
    });

    // Bildirimleri veritabanına kaydet
    if (notifications.length > 0) {
      await this.notificationRepository.save(notifications);
      console.log(`📨 ${notifications.length} bildirim veritabanına kaydedildi`);
    } else {
      console.log(`📭 Bildirim gönderilecek worker bulunamadı`);
    }

    const result = {
      message: `${notifications.length} worker'a bildirim gönderildi`,
      notifiedWorkers: notifications.length,
      totalWorkers: workers.length,
      jobLocation: {
        address: jobLocation.address,
        latitude: jobLocation.latitude,
        longitude: jobLocation.longitude
      },
      details: {
        jobId: job.id,
        jobTitle: job.title,
        userInfoId: job.userInfoId,
        categoryId: job.categoryId,
        searchRadius: '20km'
      }
    };

    console.log(`✅ Job notification tamamlandı:`, result);
    return result;
  }

  async getUserNotifications(userId: string) {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async markAsRead(notificationId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId }
    });

    if (notification) {
      notification.status = NotificationStatus.READ;
      await this.notificationRepository.save(notification);
    }

    return notification;
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepository.update(
      { userId, status: NotificationStatus.UNREAD },
      { status: NotificationStatus.READ }
    );

    return { message: 'Tüm bildirimler okundu olarak işaretlendi' };
  }

  async getUnreadCount(userId: string) {
    return this.notificationRepository.count({
      where: { userId, status: NotificationStatus.UNREAD }
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Dünya'nın yarıçapı (km)
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // km cinsinden
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
} 