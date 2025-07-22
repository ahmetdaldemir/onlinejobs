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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ai_model_entity_1 = require("./entities/ai-model.entity");
const ai_training_data_entity_1 = require("./entities/ai-training-data.entity");
const message_entity_1 = require("../messages/entities/message.entity");
let AiService = class AiService {
    constructor(aiModelRepository, trainingDataRepository, messageRepository) {
        this.aiModelRepository = aiModelRepository;
        this.trainingDataRepository = trainingDataRepository;
        this.messageRepository = messageRepository;
    }
    async createModel(name, description) {
        const model = this.aiModelRepository.create({
            name,
            description,
            status: ai_model_entity_1.AiModelStatus.INACTIVE,
            modelConfig: {
                learningRate: 0.01,
                maxEpochs: 100,
                batchSize: 32,
            },
        });
        return this.aiModelRepository.save(model);
    }
    async updateModelStatus(modelId, status) {
        const model = await this.aiModelRepository.findOne({ where: { id: modelId } });
        if (!model) {
            throw new common_1.NotFoundException('AI model bulunamadı');
        }
        model.status = status;
        return this.aiModelRepository.save(model);
    }
    async getActiveModel() {
        return this.aiModelRepository.findOne({ where: { status: ai_model_entity_1.AiModelStatus.ACTIVE } });
    }
    async getAllModels() {
        return this.aiModelRepository.find();
    }
    async addTrainingData(modelId, userId, inputMessage, responseMessage, context) {
        const trainingData = this.trainingDataRepository.create({
            aiModelId: modelId,
            userId,
            inputMessage,
            responseMessage,
            context,
        });
        return this.trainingDataRepository.save(trainingData);
    }
    async trainModel(modelId) {
        const model = await this.aiModelRepository.findOne({ where: { id: modelId } });
        if (!model) {
            throw new common_1.NotFoundException('AI model bulunamadı');
        }
        model.status = ai_model_entity_1.AiModelStatus.TRAINING;
        await this.aiModelRepository.save(model);
        try {
            const trainingData = await this.trainingDataRepository.find({
                where: { aiModelId: modelId, isUsedForTraining: false },
            });
            if (trainingData.length === 0) {
                throw new Error('Eğitim verisi bulunamadı');
            }
            const patterns = this.extractPatterns(trainingData);
            model.modelConfig = {
                ...model.modelConfig,
                patterns,
                lastTrainedAt: new Date(),
            };
            model.trainingDataCount = trainingData.length;
            model.accuracy = this.calculateAccuracy(trainingData, patterns);
            model.status = ai_model_entity_1.AiModelStatus.ACTIVE;
            model.lastTrainedAt = new Date();
            await this.trainingDataRepository.update({ aiModelId: modelId }, { isUsedForTraining: true });
            return this.aiModelRepository.save(model);
        }
        catch (error) {
            model.status = ai_model_entity_1.AiModelStatus.INACTIVE;
            await this.aiModelRepository.save(model);
            throw error;
        }
    }
    async generateResponse(userId, message) {
        const activeModel = await this.getActiveModel();
        if (!activeModel || activeModel.status !== ai_model_entity_1.AiModelStatus.ACTIVE) {
            return null;
        }
        const patterns = activeModel.modelConfig?.patterns || [];
        const response = this.findBestResponse(message, patterns);
        return response;
    }
    extractPatterns(trainingData) {
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
    findBestResponse(message, patterns) {
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
        if (bestScore > 0.3 && bestMatch) {
            return bestMatch.response;
        }
        return null;
    }
    calculateSimilarity(messageWords, patternWords) {
        const commonWords = messageWords.filter(word => patternWords.includes(word));
        return commonWords.length / Math.max(messageWords.length, patternWords.length);
    }
    calculateAccuracy(trainingData, patterns) {
        let correctPredictions = 0;
        trainingData.forEach(data => {
            const predictedResponse = this.findBestResponse(data.inputMessage, patterns);
            if (predictedResponse === data.responseMessage) {
                correctPredictions++;
            }
        });
        return trainingData.length > 0 ? correctPredictions / trainingData.length : 0;
    }
    async analyzeUserMessages(userId) {
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
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ai_model_entity_1.AiModel)),
    __param(1, (0, typeorm_1.InjectRepository)(ai_training_data_entity_1.AiTrainingData)),
    __param(2, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AiService);
//# sourceMappingURL=ai.service.js.map