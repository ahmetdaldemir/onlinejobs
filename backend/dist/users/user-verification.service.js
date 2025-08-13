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
exports.UserVerificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_verification_entity_1 = require("./entities/user-verification.entity");
const user_entity_1 = require("./entities/user.entity");
let UserVerificationService = class UserVerificationService {
    constructor(verificationRepository, userRepository) {
        this.verificationRepository = verificationRepository;
        this.userRepository = userRepository;
    }
    async getUserVerifications(userId) {
        return this.verificationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async uploadDocument(userId, documentType, file, description) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        if (user.userType !== 'worker') {
            throw new common_1.BadRequestException('Sadece worker kullanıcıları belge yükleyebilir');
        }
        const existingVerification = await this.verificationRepository.findOne({
            where: { userId, documentType },
        });
        if (existingVerification) {
            throw new common_1.ConflictException('Bu belge türü için zaten bir belge yüklenmiş');
        }
        if (!this.isValidFileType(file.mimetype)) {
            throw new common_1.BadRequestException('Geçersiz dosya türü. Sadece PDF, JPG, PNG dosyaları kabul edilir');
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new common_1.BadRequestException('Dosya boyutu 5MB\'dan büyük olamaz');
        }
        const documentUrl = `/uploads/verifications/${file.filename}`;
        const verification = this.verificationRepository.create({
            userId,
            documentType,
            documentUrl,
            originalFileName: file.originalname,
            mimeType: file.mimetype,
            fileSize: file.size,
            status: user_verification_entity_1.VerificationStatus.PENDING,
        });
        return this.verificationRepository.save(verification);
    }
    async updateVerificationStatus(verificationId, adminId, updateDto) {
        const verification = await this.verificationRepository.findOne({
            where: { id: verificationId },
            relations: ['user'],
        });
        if (!verification) {
            throw new common_1.NotFoundException('Doğrulama belgesi bulunamadı');
        }
        verification.status = updateDto.status;
        verification.adminNotes = updateDto.adminNotes;
        verification.rejectionReason = updateDto.rejectionReason;
        verification.reviewedAt = new Date();
        verification.reviewedBy = adminId;
        const updatedVerification = await this.verificationRepository.save(verification);
        if (updateDto.status === 'approved') {
            await this.checkAndUpdateUserVerification(verification.userId);
        }
        return updatedVerification;
    }
    async checkAndUpdateUserVerification(userId) {
        const verifications = await this.verificationRepository.find({
            where: { userId },
        });
        const requiredDocumentTypes = [
            user_verification_entity_1.DocumentType.MASTERY_CERTIFICATE,
            user_verification_entity_1.DocumentType.TAX_CERTIFICATE,
            user_verification_entity_1.DocumentType.CONTRACT_PDF,
        ];
        const hasAllRequiredDocuments = requiredDocumentTypes.every(requiredType => verifications.some(v => v.documentType === requiredType));
        if (!hasAllRequiredDocuments) {
            return;
        }
        const allApproved = verifications.every(v => v.status === user_verification_entity_1.VerificationStatus.APPROVED);
        if (allApproved) {
            await this.userRepository.update(userId, { isVerified: true });
        }
    }
    async deleteDocument(verificationId, userId) {
        const verification = await this.verificationRepository.findOne({
            where: { id: verificationId, userId },
        });
        if (!verification) {
            throw new common_1.NotFoundException('Doğrulama belgesi bulunamadı');
        }
        if (verification.status !== user_verification_entity_1.VerificationStatus.PENDING) {
            throw new common_1.BadRequestException('Sadece bekleyen belgeler silinebilir');
        }
        await this.verificationRepository.remove(verification);
    }
    async getPendingVerifications() {
        return this.verificationRepository.find({
            where: { status: user_verification_entity_1.VerificationStatus.PENDING },
            relations: ['user'],
            order: { createdAt: 'ASC' },
        });
    }
    async getVerificationsByUserId(userId) {
        return this.verificationRepository.find({
            where: { userId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    isValidFileType(mimetype) {
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png',
        ];
        return allowedTypes.includes(mimetype);
    }
    async getUserVerificationStatus(userId) {
        const verifications = await this.verificationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        return {
            isVerified: user?.isVerified || false,
            totalDocuments: verifications.length,
            approvedDocuments: verifications.filter(v => v.status === user_verification_entity_1.VerificationStatus.APPROVED).length,
            pendingDocuments: verifications.filter(v => v.status === user_verification_entity_1.VerificationStatus.PENDING).length,
            rejectedDocuments: verifications.filter(v => v.status === user_verification_entity_1.VerificationStatus.REJECTED).length,
            documents: verifications,
        };
    }
    getRequiredDocumentTypes() {
        return [
            {
                type: user_verification_entity_1.DocumentType.MASTERY_CERTIFICATE,
                name: 'Ustalık Belgesi',
                description: 'Mesleki yeterlilik belgesi veya ustalık belgesi',
            },
            {
                type: user_verification_entity_1.DocumentType.TAX_CERTIFICATE,
                name: 'Vergi Levhası',
                description: 'Vergi dairesinden alınan vergi levhası',
            },
            {
                type: user_verification_entity_1.DocumentType.CONTRACT_PDF,
                name: 'Sözleşme Çıktısı',
                description: 'İş sözleşmesi veya anlaşma belgesi (PDF)',
            },
        ];
    }
};
exports.UserVerificationService = UserVerificationService;
exports.UserVerificationService = UserVerificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_verification_entity_1.UserVerification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserVerificationService);
//# sourceMappingURL=user-verification.service.js.map