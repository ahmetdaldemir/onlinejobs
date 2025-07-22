import { AiModel } from './ai-model.entity';
export declare class AiTrainingData {
    id: string;
    userId: string;
    inputMessage: string;
    responseMessage: string;
    context: any;
    rating: number;
    isUsedForTraining: boolean;
    createdAt: Date;
    updatedAt: Date;
    aiModel: AiModel;
    aiModelId: string;
}
