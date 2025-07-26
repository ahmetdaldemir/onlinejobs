import { Controller, Get, Put, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Kullanıcının bildirimlerini getir' })
  @ApiResponse({ status: 200, description: 'Bildirimler başarıyla getirildi' })
  async getUserNotifications(@Request() req) {
    return this.notificationsService.getUserNotifications(req.user.id);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Okunmamış bildirim sayısını getir' })
  @ApiResponse({ status: 200, description: 'Okunmamış bildirim sayısı' })
  async getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Bildirimi okundu olarak işaretle' })
  @ApiResponse({ status: 200, description: 'Bildirim okundu olarak işaretlendi' })
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Put('mark-all-read')
  @ApiOperation({ summary: 'Tüm bildirimleri okundu olarak işaretle' })
  @ApiResponse({ status: 200, description: 'Tüm bildirimler okundu olarak işaretlendi' })
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }
} 