import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiModel, AiModelStatus } from './entities/ai-model.entity';
import { AiTrainingData } from './entities/ai-training-data.entity';
import { Message } from '../messages/entities/message.entity';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(AiModel)
    private aiModelRepository: Repository<AiModel>,
    @InjectRepository(AiTrainingData)
    private trainingDataRepository: Repository<AiTrainingData>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  // AI model oluştur
  async createModel(name: string, description?: string): Promise<AiModel> {
    const model = this.aiModelRepository.create({
      name,
      description,
      status: AiModelStatus.INACTIVE,
      modelConfig: {
        learningRate: 0.01,
        maxEpochs: 100,
        batchSize: 32,
      },
    });
    return this.aiModelRepository.save(model);
  }

  // AI model durumunu güncelle
  async updateModelStatus(modelId: string, status: AiModelStatus): Promise<AiModel> {
    const model = await this.aiModelRepository.findOne({ where: { id: modelId } });
    if (!model) {
      throw new NotFoundException('AI model bulunamadı');
    }
    model.status = status;
    return this.aiModelRepository.save(model);
  }

  // Aktif modeli getir
  async getActiveModel(): Promise<AiModel | null> {
    return this.aiModelRepository.findOne({ where: { status: AiModelStatus.ACTIVE } });
  }

  // Tüm modelleri listele
  async getAllModels(): Promise<AiModel[]> {
    return this.aiModelRepository.find();
  }

  async getTrainingDataCount(modelId: string): Promise<{ total: number; unused: number }> {
    const total = await this.trainingDataRepository.count({
      where: { aiModelId: modelId }
    });

    const unused = await this.trainingDataRepository.count({
      where: { aiModelId: modelId, isUsedForTraining: false }
    });

    return { total, unused };
  }

  // Eğitim verisi ekle
  async addTrainingData(
    modelId: string,
    userId: string,
    inputMessage: string,
    responseMessage: string,
    context?: any,
  ): Promise<AiTrainingData> {
    const trainingData = this.trainingDataRepository.create({
      aiModelId: modelId,
      userId,
      inputMessage,
      responseMessage,
      context,
    });
    return this.trainingDataRepository.save(trainingData);
  }

  // Kullanıcı tipine göre otomatik karşılama mesajı oluştur
  async generateWelcomeMessage(userId: string, userType: 'employer' | 'worker'): Promise<string> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['userInfos']
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    const userInfo = user.userInfos?.[0];
    const location = userInfo ? `${userInfo.address || ''} ${userInfo.neighborhood || ''}`.trim() : '';

    if (userType === 'employer') {
      return `Merhaba ${user.firstName}! 👋 

Hoş geldiniz! İşçi arama sürecinizde size yardımcı olmaktan mutluluk duyarım.

${location ? `📍 Konum: ${location}` : ''}

Size nasıl yardımcı olabilirim?
• Hangi kategoride işçi arıyorsunuz?
• İş tanımınızı detaylandırmak ister misiniz?
• Bütçe aralığınız nedir?

Başlamak için yukarıdaki sorulardan birini sorabilirsiniz. 😊`;
    } else {
      return `Merhaba ${user.firstName}! 👋 

Hoş geldiniz! İş arama sürecinizde size yardımcı olmaktan mutluluk duyarım.

${location ? `📍 Konum: ${location}` : ''}

Size nasıl yardımcı olabilirim?
• Hangi alanda çalışmak istiyorsunuz?
• Deneyim seviyeniz nedir?
• Maaş beklentiniz nedir?

Başlamak için yukarıdaki sorulardan birini sorabilirsiniz. 😊`;
    }
  }

  // İş detayları için otomatik mesaj oluştur
  async generateJobDetailsMessage(jobId: string, userId: string): Promise<string> {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['category', 'employer', 'employer.userInfos']
    });

    if (!job) {
      throw new NotFoundException('İş bulunamadı');
    }

    const employer = job.employer;
    const employerInfo = employer.userInfos?.[0];
    const location = employerInfo ? `${employerInfo.address || ''} ${employerInfo.neighborhood || ''}`.trim() : '';

    return `📋 İş Detayları

🏢 İşveren: ${employer.firstName} ${employer.lastName}
📍 Konum: ${location || 'Belirtilmemiş'}
📂 Kategori: ${job.category?.name || 'Genel'}
💰 Bütçe: ${job.budget ? `${job.budget} TL` : 'Belirtilmemiş'}
📅 Tarih: ${job.createdAt.toLocaleDateString('tr-TR')}

📝 Açıklama:
${job.description}

⏰ Zaman: ${job.scheduledTime || 'Belirtilmemiş'}
📞 İletişim: ${employer.phone || 'Belirtilmemiş'}

Bu iş hakkında daha fazla bilgi almak ister misiniz? 🤔`;
  }

  // Kullanıcı tipine göre otomatik eğitim verisi oluştur
  async generateUserTypeBasedTrainingData(modelId: string, userId: string, userType: 'employer' | 'worker'): Promise<AiTrainingData[]> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['userInfos']
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    const trainingData: AiTrainingData[] = [];
    const userInfo = user.userInfos?.[0];
    const location = userInfo ? `${userInfo.address || ''} ${userInfo.neighborhood || ''}`.trim() : '';

    if (userType === 'employer') {
      // İşveren için eğitim verileri
      const employerTrainingData = [
        {
          input: "İşçi arıyorum",
          response: `Hangi kategoride işçi arıyorsunuz? Size uygun adayları bulabilirim. ${location ? `📍 Konum: ${location}` : ''}`,
          rating: 5
        },
        {
          input: "Güvenilir işçi bulamıyorum",
          response: "Profilinizi detaylı doldurun ve referanslarınızı ekleyin. Bu şekilde daha güvenilir adaylar bulabilirsiniz. Ayrıca yorum sistemi ile adayların geçmiş performanslarını görebilirsiniz.",
          rating: 5
        },
        {
          input: "Maaş ne kadar olmalı?",
          response: "Maaş, iş kategorisine ve deneyim seviyesine göre değişir. Piyasa ortalamasını öğrenmek için benzer iş ilanlarını inceleyebilirsiniz.",
          rating: 4
        },
        {
          input: "İş tanımı nasıl yazmalıyım?",
          response: "İş tanımınızda şunları belirtin: • Gerekli beceriler • Çalışma saatleri • Maaş aralığı • İş yeri konumu • İletişim bilgileri",
          rating: 5
        },
        {
          input: "Hangi kategoriler var?",
          response: "Temizlik, bakım, inşaat, bahçe, ev işleri, çocuk bakımı, yaşlı bakımı, kurye, garson, aşçı gibi kategoriler mevcuttur.",
          rating: 4
        }
      ];

      employerTrainingData.forEach(data => {
        trainingData.push(
          this.trainingDataRepository.create({
            aiModelId: modelId,
            userId: userId,
            inputMessage: data.input,
            responseMessage: data.response,
            rating: data.rating,
            context: { userType: 'employer', location }
          })
        );
      });
    } else {
      // İşçi için eğitim verileri
      const workerTrainingData = [
        {
          input: "İş arıyorum",
          response: `Hangi alanda çalışmak istiyorsunuz? Size uygun iş ilanlarını gösterebilirim. ${location ? `📍 Konum: ${location}` : ''}`,
          rating: 5
        },
        {
          input: "Deneyimim yok",
          response: "Deneyimsiz işçiler için de iş ilanları var. Profilinizi güncelleyin ve başvurmaya başlayın. Bazı işverenler eğitim verebilir.",
          rating: 4
        },
        {
          input: "Maaş ne kadar?",
          response: "Maaşlar iş türüne ve deneyime göre değişir. İlan detaylarında maaş bilgisi bulabilirsiniz. Müzakere edebilirsiniz.",
          rating: 4
        },
        {
          input: "Hangi işler var?",
          response: "Temizlik, bakım, inşaat, bahçe, ev işleri, çocuk bakımı, yaşlı bakımı, kurye, garson, aşçı gibi birçok kategori var.",
          rating: 4
        },
        {
          input: "Güvenli mi?",
          response: "Tüm kullanıcılar doğrulanmıştır ve yorum sistemi ile güvenilirlik kontrol edilir. İlk görüşmeyi güvenli bir yerde yapın.",
          rating: 5
        }
      ];

      workerTrainingData.forEach(data => {
        trainingData.push(
          this.trainingDataRepository.create({
            aiModelId: modelId,
            userId: userId,
            inputMessage: data.input,
            responseMessage: data.response,
            rating: data.rating,
            context: { userType: 'worker', location }
          })
        );
      });
    }

    return this.trainingDataRepository.save(trainingData);
  }

  // Kullanıcı analizi oluştur
  async generateUserAnalysis(userId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userInfos']
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Kullanıcının mesajlarını analiz et
    const messages = await this.messageRepository.find({
      where: [
        { senderId: userId },
        { receiverId: userId }
      ],
      order: { createdAt: 'ASC' },
      relations: ['sender', 'receiver']
    });

    // Kullanıcının işlerini al
    const userJobs = await this.jobRepository.find({
      where: { employerId: userId },
      relations: ['category']
    });

    // Mesaj analizi
    const messageAnalysis = {
      totalMessages: messages.length,
      sentMessages: messages.filter(m => m.senderId === userId).length,
      receivedMessages: messages.filter(m => m.receiverId === userId).length,
      averageResponseTime: this.calculateAverageResponseTime(messages, userId),
      commonWords: this.extractCommonWords(messages, userId),
      communicationStyle: this.analyzeCommunicationStyle(messages, userId),
      activeHours: this.analyzeActiveHours(messages, userId)
    };

    // İş analizi
    const jobAnalysis = {
      totalJobs: userJobs.length,
      jobCategories: [...new Set(userJobs.map(job => job.category?.name).filter(Boolean))],
      averageSalary: userJobs.length > 0 ? userJobs.reduce((sum, job) => sum + (parseInt(job.budget) || 0), 0) / userJobs.length : 0,
      preferredLocations: this.extractPreferredLocations(userJobs)
    };

    // Kullanıcı profili
    const userProfile = {
      userType: userJobs.length > 0 ? 'employer' : 'worker',
      registrationDate: user.createdAt,
      lastActive: user.updatedAt,
      location: user.userInfos?.[0] ? `${user.userInfos[0].address || ''} ${user.userInfos[0].neighborhood || ''}`.trim() : 'Belirtilmemiş',
      categories: 'Belirtilmemiş'
    };

    // AI puanlama sistemi
    const aiScore = this.calculateAIScore(messageAnalysis, jobAnalysis, userProfile);

    return {
      userId,
      userProfile,
      messageAnalysis,
      jobAnalysis,
      aiScore,
      recommendations: this.generateRecommendations(messageAnalysis, jobAnalysis, userProfile)
    };
  }

  // Ortalama yanıt süresi hesapla
  private calculateAverageResponseTime(messages: Message[], userId: string): number {
    let totalResponseTime = 0;
    let responseCount = 0;

    for (let i = 0; i < messages.length - 1; i++) {
      const currentMessage = messages[i];
      const nextMessage = messages[i + 1];

      if (currentMessage.senderId !== userId && nextMessage.senderId === userId) {
        const responseTime = nextMessage.createdAt.getTime() - currentMessage.createdAt.getTime();
        totalResponseTime += responseTime;
        responseCount++;
      }
    }

    return responseCount > 0 ? totalResponseTime / responseCount / 1000 / 60 : 0; // Dakika cinsinden
  }

  // Sık kullanılan kelimeleri çıkar
  private extractCommonWords(messages: Message[], userId: string): any {
    const userMessages = messages.filter(m => m.senderId === userId);
    const words = {};

    userMessages.forEach(msg => {
      const messageWords = msg.content.toLowerCase().split(' ');
      messageWords.forEach(word => {
        if (word.length > 2) {
          words[word] = (words[word] || 0) + 1;
        }
      });
    });

    return Object.entries(words)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
  }

  // İletişim tarzını analiz et
  private analyzeCommunicationStyle(messages: Message[], userId: string): string {
    const userMessages = messages.filter(m => m.senderId === userId);
    
    let formalCount = 0;
    let casualCount = 0;
    let emojiCount = 0;

    const formalWords = ['teşekkür', 'rica', 'lütfen', 'memnun', 'güvenilir', 'kaliteli'];
    const casualWords = ['slm', 'selam', 'nasılsın', 'iyi', 'güzel'];

    userMessages.forEach(msg => {
      const content = msg.content.toLowerCase();
      
      if (formalWords.some(word => content.includes(word))) formalCount++;
      if (casualWords.some(word => content.includes(word))) casualCount++;
      if (content.includes('😊') || content.includes('👍') || content.includes('🙏')) emojiCount++;
    });

    if (formalCount > casualCount) return 'Formal';
    if (casualCount > formalCount) return 'Casual';
    return 'Neutral';
  }

  // Aktif saatleri analiz et
  private analyzeActiveHours(messages: Message[], userId: string): any {
    const userMessages = messages.filter(m => m.senderId === userId);
    const hours = {};

    userMessages.forEach(msg => {
      const hour = msg.createdAt.getHours();
      hours[hour] = (hours[hour] || 0) + 1;
    });

    return hours;
  }

  // Tercih edilen lokasyonları çıkar
  private extractPreferredLocations(jobs: Job[]): string[] {
    const locations = jobs.map(job => job.userInfo?.address || job.userInfo?.neighborhood).filter(Boolean);
    return [...new Set(locations)];
  }

  // AI puanı hesapla
  private calculateAIScore(messageAnalysis: any, jobAnalysis: any, userProfile: any): number {
    let score = 50; // Başlangıç puanı

    // Mesaj aktivitesi
    if (messageAnalysis.totalMessages > 20) score += 10;
    if (messageAnalysis.totalMessages > 50) score += 10;

    // Yanıt süresi
    if (messageAnalysis.averageResponseTime < 5) score += 15; // 5 dakikadan az
    if (messageAnalysis.averageResponseTime < 2) score += 10; // 2 dakikadan az

    // İletişim tarzı
    if (messageAnalysis.communicationStyle === 'Formal') score += 10;
    if (messageAnalysis.communicationStyle === 'Casual') score += 5;

    // İş aktivitesi
    if (jobAnalysis.totalJobs > 0) score += 10;
    if (jobAnalysis.totalJobs > 5) score += 10;

    // Kayıt süresi
    const daysSinceRegistration = (Date.now() - userProfile.registrationDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceRegistration > 30) score += 10;
    if (daysSinceRegistration > 90) score += 10;

    return Math.min(100, Math.max(0, score));
  }

  // Öneriler oluştur
  private generateRecommendations(messageAnalysis: any, jobAnalysis: any, userProfile: any): string[] {
    const recommendations = [];

    if (messageAnalysis.totalMessages < 10) {
      recommendations.push('Daha aktif mesajlaşma yaparak profil görünürlüğünüzü artırabilirsiniz.');
    }

    if (messageAnalysis.averageResponseTime > 10) {
      recommendations.push('Daha hızlı yanıt vererek kullanıcı memnuniyetini artırabilirsiniz.');
    }

    if (userProfile.userType === 'employer' && jobAnalysis.totalJobs < 3) {
      recommendations.push('Daha fazla iş ilanı oluşturarak aday havuzunuzu genişletebilirsiniz.');
    }

    if (userProfile.userType === 'worker' && jobAnalysis.totalJobs === 0) {
      recommendations.push('Profilinizi güncelleyerek daha fazla iş fırsatı yakalayabilirsiniz.');
    }

    return recommendations;
  }

  // Kullanıcı mesajlarından otomatik eğitim verisi oluştur
  async generateTrainingDataFromUserMessages(modelId: string, userId: string): Promise<AiTrainingData[]> {
    const messages = await this.messageRepository.find({
      where: [
        { senderId: userId },
        { receiverId: userId }
      ],
      order: { createdAt: 'ASC' },
      relations: ['sender', 'receiver']
    });

    const trainingData: AiTrainingData[] = [];
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Kullanıcının işleri
    const userJobs = await this.jobRepository.find({
      where: { employerId: userId },
      relations: ['category']
    });

    // Mesajlardan eğitim verisi oluştur
    for (let i = 0; i < messages.length - 1; i++) {
      const currentMessage = messages[i];
      const nextMessage = messages[i + 1];

      // Eğer aynı konuşma içindeyse ve farklı kullanıcılardan geliyorsa
      if (currentMessage.senderId !== nextMessage.senderId) {
        const inputMessage = currentMessage.content;
        const responseMessage = nextMessage.content;

        // Mesaj kalitesi kontrolü
        if (this.isValidTrainingMessage(inputMessage) && this.isValidTrainingMessage(responseMessage)) {
          const trainingDataItem = this.trainingDataRepository.create({
            aiModelId: modelId,
            userId: userId,
            inputMessage: inputMessage,
            responseMessage: responseMessage,
            rating: this.calculateMessageRating(inputMessage, responseMessage),
            context: {
              userType: currentMessage.senderId === userId ? 'sender' : 'receiver',
              jobContext: this.extractJobContext(userJobs, inputMessage),
              timestamp: currentMessage.createdAt
            }
          });

          trainingData.push(trainingDataItem);
        }
      }
    }

    // Kullanıcı profilinden eğitim verisi oluştur
    const profileTrainingData = this.generateProfileBasedTrainingData(modelId, userId, user, userJobs);
    trainingData.push(...profileTrainingData);

    // Genel iş arama eğitim verisi oluştur
    const jobSearchTrainingData = this.generateJobSearchTrainingData(modelId, userId, userJobs);
    trainingData.push(...jobSearchTrainingData);

    return this.trainingDataRepository.save(trainingData);
  }

  // Kullanıcı bazlı model eğitimi
  async trainModelForUser(modelId: string, userId: string): Promise<AiModel> {
    const model = await this.aiModelRepository.findOne({ where: { id: modelId } });
    if (!model) {
      throw new NotFoundException('AI model bulunamadı');
    }

    // Kullanıcı için eğitim verisi oluştur
    await this.generateTrainingDataFromUserMessages(modelId, userId);

    // Modeli eğit
    return this.trainModel(modelId);
  }

  // Tüm kullanıcılar için otomatik eğitim
  async autoTrainModelForAllUsers(modelId: string): Promise<any> {
    const users = await this.userRepository.find({
      relations: ['userInfos']
    });
    const model = await this.aiModelRepository.findOne({ where: { id: modelId } });
    
    if (!model) {
      throw new NotFoundException('AI model bulunamadı');
    }

    let totalTrainingData = 0;
    let processedUsers = 0;
    const results = [];

    console.log(`🚀 Otomatik eğitim başlatılıyor... ${users.length} kullanıcı için`);

    // Her kullanıcı için eğitim verisi oluştur
    for (const user of users) {
      try {
        console.log(`📝 Kullanıcı ${user.id} (${user.userType}) için eğitim verisi oluşturuluyor...`);
        
        // Kullanıcı tipine göre eğitim verisi oluştur
        const trainingData = await this.generateUserTypeBasedTrainingData(
          modelId,
          user.id,
          user.userType as 'employer' | 'worker'
        );
        
        totalTrainingData += trainingData.length;
        processedUsers++;
        
        results.push({
          userId: user.id,
          userType: user.userType,
          trainingDataCount: trainingData.length,
          status: 'success'
        });
        
        console.log(`✅ Kullanıcı ${user.id} için ${trainingData.length} eğitim verisi oluşturuldu`);
      } catch (error) {
        console.log(`❌ Kullanıcı ${user.id} için eğitim verisi oluşturulamadı:`, error.message);
        results.push({
          userId: user.id,
          userType: user.userType,
          trainingDataCount: 0,
          status: 'error',
          error: error.message
        });
      }
    }

    console.log(`🎯 Model eğitimi başlatılıyor...`);
    
    // Modeli eğit
    const trainedModel = await this.trainModel(modelId);

    console.log(`✅ Otomatik eğitim tamamlandı! ${processedUsers}/${users.length} kullanıcı işlendi, ${totalTrainingData} eğitim verisi oluşturuldu`);

    return {
      ...trainedModel,
      additionalInfo: {
        trainingDataCount: totalTrainingData,
        processedUsers,
        totalUsers: users.length,
        results
      }
    };
  }

  // Mesaj kalitesi kontrolü
  private isValidTrainingMessage(message: string): boolean {
    if (!message || message.length < 3) return false;
    if (message.length > 500) return false; // Çok uzun mesajlar
    if (message.includes('http') || message.includes('www')) return false; // Link içeren mesajlar
    return true;
  }

  // Mesaj rating hesaplama
  private calculateMessageRating(input: string, response: string): number {
    let rating = 3; // Varsayılan rating

    // Mesaj uzunluğu kontrolü
    if (response.length > 10 && response.length < 200) rating += 1;
    
    // Soru-cevap kontrolü
    if (input.includes('?') && !response.includes('?')) rating += 1;
    
    // Emoji kontrolü
    if (response.includes('😊') || response.includes('👍') || response.includes('🙏')) rating += 0.5;
    
    // Profesyonel dil kontrolü
    const professionalWords = ['teşekkür', 'rica', 'lütfen', 'memnun', 'güvenilir', 'kaliteli'];
    if (professionalWords.some(word => response.toLowerCase().includes(word))) rating += 0.5;

    return Math.min(5, Math.max(1, rating));
  }

  // İş bağlamı çıkarma
  private extractJobContext(userJobs: Job[], message: string): any {
    const jobContext = {
      hasJobs: userJobs.length > 0,
      jobCategories: [],
      jobTitles: []
    };

    if (userJobs.length > 0) {
      jobContext.jobCategories = [...new Set(userJobs.map(job => job.category?.name).filter(Boolean))];
      jobContext.jobTitles = userJobs.map(job => job.title).filter(Boolean);
    }

    return jobContext;
  }

  // Profil bazlı eğitim verisi oluştur
  private generateProfileBasedTrainingData(modelId: string, userId: string, user: User, userJobs: Job[]): AiTrainingData[] {
    const trainingData: AiTrainingData[] = [];

    // Kullanıcı tipine göre eğitim verisi
    if (userJobs.length > 0) {
      // İşveren için eğitim verisi
      trainingData.push(
        this.trainingDataRepository.create({
          aiModelId: modelId,
          userId: userId,
          inputMessage: "İşçi arıyorum",
          responseMessage: "Hangi kategoride işçi arıyorsunuz? Size uygun adayları bulabilirim.",
          rating: 4,
          context: { userType: 'employer' }
        }),
        this.trainingDataRepository.create({
          aiModelId: modelId,
          userId: userId,
          inputMessage: "Güvenilir işçi bulamıyorum",
          responseMessage: "Profilinizi detaylı doldurun ve referanslarınızı ekleyin. Bu şekilde daha güvenilir adaylar bulabilirsiniz.",
          rating: 4,
          context: { userType: 'employer' }
        })
      );
    } else {
      // İşçi için eğitim verisi
      trainingData.push(
        this.trainingDataRepository.create({
          aiModelId: modelId,
          userId: userId,
          inputMessage: "İş arıyorum",
          responseMessage: "Hangi alanda çalışmak istiyorsunuz? Size uygun iş ilanlarını gösterebilirim.",
          rating: 4,
          context: { userType: 'worker' }
        }),
        this.trainingDataRepository.create({
          aiModelId: modelId,
          userId: userId,
          inputMessage: "Deneyimim yok",
          responseMessage: "Deneyimsiz işçiler için de iş ilanları var. Profilinizi güncelleyin ve başvurmaya başlayın.",
          rating: 4,
          context: { userType: 'worker' }
        })
      );
    }

    return trainingData;
  }

  // İş arama eğitim verisi oluştur
  private generateJobSearchTrainingData(modelId: string, userId: string, userJobs: Job[]): AiTrainingData[] {
    const trainingData: AiTrainingData[] = [];

    // Genel iş arama soruları
    const generalQuestions = [
      { input: "Nasıl iş bulabilirim?", response: "Profilinizi güncelleyin, kategorilerinizi seçin ve aktif iş ilanlarını takip edin." },
      { input: "Hangi işler var?", response: "Temizlik, bakım, inşaat, bahçe, ev işleri gibi birçok kategori var. Hangi alanda çalışmak istiyorsunuz?" },
      { input: "Maaş ne kadar?", response: "Maaşlar iş türüne ve deneyime göre değişir. İlan detaylarında maaş bilgisi bulabilirsiniz." },
      { input: "Güvenli mi?", response: "Tüm kullanıcılar doğrulanmıştır ve yorum sistemi ile güvenilirlik kontrol edilir." }
    ];

    generalQuestions.forEach(q => {
      trainingData.push(
        this.trainingDataRepository.create({
          aiModelId: modelId,
          userId: userId,
          inputMessage: q.input,
          responseMessage: q.response,
          rating: 4,
          context: { type: 'general_job_search' }
        })
      );
    });

    return trainingData;
  }

  // Model eğit
  async trainModel(modelId: string): Promise<AiModel> {
    const model = await this.aiModelRepository.findOne({ where: { id: modelId } });
    if (!model) {
      throw new NotFoundException('AI model bulunamadı');
    }

    // Eğitim durumunu güncelle
    model.status = AiModelStatus.TRAINING;
    await this.aiModelRepository.save(model);

    try {
      // Eğitim verilerini al
      const trainingData = await this.trainingDataRepository.find({
        where: { aiModelId: modelId, isUsedForTraining: false },
      });

      if (trainingData.length === 0) {
        throw new Error('Bu model için eğitim verisi bulunamadı. Lütfen önce eğitim verisi ekleyin.');
      }

      // Basit pattern matching algoritması
      const patterns = this.extractPatterns(trainingData);
      
      // Model konfigürasyonunu güncelle
      model.modelConfig = {
        ...model.modelConfig,
        patterns,
        lastTrainedAt: new Date(),
      };
      
      model.trainingDataCount = trainingData.length;
      model.accuracy = this.calculateAccuracy(trainingData, patterns);
      model.status = AiModelStatus.ACTIVE;
      model.lastTrainedAt = new Date();

      // Eğitim verilerini kullanıldı olarak işaretle
      await this.trainingDataRepository.update(
        { aiModelId: modelId },
        { isUsedForTraining: true }
      );

      return this.aiModelRepository.save(model);
    } catch (error) {
      model.status = AiModelStatus.INACTIVE;
      await this.aiModelRepository.save(model);
      throw error;
    }
  }

  // AI yanıtı oluştur
  async generateResponse(userId: string, message: string): Promise<string | null> {
    console.log(`🤖 AI yanıtı oluşturuluyor...`);
    console.log(`👤 Kullanıcı ID: ${userId}`);
    console.log(`💬 Mesaj: ${message}`);
    
    const activeModel = await this.getActiveModel();
    console.log(`🔍 Aktif model:`, activeModel ? `ID: ${activeModel.id}, Status: ${activeModel.status}` : 'Bulunamadı');
    
    if (!activeModel || activeModel.status !== AiModelStatus.ACTIVE) {
      console.log(`❌ Aktif AI modeli bulunamadı veya aktif değil`);
      
      // Test için basit yanıtlar verelim
      const testResponses = {
        'merhaba': 'Merhaba! Ben AI asistanınızım. Size nasıl yardımcı olabilirim?',
        'nasılsın': 'İyiyim, teşekkürler! Siz nasılsınız?',
        'iş': 'İş konusunda size yardımcı olabilirim. Hangi alanda çalışmak istiyorsunuz?',
        'maaş': 'Maaş konusunda bilgi verebilirim. Deneyim seviyenize göre değişir.',
        'deneyim': 'Deneyim konusunda endişelenmeyin. Her seviyede iş var.'
      };
      
      const lowerMessage = message.toLowerCase();
      for (const [key, response] of Object.entries(testResponses)) {
        if (lowerMessage.includes(key)) {
          console.log(`✅ Test yanıtı bulundu: ${response}`);
          return response;
        }
      }
      
      console.log(`✅ Varsayılan test yanıtı veriliyor`);
      return 'Teşekkürler! Mesajınızı aldım. Size en kısa sürede dönüş yapacağım.';
    }

    // Model aktif ama patterns yoksa, training data'dan patterns oluştur
    let patterns = activeModel.modelConfig?.patterns || [];
    console.log(`📋 Mevcut pattern sayısı: ${patterns.length}`);
    
    if (patterns.length === 0) {
      console.log(`🔄 Training data'dan patterns oluşturuluyor...`);
      
      // Bu model için training data'yı al
      const trainingData = await this.trainingDataRepository.find({
        where: { aiModelId: activeModel.id }
      });
      
      console.log(`📊 Training data sayısı: ${trainingData.length}`);
      
      if (trainingData.length > 0) {
        patterns = this.extractPatterns(trainingData);
        console.log(`✅ ${patterns.length} pattern oluşturuldu`);
        
        // Model config'i güncelle
        await this.aiModelRepository.update(activeModel.id, {
          modelConfig: { ...activeModel.modelConfig, patterns }
        });
      } else {
        console.log(`❌ Training data bulunamadı`);
      }
    }
    
    const response = this.findBestResponse(message, patterns);
    console.log(`✅ AI yanıtı: ${response}`);
    return response;
  }

  // Pattern'leri çıkar
  private extractPatterns(trainingData: AiTrainingData[]): any[] {
    const patterns = [];
    
    trainingData.forEach(data => {
      const words = data.inputMessage.toLowerCase().split(' ');
      const response = data.responseMessage;
      
      patterns.push({
        keywords: words,
        response,
        rating: data.rating,
        count: 1,
      });
    });

    return patterns;
  }

  // En iyi yanıtı bul
  private findBestResponse(message: string, patterns: any[]): string {
    const messageWords = message.toLowerCase().split(' ');
    let bestMatch = null;
    let bestScore = 0;

    console.log(`🔍 "${message}" için en iyi yanıt aranıyor...`);
    console.log(`📝 Mesaj kelimeleri: ${messageWords.join(', ')}`);

    patterns.forEach((pattern, index) => {
      const score = this.calculateSimilarity(messageWords, pattern.keywords);
      console.log(`📊 Pattern ${index + 1}: "${pattern.keywords.join(' ')}" -> Score: ${score.toFixed(3)}`);
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = pattern;
      }
    });

    console.log(`🏆 En iyi skor: ${bestScore.toFixed(3)}`);
    console.log(`🎯 En iyi eşleşme: ${bestMatch ? bestMatch.response.substring(0, 50) + '...' : 'Yok'}`);

    // Eşik değerini düşürelim (0.1)
    if (bestScore > 0.1 && bestMatch) {
      console.log(`✅ Eşik değeri geçildi (${bestScore.toFixed(3)} > 0.1), yanıt veriliyor`);
      return bestMatch.response;
    }

    console.log(`❌ Eşik değeri geçilemedi (${bestScore.toFixed(3)} <= 0.1), yanıt verilmiyor`);
    return null;
  }

  // Benzerlik hesapla
  private calculateSimilarity(messageWords: string[], patternWords: string[]): number {
    const commonWords = messageWords.filter(word => patternWords.includes(word));
    return commonWords.length / Math.max(messageWords.length, patternWords.length);
  }

  // Doğruluk hesapla
  private calculateAccuracy(trainingData: AiTrainingData[], patterns: any[]): number {
    let correctPredictions = 0;
    
    trainingData.forEach(data => {
      const predictedResponse = this.findBestResponse(data.inputMessage, patterns);
      if (predictedResponse === data.responseMessage) {
        correctPredictions++;
      }
    });

    return trainingData.length > 0 ? correctPredictions / trainingData.length : 0;
  }

  // Kullanıcının mesaj geçmişini analiz et
  async analyzeUserMessages(userId: string): Promise<any> {
    const messages = await this.messageRepository.find({
      where: [
        { senderId: userId },
        { receiverId: userId },
      ],
      order: { createdAt: 'ASC' },
    });
    
    const analysis = {
      totalMessages: messages.length,
      averageMessageLength: 0,
      commonWords: {},
      responsePatterns: [],
    };

    if (messages.length > 0) {
      const totalLength = messages.reduce((sum, msg) => sum + msg.content.length, 0);
      analysis.averageMessageLength = totalLength / messages.length;

      // Sık kullanılan kelimeleri bul
      messages.forEach(msg => {
        const words = msg.content.toLowerCase().split(' ');
        words.forEach(word => {
          if (word.length > 2) {
            analysis.commonWords[word] = (analysis.commonWords[word] || 0) + 1;
          }
        });
      });
    }

    return analysis;
  }
} 