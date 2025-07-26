import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../auth/entities/admin.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminSeedService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async seed(): Promise<void> {
    console.log('Admin seed başlatılıyor...');
    
    const existingAdmin = await this.adminRepository.findOne({
      where: { username: 'admin' },
    });

    if (existingAdmin) {
      console.log('Admin zaten mevcut, seed atlanıyor...');
      return;
    }

    // Default admin oluştur
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = this.adminRepository.create({
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@onlinejobs.com',
      isActive: true,
      isSuperAdmin: true,
    });

    await this.adminRepository.save(admin);
    console.log('✅ Admin başarıyla oluşturuldu');
    console.log('📧 Kullanıcı adı: admin');
    console.log('🔑 Şifre: admin123');
  }
} 