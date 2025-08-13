import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserVerification, VerificationStatus, DocumentType } from './entities/user-verification.entity';
import { User } from './entities/user.entity';
import { UploadVerificationDocumentDto, UpdateVerificationStatusDto } from './dto/upload-verification-document.dto';

@Injectable()
export class UserVerificationService {
  constructor(
    @InjectRepository(UserVerification)
    private verificationRepository: Repository<UserVerification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Kullanıcının doğrulama belgelerini getir
  async getUserVerifications(userId: string): Promise<UserVerification[]> {
    return this.verificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Belge yükle
  async uploadDocument(
    userId: string,
    documentType: DocumentType,
    file: any,
    description?: string,
  ): Promise<UserVerification> {
    // Kullanıcının worker olduğunu kontrol et
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    if (user.userType !== 'worker') {
      throw new BadRequestException('Sadece worker kullanıcıları belge yükleyebilir');
    }

    // Aynı belge türü için zaten yükleme var mı kontrol et
    const existingVerification = await this.verificationRepository.findOne({
      where: { userId, documentType },
    });

    if (existingVerification) {
      throw new ConflictException('Bu belge türü için zaten bir belge yüklenmiş');
    }

    // Dosya türü kontrolü
    if (!this.isValidFileType(file.mimetype)) {
      throw new BadRequestException('Geçersiz dosya türü. Sadece PDF, JPG, PNG dosyaları kabul edilir');
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Dosya boyutu 5MB\'dan büyük olamaz');
    }

    // Belge URL'ini oluştur
    const documentUrl = `/uploads/verifications/${file.filename}`;

    // Verification kaydı oluştur
    const verification = this.verificationRepository.create({
      userId,
      documentType,
      documentUrl,
      originalFileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      status: VerificationStatus.PENDING,
    });

    return this.verificationRepository.save(verification);
  }

  // Belge durumunu güncelle (Admin)
  async updateVerificationStatus(
    verificationId: string,
    adminId: string,
    updateDto: UpdateVerificationStatusDto,
  ): Promise<UserVerification> {
    const verification = await this.verificationRepository.findOne({
      where: { id: verificationId },
      relations: ['user'],
    });

    if (!verification) {
      throw new NotFoundException('Doğrulama belgesi bulunamadı');
    }

    // Durumu güncelle
    verification.status = updateDto.status as VerificationStatus;
    verification.adminNotes = updateDto.adminNotes;
    verification.rejectionReason = updateDto.rejectionReason;
    verification.reviewedAt = new Date();
    verification.reviewedBy = adminId;

    const updatedVerification = await this.verificationRepository.save(verification);

    // Eğer tüm belgeler onaylandıysa kullanıcıyı doğrula
    if (updateDto.status === 'approved') {
      await this.checkAndUpdateUserVerification(verification.userId);
    }

    return updatedVerification;
  }

  // Kullanıcının tüm belgelerinin durumunu kontrol et
  async checkAndUpdateUserVerification(userId: string): Promise<void> {
    const verifications = await this.verificationRepository.find({
      where: { userId },
    });

    // Tüm gerekli belge türleri var mı kontrol et
    const requiredDocumentTypes = [
      DocumentType.MASTERY_CERTIFICATE,
      DocumentType.TAX_CERTIFICATE,
      DocumentType.CONTRACT_PDF,
    ];

    const hasAllRequiredDocuments = requiredDocumentTypes.every(requiredType =>
      verifications.some(v => v.documentType === requiredType)
    );

    if (!hasAllRequiredDocuments) {
      return; // Tüm belgeler yüklenmemiş
    }

    // Tüm belgeler onaylanmış mı kontrol et
    const allApproved = verifications.every(v => v.status === VerificationStatus.APPROVED);

    if (allApproved) {
      // Kullanıcıyı doğrula
      await this.userRepository.update(userId, { isVerified: true });
    }
  }

  // Belgeyi sil
  async deleteDocument(verificationId: string, userId: string): Promise<void> {
    const verification = await this.verificationRepository.findOne({
      where: { id: verificationId, userId },
    });

    if (!verification) {
      throw new NotFoundException('Doğrulama belgesi bulunamadı');
    }

    if (verification.status !== VerificationStatus.PENDING) {
      throw new BadRequestException('Sadece bekleyen belgeler silinebilir');
    }

    await this.verificationRepository.remove(verification);
  }

  // Admin: Tüm bekleyen doğrulamaları getir
  async getPendingVerifications(): Promise<UserVerification[]> {
    return this.verificationRepository.find({
      where: { status: VerificationStatus.PENDING },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  // Admin: Kullanıcının tüm doğrulamalarını getir
  async getVerificationsByUserId(userId: string): Promise<UserVerification[]> {
    return this.verificationRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  // Belge türü kontrolü
  private isValidFileType(mimetype: string): boolean {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];
    return allowedTypes.includes(mimetype);
  }

  // Kullanıcının doğrulama durumunu getir
  async getUserVerificationStatus(userId: string): Promise<{
    isVerified: boolean;
    totalDocuments: number;
    approvedDocuments: number;
    pendingDocuments: number;
    rejectedDocuments: number;
    documents: UserVerification[];
  }> {
    const verifications = await this.verificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const user = await this.userRepository.findOne({ where: { id: userId } });

    return {
      isVerified: user?.isVerified || false,
      totalDocuments: verifications.length,
      approvedDocuments: verifications.filter(v => v.status === VerificationStatus.APPROVED).length,
      pendingDocuments: verifications.filter(v => v.status === VerificationStatus.PENDING).length,
      rejectedDocuments: verifications.filter(v => v.status === VerificationStatus.REJECTED).length,
      documents: verifications,
    };
  }

  // Gerekli belge türlerini getir
  getRequiredDocumentTypes(): { type: DocumentType; name: string; description: string }[] {
    return [
      {
        type: DocumentType.MASTERY_CERTIFICATE,
        name: 'Ustalık Belgesi',
        description: 'Mesleki yeterlilik belgesi veya ustalık belgesi',
      },
      {
        type: DocumentType.TAX_CERTIFICATE,
        name: 'Vergi Levhası',
        description: 'Vergi dairesinden alınan vergi levhası',
      },
      {
        type: DocumentType.CONTRACT_PDF,
        name: 'Sözleşme Çıktısı',
        description: 'İş sözleşmesi veya anlaşma belgesi (PDF)',
      },
    ];
  }
}
