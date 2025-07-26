import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getUserNotifications(req: any): Promise<import("./entities/notification.entity").Notification[]>;
    getUnreadCount(req: any): Promise<number>;
    markAsRead(id: string): Promise<import("./entities/notification.entity").Notification>;
    markAllAsRead(req: any): Promise<{
        message: string;
    }>;
}
