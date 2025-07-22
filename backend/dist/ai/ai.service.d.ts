import { Repository } from 'typeorm';
import { AiModel, AiModelStatus } from './entities/ai-model.entity';
import { AiTrainingData } from './entities/ai-training-data.entity';
import { Message } from '../messages/entities/message.entity';
export declare class AiService {
    private aiModelRepository;
    private trainingDataRepository;
    private messageRepository;
    constructor(aiModelRepository: Repository<AiModel>, trainingDataRepository: Repository<AiTrainingData>, messageRepository: Repository<Message>);
    createModel(name: string, description?: string): Promise<AiModel>;
    updateModelStatus(modelId: string, status: AiModelStatus): Promise<AiModel>;
    getActiveModel(): Promise<AiModel | null>;
    getAllModels(): Promise<AiModel[]>;
    addTrainingData(modelId: string, userId: string, inputMessage: string, responseMessage: string, context?: any): Promise<AiTrainingData>;
    trainModel(modelId: string): Promise<AiModel>;
    generateResponse(userId: string, message: string): Promise<string | null>;
    private extractPatterns;
    private findBestResponse;
    private calculateSimilarity;
    private calculateAccuracy;
    analyzeUserMessages(userId: string): Promise<any>;
}
