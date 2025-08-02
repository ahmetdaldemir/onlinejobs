"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const user_entity_1 = require("../users/entities/user.entity");
const user_info_entity_1 = require("../users/entities/user-info.entity");
let NotificationsService = class NotificationsService {
    constructor(notificationRepository, userRepository, userInfoRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
    }
    async createJobNotification(job, employer) {
        console.log(`🔔 Job notification başlatılıyor: Job ID: ${job.id}, UserInfo ID: ${job.userInfoId}`);
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
        }
        else {
            console.log(`⚠️ Job'da userInfoId bulunamadı`);
        }
        if (!jobLocation || !jobLocation.latitude || !jobLocation.longitude) {
            console.log(`❌ Job konum bilgisi eksik, bildirim gönderilmedi`);
            return {
                message: 'İş ilanının konum bilgisi bulunamadı, bildirim gönderilmedi',
                notifiedWorkers: 0,
                totalWorkers: 0,
                error: 'Konum bilgisi eksik'
            };
        }
        const workers = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.userInfos', 'userInfos')
            .where('user.userType = :userType', { userType: 'worker' })
            .andWhere('user.status = :status', { status: user_entity_1.UserStatus.ACTIVE })
            .andWhere(':categoryId = ANY(user.categoryIds)', { categoryId: job.categoryId })
            .getMany();
        console.log(`👥 Kategoriye uygun ${workers.length} worker bulundu`);
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
            const distance = this.calculateDistance(jobLocation.latitude, jobLocation.longitude, workerLocation.latitude, workerLocation.longitude);
            const isNearby = distance <= 20;
            if (isNearby) {
                console.log(`✅ Worker ${worker.id} (${worker.firstName} ${worker.lastName}) ${distance.toFixed(1)}km uzaklıkta`);
            }
            return isNearby;
        });
        console.log(`📍 20km içinde ${nearbyWorkers.length} worker bulundu`);
        const notifications = nearbyWorkers.map(worker => {
            const notification = new notification_entity_1.Notification();
            notification.type = notification_entity_1.NotificationType.JOB_CREATED;
            notification.title = 'Yeni İş İlanı';
            notification.message = `${employer.firstName} ${employer.lastName} tarafından "${job.title}" başlıklı yeni bir iş ilanı oluşturuldu.`;
            notification.status = notification_entity_1.NotificationStatus.UNREAD;
            notification.userId = worker.id;
            notification.jobId = job.id;
            notification.employerId = employer.id;
            notification.data = {
                jobTitle: job.title,
                jobDescription: job.description,
                budget: job.budget,
                location: jobLocation.address,
                employerName: `${employer.firstName} ${employer.lastName}`,
                distance: this.calculateDistance(jobLocation.latitude, jobLocation.longitude, worker.userInfos[0].latitude, worker.userInfos[0].longitude).toFixed(1)
            };
            return notification;
        });
        if (notifications.length > 0) {
            await this.notificationRepository.save(notifications);
            console.log(`📨 ${notifications.length} bildirim veritabanına kaydedildi`);
        }
        else {
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
    async getUserNotifications(userId) {
        return this.notificationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }
    async markAsRead(notificationId) {
        const notification = await this.notificationRepository.findOne({
            where: { id: notificationId }
        });
        if (notification) {
            notification.status = notification_entity_1.NotificationStatus.READ;
            await this.notificationRepository.save(notification);
        }
        return notification;
    }
    async markAllAsRead(userId) {
        await this.notificationRepository.update({ userId, status: notification_entity_1.NotificationStatus.UNREAD }, { status: notification_entity_1.NotificationStatus.READ });
        return { message: 'Tüm bildirimler okundu olarak işaretlendi' };
    }
    async getUnreadCount(userId) {
        return this.notificationRepository.count({
            where: { userId, status: notification_entity_1.NotificationStatus.UNREAD }
        });
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(user_info_entity_1.UserInfo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map