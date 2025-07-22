import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserType, UserStatus } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersSeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seed() {
    // Önce mevcut test kullanıcılarını kontrol et
    const existingUsers = await this.userRepository.count();
    if (existingUsers > 0) {
      console.log('Users already exist, skipping seed...');
      return;
    }

    console.log('Creating test users...');

    // Test kullanıcısı 1
    const user1 = this.userRepository.create({
      firstName: 'Test',
      lastName: 'User 1',
      email: 'testuser1@example.com',
      phone: '+905551234567',
      password: await bcrypt.hash('password123', 10),
      userType: UserType.JOB_SEEKER,
      status: UserStatus.ACTIVE,
      isVerified: true,
      isOnline: true,
    });

    // Test kullanıcısı 2
    const user2 = this.userRepository.create({
      firstName: 'Test',
      lastName: 'User 2',
      email: 'testuser2@example.com',
      phone: '+905559876543',
      password: await bcrypt.hash('password123', 10),
      userType: UserType.EMPLOYER,
      status: UserStatus.ACTIVE,
      isVerified: true,
      isOnline: true,
    });

    const savedUsers = await this.userRepository.save([user1, user2]);
    
    console.log('Test users created successfully!');
    console.log('User 1 ID:', savedUsers[0].id);
    console.log('User 2 ID:', savedUsers[1].id);
    
    return savedUsers;
  }
} 