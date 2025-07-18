import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, MessageType } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async sendMessage(senderId: string, receiverId: string, content: string, type: MessageType = MessageType.TEXT): Promise<Message> {
    const message = this.messageRepository.create({
      senderId,
      receiverId,
      content,
      type,
    });

    return this.messageRepository.save(message as unknown as Message);
  }

  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
      order: { createdAt: 'ASC' },
      relations: ['sender', 'receiver'],
    });
  }

  async getMyConversations(userId: string): Promise<any[]> {
    // Kullanıcının tüm konuşmalarını getir
    const conversations = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where('message.senderId = :userId OR message.receiverId = :userId', { userId })
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    // Benzersiz konuşma partnerlerini bul
    const conversationPartners = new Map();
    
    conversations.forEach(message => {
      const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
      const partner = message.senderId === userId ? message.receiver : message.sender;
      
      if (!conversationPartners.has(partnerId)) {
        conversationPartners.set(partnerId, {
          partnerId,
          partner,
          lastMessage: message,
          unreadCount: 0,
        });
      }
    });

    // Okunmamış mesaj sayısını hesapla
    const unreadMessages = await this.messageRepository.find({
      where: { receiverId: userId, isRead: false },
    });

    unreadMessages.forEach(message => {
      const conversation = conversationPartners.get(message.senderId);
      if (conversation) {
        conversation.unreadCount++;
      }
    });

    return Array.from(conversationPartners.values());
  }

  async markAsRead(messageId: string, userId: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Mesaj bulunamadı');
    }

    if (message.receiverId !== userId) {
      throw new ForbiddenException('Bu mesajı okuma yetkiniz yok');
    }

    message.isRead = true;
    message.readAt = new Date();
    return this.messageRepository.save(message);
  }

  async markConversationAsRead(otherUserId: string, userId: string): Promise<void> {
    await this.messageRepository.update(
      { senderId: otherUserId, receiverId: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.messageRepository.count({
      where: { receiverId: userId, isRead: false },
    });
  }
} 