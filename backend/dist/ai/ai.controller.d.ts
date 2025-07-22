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
    updateModelStatus(modelId: string, updateStatusDto: {
        status: AiModelStatus;
    }): Promise<import("./entities/ai-model.entity").AiModel>;
    trainModel(modelId: string): Promise<import("./entities/ai-model.entity").AiModel>;
    addTrainingData(modelId: string, trainingDataDto: {
        userId: string;
        inputMessage: string;
        responseMessage: string;
        context?: any;
    }): Promise<import("./entities/ai-training-data.entity").AiTrainingData>;
    generateResponse(req: any, generateResponseDto: {
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
