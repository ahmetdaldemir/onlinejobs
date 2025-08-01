import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, MessageType } from './entities/message.entity';
import { AiService } from '../ai/ai.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private aiService: AiService,
  ) {}

  async sendMessage(senderId: string, receiverId: string, content: string, type: MessageType = MessageType.TEXT): Promise<Message> {
    // Parametre kontrolü
    if (!senderId) {
      throw new Error('senderId gerekli');
    }
    if (!receiverId) {
      throw new Error('receiverId gerekli');
    }
    if (!content) {
      throw new Error('content gerekli');
    }

    console.log('MessagesService.sendMessage çağrıldı:', { senderId, receiverId, content, type });

    const message = this.messageRepository.create({
      senderId,
      receiverId,
      content,
      type,
    });

    console.log('Oluşturulan message objesi:', message);

    const savedMessage = await this.messageRepository.save(message);

    // Alıcının online durumunu kontrol et ve AI yanıtı oluştur
    // Sadece HTTP endpoint'inden gelen istekler için AI yanıtı oluştur
    // WebSocket'ten gelen istekler için WebSocket gateway'de AI yanıtı oluşturuluyor
    await this.checkAndGenerateAIResponse(receiverId, senderId, content);

    return savedMessage;
  }

  // Alıcının online durumunu kontrol et ve AI yanıtı oluştur
  private async checkAndGenerateAIResponse(receiverId: string, senderId: string, originalMessage: string): Promise<void> {
    try {
      // Alıcının online durumunu kontrol et (bu kısmı WebSocket bağlantılarından kontrol edebiliriz)
      const isReceiverOnline = await this.isUserOnline(receiverId);
      
      if (!isReceiverOnline) {
        console.log(`🤖 Kullanıcı ${receiverId} online değil, AI yanıtı oluşturuluyor...`);
        
        // AI yanıtı oluştur
        const aiResponse = await this.aiService.generateResponse(receiverId, originalMessage);
        
        if (aiResponse) {
          console.log(`✅ AI yanıtı oluşturuldu: ${aiResponse}`);
          
          // AI yanıtını mesaj olarak kaydet
          const aiMessage = this.messageRepository.create({
            senderId: receiverId,
            receiverId: senderId,
            content: aiResponse,
            type: MessageType.TEXT,
            isAIGenerated: true, // AI tarafından oluşturulduğunu belirt
          });
          
          await this.messageRepository.save(aiMessage);
          console.log(`💬 AI yanıtı mesaj olarak kaydedildi`);
        } else {
          console.log(`❌ AI yanıtı oluşturulamadı`);
        }
      } else {
        console.log(`👤 Kullanıcı ${receiverId} online, AI yanıtı oluşturulmayacak`);
      }
    } catch (error) {
      console.error('AI yanıtı oluşturulurken hata:', error);
    }
  }

  // Kullanıcının online durumunu kontrol et
  private async isUserOnline(userId: string): Promise<boolean> {
    // WebSocket gateway'den online durumu kontrol et
    // Bu metod sadece HTTP endpoint'lerinden çağrıldığında kullanılır
    // WebSocket'ten gelen istekler için WebSocket gateway'de kontrol yapılır
    
    // Şimdilik basit bir kontrol yapalım
    // Gerçek uygulamada WebSocket bağlantılarından kontrol edilebilir
    const onlineUserIds = ['test-user-id']; // Test için - yusuf-user-id online değil
    console.log(`🔍 HTTP endpoint - Online durumu kontrol ediliyor: ${userId}`);
    console.log(`📋 Online kullanıcılar: ${onlineUserIds}`);
    const isOnline = onlineUserIds.includes(userId);
    console.log(`✅ ${userId} online mi? ${isOnline}`);
    return isOnline;
  }

  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    console.log('🔍 getConversation çağrıldı:', { userId1, userId2 });
    
    const messages = await this.messageRepository.find({
      where: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
      order: { createdAt: 'ASC' },
      relations: ['sender', 'receiver'],
    });
    
    console.log('📨 Bulunan mesajlar:', messages.length);
    console.log('📋 Mesaj detayları:', messages.map(m => ({
      id: m.id,
      senderId: m.senderId,
      receiverId: m.receiverId,
      content: m.content,
      createdAt: m.createdAt
    })));
    
    return messages;
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

  // Mesaj durumunu getir (gönderildi, iletildi, okundu)
  async getMessageStatus(messageId: string): Promise<{ isDelivered: boolean; isRead: boolean; readAt?: Date }> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Mesaj bulunamadı');
    }

    return {
      isDelivered: true, // WebSocket ile gönderildiği için her zaman true
      isRead: message.isRead,
      readAt: message.readAt,
    };
  }

  // Kullanıcının gönderdiği mesajların okunma durumunu getir
  async getSentMessagesStatus(userId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { senderId: userId },
      order: { createdAt: 'DESC' },
      relations: ['receiver'],
    });
  }

  async createSampleMessages(userId: string): Promise<Message[]> {
    console.log('🧪 Test mesajları oluşturuluyor için kullanıcı:', userId);
    
    // Test için sabit bir alıcı ID (gerçek bir kullanıcı ID'si olmalı)
    const testReceiverId = '4b27001b-759d-47e3-9a49-67d3445e26e8';
    
    const sampleMessages = [
      {
        senderId: userId,
        receiverId: testReceiverId,
        content: 'Merhaba! Test mesajı 1',
        type: MessageType.TEXT,
      },
      {
        senderId: testReceiverId,
        receiverId: userId,
        content: 'Merhaba! Ben de test mesajı gönderiyorum.',
        type: MessageType.TEXT,
      },
      {
        senderId: userId,
        receiverId: testReceiverId,
        content: 'Nasılsın? İşler nasıl gidiyor?',
        type: MessageType.TEXT,
      },
      {
        senderId: testReceiverId,
        receiverId: userId,
        content: 'İyiyim, teşekkürler! Sen nasılsın?',
        type: MessageType.TEXT,
      },
    ];

    const createdMessages = [];
    
    for (const messageData of sampleMessages) {
      const message = this.messageRepository.create(messageData);
      const savedMessage = await this.messageRepository.save(message);
      createdMessages.push(savedMessage);
      console.log('✅ Test mesajı oluşturuldu:', savedMessage.id);
    }
    
    console.log('🎉 Toplam', createdMessages.length, 'test mesajı oluşturuldu');
    return createdMessages;
  }
} 