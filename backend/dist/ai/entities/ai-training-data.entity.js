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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiTrainingData = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const ai_model_entity_1 = require("./ai-model.entity");
let AiTrainingData = class AiTrainingData {
};
exports.AiTrainingData = AiTrainingData;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AiTrainingData.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AiTrainingData.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AiTrainingData.prototype, "inputMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AiTrainingData.prototype, "responseMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AiTrainingData.prototype, "context", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AiTrainingData.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], AiTrainingData.prototype, "isUsedForTraining", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AiTrainingData.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AiTrainingData.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ai_model_entity_1.AiModel, (aiModel) => aiModel.trainingData),
    (0, typeorm_1.JoinColumn)({ name: 'aiModelId' }),
    __metadata("design:type", ai_model_entity_1.AiModel)
], AiTrainingData.prototype, "aiModel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AiTrainingData.prototype, "aiModelId", void 0);
exports.AiTrainingData = AiTrainingData = __decorate([
    (0, typeorm_1.Entity)('ai_training_data')
], AiTrainingData);
//# sourceMappingURL=ai-training-data.entity.js.map