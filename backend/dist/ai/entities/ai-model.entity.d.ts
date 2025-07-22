import { AiTrainingData } from './ai-training-data.entity';
export declare enum AiModelStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    TRAINING = "training"
}
export declare class AiModel {
    id: string;
    name: string;
    description: string;
    status: AiModelStatus;
    modelConfig: any;
    trainingDataCount: number;
    accuracy: number;
    lastTrainedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    trainingData: AiTrainingData[];
}
