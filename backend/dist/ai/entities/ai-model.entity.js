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
exports.AiModel = exports.AiModelStatus = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const ai_training_data_entity_1 = require("./ai-training-data.entity");
var AiModelStatus;
(function (AiModelStatus) {
    AiModelStatus["ACTIVE"] = "active";
    AiModelStatus["INACTIVE"] = "inactive";
    AiModelStatus["TRAINING"] = "training";
})(AiModelStatus || (exports.AiModelStatus = AiModelStatus = {}));
let AiModel = class AiModel {
};
exports.AiModel = AiModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AiModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AiModel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AiModel.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AiModelStatus,
        default: AiModelStatus.INACTIVE,
    }),
    (0, swagger_1.ApiProperty)({ enum: AiModelStatus }),
    __metadata("design:type", String)
], AiModel.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], AiModel.prototype, "modelConfig", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AiModel.prototype, "trainingDataCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AiModel.prototype, "accuracy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AiModel.prototype, "lastTrainedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AiModel.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AiModel.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ai_training_data_entity_1.AiTrainingData, (trainingData) => trainingData.aiModel),
    __metadata("design:type", Array)
], AiModel.prototype, "trainingData", void 0);
exports.AiModel = AiModel = __decorate([
    (0, typeorm_1.Entity)('ai_models')
], AiModel);
//# sourceMappingURL=ai-model.entity.js.map