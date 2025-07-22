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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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

  @Get('models/active')
  @ApiOperation({ summary: 'Aktif AI modelini getir' })
  @ApiResponse({ status: 200, description: 'Aktif AI modeli' })
  async getActiveModel() {
    return this.aiService.getActiveModel();
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

  @Post('models/:id/train')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'AI modeli eğit' })
  @ApiResponse({ status: 200, description: 'AI model eğitildi' })
  async trainModel(@Param('id') modelId: string) {
    return this.aiService.trainModel(modelId);
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

  @Post('generate-response')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'AI yanıtı oluştur' })
  @ApiResponse({ status: 200, description: 'AI yanıtı oluşturuldu' })
  async generateResponse(
    @Request() req,
    @Body() generateResponseDto: { message: string },
  ) {
    const response = await this.aiService.generateResponse(
      req.user.sub,
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