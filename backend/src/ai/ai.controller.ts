import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiModelStatus } from './entities/ai-model.entity';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('models')
  @ApiOperation({ summary: 'AI model oluştur' })
  @ApiResponse({ status: 201, description: 'AI model oluşturuldu' })
  async createModel(
    @Body() createModelDto: { name: string; description?: string },
  ) {
    return this.aiService.createModel(createModelDto.name, createModelDto.description);
  }

  @Get('models')
  @ApiOperation({ summary: 'Tüm AI modellerini listele' })
  @ApiResponse({ status: 200, description: 'AI modelleri listelendi' })
  async getAllModels() {
    return this.aiService.getAllModels();
  }

  @Get('active-model')
  @ApiOperation({ summary: 'Aktif AI modelini getir' })
  @ApiResponse({ status: 200, description: 'Aktif AI modeli' })
  async getActiveModel() {
    return this.aiService.getActiveModel();
  }

  @Get('training-data-count/:id')
  @ApiOperation({ summary: 'Model için eğitim verisi sayısını getir' })
  @ApiResponse({ status: 200, description: 'Eğitim verisi sayısı' })
  async getTrainingDataCount(@Param('id') modelId: string) {
    return this.aiService.getTrainingDataCount(modelId);
  }

  @Put('models/:id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'AI model durumunu güncelle' })
  @ApiResponse({ status: 200, description: 'AI model durumu güncellendi' })
  async updateModelStatus(
    @Param('id') modelId: string,
    @Body() updateStatusDto: { status: AiModelStatus },
  ) {
    return this.aiService.updateModelStatus(modelId, updateStatusDto.status);
  }

  @Post('train/:id')
  @ApiOperation({ summary: 'AI modeli eğit' })
  @ApiResponse({ status: 200, description: 'AI model eğitildi' })
  @ApiResponse({ status: 400, description: 'Eğitim verisi bulunamadı' })
  async trainModel(@Param('id') modelId: string) {
    return this.aiService.trainModel(modelId);
  }

  @Post('models/:id/train/user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı bazlı AI modeli eğit' })
  @ApiResponse({ status: 200, description: 'AI model kullanıcı için eğitildi' })
  async trainModelForUser(
    @Param('id') modelId: string,
    @Param('userId') userId: string,
  ) {
    return this.aiService.trainModelForUser(modelId, userId);
  }

  @Post('auto-train-all-users/:id')
  @ApiOperation({ summary: 'Tüm kullanıcılar için AI modeli otomatik eğit' })
  @ApiResponse({ status: 200, description: 'AI model tüm kullanıcılar için eğitildi' })
  async autoTrainModelForAllUsers(@Param('id') modelId: string) {
    return this.aiService.autoTrainModelForAllUsers(modelId);
  }

  @Post('models/:id/training-data')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eğitim verisi ekle' })
  @ApiResponse({ status: 201, description: 'Eğitim verisi eklendi' })
  async addTrainingData(
    @Param('id') modelId: string,
    @Body() trainingDataDto: {
      userId: string;
      inputMessage: string;
      responseMessage: string;
      context?: any;
    },
  ) {
    return this.aiService.addTrainingData(
      modelId,
      trainingDataDto.userId,
      trainingDataDto.inputMessage,
      trainingDataDto.responseMessage,
      trainingDataDto.context,
    );
  }

  @Post('models/:id/generate-training-data/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı mesajlarından eğitim verisi oluştur' })
  @ApiResponse({ status: 200, description: 'Eğitim verisi oluşturuldu' })
  async generateTrainingDataFromUserMessages(
    @Param('id') modelId: string,
    @Param('userId') userId: string,
  ) {
    return this.aiService.generateTrainingDataFromUserMessages(modelId, userId);
  }

  // Yeni endpoint'ler - Otomatik Mesajlaşma
  @Post('welcome-message/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı tipine göre karşılama mesajı oluştur' })
  @ApiResponse({ status: 200, description: 'Karşılama mesajı oluşturuldu' })
  async generateWelcomeMessage(
    @Param('userId') userId: string,
    @Body() welcomeDto: { userType: 'employer' | 'worker' },
  ) {
    const message = await this.aiService.generateWelcomeMessage(userId, welcomeDto.userType);
    return { message };
  }

  @Post('job-details-message/:jobId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İş detayları için otomatik mesaj oluştur' })
  @ApiResponse({ status: 200, description: 'İş detayları mesajı oluşturuldu' })
  async generateJobDetailsMessage(
    @Param('jobId') jobId: string,
    @Body() jobDetailsDto: { userId: string },
  ) {
    const message = await this.aiService.generateJobDetailsMessage(jobId, jobDetailsDto.userId);
    return { message };
  }

  @Post('models/:id/user-type-training/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı tipine göre otomatik eğitim verisi oluştur' })
  @ApiResponse({ status: 200, description: 'Kullanıcı tipine göre eğitim verisi oluşturuldu' })
  async generateUserTypeBasedTrainingData(
    @Param('id') modelId: string,
    @Param('userId') userId: string,
    @Body() userTypeDto: { userType: 'employer' | 'worker' },
  ) {
    return this.aiService.generateUserTypeBasedTrainingData(modelId, userId, userTypeDto.userType);
  }

  // Yeni endpoint'ler - Kullanıcı Analizi
  @Get('user-analysis/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı analizi oluştur' })
  @ApiResponse({ status: 200, description: 'Kullanıcı analizi oluşturuldu' })
  async generateUserAnalysis(@Param('userId') userId: string) {
    return this.aiService.generateUserAnalysis(userId);
  }

  @Get('user-analysis')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tüm kullanıcıların analizini oluştur' })
  @ApiResponse({ status: 200, description: 'Tüm kullanıcı analizleri oluşturuldu' })
  async generateAllUsersAnalysis() {
    const users = await this.aiService['userRepository'].find();
    const analyses = [];

    for (const user of users) {
      try {
        const analysis = await this.aiService.generateUserAnalysis(user.id);
        analyses.push(analysis);
      } catch (error) {
        console.log(`Kullanıcı ${user.id} analizi oluşturulamadı:`, error.message);
      }
    }

    return {
      totalUsers: users.length,
      analyzedUsers: analyses.length,
      analyses
    };
  }

  @Post('generate-response')
  @ApiOperation({ summary: 'AI yanıtı oluştur' })
  @ApiResponse({ status: 200, description: 'AI yanıtı oluşturuldu' })
  async generateResponse(
    @Body() generateResponseDto: { userId: string; message: string },
  ) {
    const response = await this.aiService.generateResponse(
      generateResponseDto.userId,
      generateResponseDto.message,
    );
    return { response };
  }

  @Get('analyze/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı mesajlarını analiz et' })
  @ApiResponse({ status: 200, description: 'Kullanıcı analizi' })
  async analyzeUserMessages(@Param('userId') userId: string) {
    return this.aiService.analyzeUserMessages(userId);
  }

  // Public endpoint for testing AI responses
  @Post('test-response')
  @ApiOperation({ summary: 'AI yanıtını test et (Public)' })
  @ApiResponse({ status: 200, description: 'AI yanıtı test edildi' })
  async testResponse(@Body() testDto: { message: string }) {
    const response = await this.aiService.generateResponse('test-user', testDto.message);
    return { response };
  }
} 