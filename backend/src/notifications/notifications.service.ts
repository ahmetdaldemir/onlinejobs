import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    // Kategoriye bağlı worker'ları bul
    const workers = await this.userRepository.find({
      where: {
        userType: 'worker',
        status: UserStatus.ACTIVE,
        category: { id: job.categoryId }
      },
      relations: ['userInfos']
    });

    // 20km içindeki worker'ları filtrele
    const nearbyWorkers = workers.filter(worker => {
      if (!worker.userInfos || worker.userInfos.length === 0) return false;
      if (!job.latitude || !job.longitude) return false;

      const workerLocation = worker.userInfos[0];
      if (!workerLocation.latitude || !workerLocation.longitude) return false;

      const distance = this.calculateDistance(
        job.latitude,
        job.longitude,
        workerLocation.latitude,
        workerLocation.longitude
      );

      return distance <= 20; // 20km içinde
    });

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
        location: job.location,
        employerName: `${employer.firstName} ${employer.lastName}`,
        distance: this.calculateDistance(
          job.latitude,
          job.longitude,
          worker.userInfos[0].latitude,
          worker.userInfos[0].longitude
        )
      };

      return notification;
    });

    // Bildirimleri veritabanına kaydet
    if (notifications.length > 0) {
      await this.notificationRepository.save(notifications);
    }

    return {
      message: `${notifications.length} worker'a bildirim gönderildi`,
      notifiedWorkers: notifications.length,
      totalWorkers: workers.length
    };
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