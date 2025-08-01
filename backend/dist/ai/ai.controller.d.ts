import { AiService } from './ai.service';
import { AiModelStatus } from './entities/ai-model.entity';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    createModel(createModelDto: {
        name: string;
        description?: string;
    }): Promise<import("./entities/ai-model.entity").AiModel>;
    getAllModels(): Promise<import("./entities/ai-model.entity").AiModel[]>;
    getActiveModel(): Promise<import("./entities/ai-model.entity").AiModel>;
    getTrainingDataCount(modelId: string): Promise<{
        total: number;
        unused: number;
    }>;
    updateModelStatus(modelId: string, updateStatusDto: {
        status: AiModelStatus;
    }): Promise<import("./entities/ai-model.entity").AiModel>;
    trainModel(modelId: string): Promise<import("./entities/ai-model.entity").AiModel>;
    trainModelForUser(modelId: string, userId: string): Promise<import("./entities/ai-model.entity").AiModel>;
    autoTrainModelForAllUsers(modelId: string): Promise<any>;
    addTrainingData(modelId: string, trainingDataDto: {
        userId: string;
        inputMessage: string;
        responseMessage: string;
        context?: any;
    }): Promise<import("./entities/ai-training-data.entity").AiTrainingData>;
    generateTrainingDataFromUserMessages(modelId: string, userId: string): Promise<import("./entities/ai-training-data.entity").AiTrainingData[]>;
    generateWelcomeMessage(userId: string, welcomeDto: {
        userType: 'employer' | 'worker';
    }): Promise<{
        message: string;
    }>;
    generateJobDetailsMessage(jobId: string, jobDetailsDto: {
        userId: string;
    }): Promise<{
        message: string;
    }>;
    generateUserTypeBasedTrainingData(modelId: string, userId: string, userTypeDto: {
        userType: 'employer' | 'worker';
    }): Promise<import("./entities/ai-training-data.entity").AiTrainingData[]>;
    generateUserAnalysis(userId: string): Promise<any>;
    generateAllUsersAnalysis(): Promise<{
        totalUsers: number;
        analyzedUsers: number;
        analyses: any[];
    }>;
    generateResponse(generateResponseDto: {
        userId: string;
        message: string;
    }): Promise<{
        response: string;
    }>;
    analyzeUserMessages(userId: string): Promise<any>;
    testResponse(testDto: {
        message: string;
    }): Promise<{
        response: string;
    }>;
}
