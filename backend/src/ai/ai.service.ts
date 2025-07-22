import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiModel, AiModelStatus } from './entities/ai-model.entity';
import { AiTrainingData } from './entities/ai-training-data.entity';
import { Message } from '../messages/entities/message.entity';

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(AiModel)
    private aiModelRepository: Repository<AiModel>,
    @InjectRepository(AiTrainingData)
    private trainingDataRepository: Repository<AiTrainingData>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
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
        throw new Error('Eğitim verisi bulunamadı');
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
    const activeModel = await this.getActiveModel();
    if (!activeModel || activeModel.status !== AiModelStatus.ACTIVE) {
      return null;
    }

    // Basit pattern matching ile yanıt oluştur
    const patterns = activeModel.modelConfig?.patterns || [];
    const response = this.findBestResponse(message, patterns);
    
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

    patterns.forEach(pattern => {
      const score = this.calculateSimilarity(messageWords, pattern.keywords);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = pattern;
      }
    });

    // Eşik değeri (0.3) üzerindeyse yanıt ver
    if (bestScore > 0.3 && bestMatch) {
      return bestMatch.response;
    }

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