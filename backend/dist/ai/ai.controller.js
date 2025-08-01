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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ai_service_1 = require("./ai.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let AiController = class AiController {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async createModel(createModelDto) {
        return this.aiService.createModel(createModelDto.name, createModelDto.description);
    }
    async getAllModels() {
        return this.aiService.getAllModels();
    }
    async getActiveModel() {
        return this.aiService.getActiveModel();
    }
    async getTrainingDataCount(modelId) {
        return this.aiService.getTrainingDataCount(modelId);
    }
    async updateModelStatus(modelId, updateStatusDto) {
        return this.aiService.updateModelStatus(modelId, updateStatusDto.status);
    }
    async trainModel(modelId) {
        return this.aiService.trainModel(modelId);
    }
    async trainModelForUser(modelId, userId) {
        return this.aiService.trainModelForUser(modelId, userId);
    }
    async autoTrainModelForAllUsers(modelId) {
        return this.aiService.autoTrainModelForAllUsers(modelId);
    }
    async addTrainingData(modelId, trainingDataDto) {
        return this.aiService.addTrainingData(modelId, trainingDataDto.userId, trainingDataDto.inputMessage, trainingDataDto.responseMessage, trainingDataDto.context);
    }
    async generateTrainingDataFromUserMessages(modelId, userId) {
        return this.aiService.generateTrainingDataFromUserMessages(modelId, userId);
    }
    async generateWelcomeMessage(userId, welcomeDto) {
        const message = await this.aiService.generateWelcomeMessage(userId, welcomeDto.userType);
        return { message };
    }
    async generateJobDetailsMessage(jobId, jobDetailsDto) {
        const message = await this.aiService.generateJobDetailsMessage(jobId, jobDetailsDto.userId);
        return { message };
    }
    async generateUserTypeBasedTrainingData(modelId, userId, userTypeDto) {
        return this.aiService.generateUserTypeBasedTrainingData(modelId, userId, userTypeDto.userType);
    }
    async generateUserAnalysis(userId) {
        return this.aiService.generateUserAnalysis(userId);
    }
    async generateAllUsersAnalysis() {
        const users = await this.aiService['userRepository'].find();
        const analyses = [];
        for (const user of users) {
            try {
                const analysis = await this.aiService.generateUserAnalysis(user.id);
                analyses.push(analysis);
            }
            catch (error) {
                console.log(`Kullanıcı ${user.id} analizi oluşturulamadı:`, error.message);
            }
        }
        return {
            totalUsers: users.length,
            analyzedUsers: analyses.length,
            analyses
        };
    }
    async generateResponse(generateResponseDto) {
        const response = await this.aiService.generateResponse(generateResponseDto.userId, generateResponseDto.message);
        return { response };
    }
    async analyzeUserMessages(userId) {
        return this.aiService.analyzeUserMessages(userId);
    }
    async testResponse(testDto) {
        const response = await this.aiService.generateResponse('test-user', testDto.message);
        return { response };
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('models'),
    (0, swagger_1.ApiOperation)({ summary: 'AI model oluştur' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'AI model oluşturuldu' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "createModel", null);
__decorate([
    (0, common_1.Get)('models'),
    (0, swagger_1.ApiOperation)({ summary: 'Tüm AI modellerini listele' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'AI modelleri listelendi' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getAllModels", null);
__decorate([
    (0, common_1.Get)('active-model'),
    (0, swagger_1.ApiOperation)({ summary: 'Aktif AI modelini getir' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Aktif AI modeli' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getActiveModel", null);
__decorate([
    (0, common_1.Get)('training-data-count/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Model için eğitim verisi sayısını getir' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Eğitim verisi sayısı' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getTrainingDataCount", null);
__decorate([
    (0, common_1.Put)('models/:id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'AI model durumunu güncelle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'AI model durumu güncellendi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "updateModelStatus", null);
__decorate([
    (0, common_1.Post)('train/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'AI modeli eğit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'AI model eğitildi' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Eğitim verisi bulunamadı' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "trainModel", null);
__decorate([
    (0, common_1.Post)('models/:id/train/user/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı bazlı AI modeli eğit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'AI model kullanıcı için eğitildi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "trainModelForUser", null);
__decorate([
    (0, common_1.Post)('auto-train-all-users/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Tüm kullanıcılar için AI modeli otomatik eğit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'AI model tüm kullanıcılar için eğitildi' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "autoTrainModelForAllUsers", null);
__decorate([
    (0, common_1.Post)('models/:id/training-data'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Eğitim verisi ekle' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Eğitim verisi eklendi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "addTrainingData", null);
__decorate([
    (0, common_1.Post)('models/:id/generate-training-data/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı mesajlarından eğitim verisi oluştur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Eğitim verisi oluşturuldu' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateTrainingDataFromUserMessages", null);
__decorate([
    (0, common_1.Post)('welcome-message/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı tipine göre karşılama mesajı oluştur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Karşılama mesajı oluşturuldu' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateWelcomeMessage", null);
__decorate([
    (0, common_1.Post)('job-details-message/:jobId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'İş detayları için otomatik mesaj oluştur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'İş detayları mesajı oluşturuldu' }),
    __param(0, (0, common_1.Param)('jobId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateJobDetailsMessage", null);
__decorate([
    (0, common_1.Post)('models/:id/user-type-training/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı tipine göre otomatik eğitim verisi oluştur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcı tipine göre eğitim verisi oluşturuldu' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateUserTypeBasedTrainingData", null);
__decorate([
    (0, common_1.Get)('user-analysis/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı analizi oluştur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcı analizi oluşturuldu' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateUserAnalysis", null);
__decorate([
    (0, common_1.Get)('user-analysis'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tüm kullanıcıların analizini oluştur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tüm kullanıcı analizleri oluşturuldu' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateAllUsersAnalysis", null);
__decorate([
    (0, common_1.Post)('generate-response'),
    (0, swagger_1.ApiOperation)({ summary: 'AI yanıtı oluştur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'AI yanıtı oluşturuldu' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateResponse", null);
__decorate([
    (0, common_1.Get)('analyze/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcı mesajlarını analiz et' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcı analizi' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "analyzeUserMessages", null);
__decorate([
    (0, common_1.Post)('test-response'),
    (0, swagger_1.ApiOperation)({ summary: 'AI yanıtını test et (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'AI yanıtı test edildi' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "testResponse", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)('AI'),
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map