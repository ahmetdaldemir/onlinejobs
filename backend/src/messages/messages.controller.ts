import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessageType } from './entities/message.entity';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Mesaj gönder' })
  @ApiResponse({ status: 201, description: 'Mesaj gönderildi' })
  async sendMessage(
    @Body() sendMessageDto: { senderId: string; receiverId: string; content: string; type?: MessageType },
  ) {
    return this.messagesService.sendMessage(
      sendMessageDto.senderId,
      sendMessageDto.receiverId,
      sendMessageDto.content,
      sendMessageDto.type,
    );
  }

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Konuşmalarımı listele' })
  @ApiResponse({ status: 200, description: 'Konuşmalar listelendi' })
  async getMyConversations(@Request() req) {
    return this.messagesService.getMyConversations(req.user.sub);
  }

  @Get('conversation/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Belirli kullanıcı ile konuşmayı getir' })
  @ApiResponse({ status: 200, description: 'Konuşma getirildi' })
  async getConversation(@Param('userId') otherUserId: string, @Request() req) {
    return this.messagesService.getConversation(req.user.sub, otherUserId);
  }

  @Put(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mesajı okundu olarak işaretle' })
  @ApiResponse({ status: 200, description: 'Mesaj okundu olarak işaretlendi' })
  async markAsRead(@Param('id') messageId: string, @Request() req) {
    return this.messagesService.markAsRead(messageId, req.user.sub);
  }

  @Put('conversation/:userId/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Konuşmayı okundu olarak işaretle' })
  @ApiResponse({ status: 200, description: 'Konuşma okundu olarak işaretlendi' })
  async markConversationAsRead(@Param('userId') otherUserId: string, @Request() req) {
    return this.messagesService.markConversationAsRead(otherUserId, req.user.sub);
  }

  @Get('unread/count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Okunmamış mesaj sayısı' })
  @ApiResponse({ status: 200, description: 'Okunmamış mesaj sayısı' })
  async getUnreadCount(@Request() req) {
    const count = await this.messagesService.getUnreadCount(req.user.sub);
    return { count };
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Mesaj durumunu getir (gönderildi, iletildi, okundu)' })
  @ApiResponse({ status: 200, description: 'Mesaj durumu' })
  async getMessageStatus(@Param('id') messageId: string) {
    return this.messagesService.getMessageStatus(messageId);
  }

  @Get('sent/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gönderilen mesajların okunma durumunu getir' })
  @ApiResponse({ status: 200, description: 'Gönderilen mesajların durumu' })
  async getSentMessagesStatus(@Request() req) {
    return this.messagesService.getSentMessagesStatus(req.user.sub);
  }

  @Post('test/create-sample')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test için örnek mesajlar oluştur' })
  @ApiResponse({ status: 201, description: 'Test mesajları oluşturuldu' })
  async createSampleMessages(@Request() req) {
    return this.messagesService.createSampleMessages(req.user.sub);
  }
} 