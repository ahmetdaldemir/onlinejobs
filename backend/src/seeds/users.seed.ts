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
    console.log('Starting user seed...');
    
    // Önce mevcut test kullanıcılarını kontrol et
    const existingUsers = await this.userRepository.count();
    console.log(`Existing users count: ${existingUsers}`);
    
    if (existingUsers > 0) {
      console.log('Users already exist, skipping seed...');
      return;
    }

    console.log('Creating test users...');

    const demoUsers = [
      {
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet.yilmaz@example.com',
        phone: '+905550000001',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.JOB_SEEKER],
        
        status: UserStatus.ACTIVE,
        isVerified: true,
        isOnline: true,
      },
      {
        firstName: 'Ayşe',
        lastName: 'Demir',
        email: 'ayse.demir@example.com',
        phone: '+905550000002',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.EMPLOYER],
        
        status: UserStatus.INACTIVE,
        isVerified: false,
        isOnline: false,
      },
      {
        firstName: 'Mehmet',
        lastName: 'Kaya',
        email: 'mehmet.kaya@example.com',
        phone: '+905550000003',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.JOB_SEEKER],
        
        status: UserStatus.ACTIVE,
        isVerified: true,
        isOnline: true,
      },
      {
        firstName: 'Zeynep',
        lastName: 'Aydın',
        email: 'zeynep.aydin@example.com',
        phone: '+905550000004',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.EMPLOYER],
        
        status: UserStatus.ACTIVE,
        isVerified: true,
        isOnline: false,
      },
      {
        firstName: 'Emre',
        lastName: 'Şahin',
        email: 'emre.sahin@example.com',
        phone: '+905550000005',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.JOB_SEEKER],
        
        status: UserStatus.INACTIVE,
        isVerified: false,
        isOnline: false,
      },
      {
        firstName: 'Fatma',
        lastName: 'Koç',
        email: 'fatma.koc@example.com',
        phone: '+905550000006',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.EMPLOYER],
        
        status: UserStatus.ACTIVE,
        isVerified: true,
        isOnline: true,
      },
      {
        firstName: 'Burak',
        lastName: 'Çelik',
        email: 'burak.celik@example.com',
        phone: '+905550000007',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.JOB_SEEKER],
        
        status: UserStatus.ACTIVE,
        isVerified: true,
        isOnline: false,
      },
      {
        firstName: 'Elif',
        lastName: 'Arslan',
        email: 'elif.arslan@example.com',
        phone: '+905550000008',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.EMPLOYER],
        
        status: UserStatus.ACTIVE,
        isVerified: true,
        isOnline: false,
      },
      {
        firstName: 'Can',
        lastName: 'Yıldız',
        email: 'can.yildiz@example.com',
        phone: '+905550000009',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.JOB_SEEKER],
        
        status: UserStatus.ACTIVE,
        isVerified: true,
        isOnline: true,
      },
      {
        firstName: 'Merve',
        lastName: 'Çetin',
        email: 'merve.cetin@example.com',
        phone: '+905550000010',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.EMPLOYER],
        
        status: UserStatus.INACTIVE,
        isVerified: false,
        isOnline: false,
      },
      {
        firstName: 'Ali',
        lastName: 'Durmaz',
        email: 'ali.durmaz@example.com',
        phone: '+905550000011',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.JOB_SEEKER],
        
        status: UserStatus.ACTIVE,
        isVerified: true,
        isOnline: true,
      },
      {
        firstName: 'Nazlı',
        lastName: 'Erdoğan',
        email: 'nazli.erdogan@example.com',
        phone: '+905550000012',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.EMPLOYER],
        
        status: UserStatus.ACTIVE,
        isVerified: true,
        isOnline: false,
      },
      {
        firstName: 'Selim',
        lastName: 'Turan',
        email: 'selim.turan@example.com',
        phone: '+905550000013',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.JOB_SEEKER],
        
        status: UserStatus.INACTIVE,
        isVerified: false,
        isOnline: false,
      },
      {
        firstName: 'Ece',
        lastName: 'Yavuz',
        email: 'ece.yavuz@example.com',
        phone: '+905550000014',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.EMPLOYER],
        
        status: UserStatus.ACTIVE,
        isVerified: true,
        isOnline: true,
      },
      {
        firstName: 'Kerem',
        lastName: 'Bozkurt',
        email: 'kerem.bozkurt@example.com',
        phone: '+905550000015',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.JOB_SEEKER],
        
        status: UserStatus.ACTIVE,
        isVerified: true,
        isOnline: false,
      },
      {
        firstName: 'Aslı',
        lastName: 'Kurt',
        email: 'asli.kurt@example.com',
        phone: '+905550000016',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.EMPLOYER],
        
        status: UserStatus.INACTIVE,
        isVerified: false,
        isOnline: false,
      },
      {
        firstName: 'Yusuf',
        lastName: 'Acar',
        email: 'yusuf.acar@example.com',
        phone: '+905550000017',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.JOB_SEEKER],
        
        status: UserStatus.ACTIVE,
        isVerified: true,
        isOnline: true,
      },
      {
        firstName: 'Gül',
        lastName: 'Özkan',
        email: 'gul.ozkan@example.com',
        phone: '+905550000018',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.EMPLOYER],
        
        status: UserStatus.ACTIVE,
        isVerified: true,
        isOnline: false,
      },
      {
        firstName: 'Berk',
        lastName: 'Kara',
        email: 'berk.kara@example.com',
        phone: '+905550000019',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.JOB_SEEKER],
        status: UserStatus.INACTIVE,
        isVerified: false,
        isOnline: false,
      },
      {
        firstName: 'Melis',
        lastName: 'Tan',
        email: 'melis.tan@example.com',
        phone: '+905550000020',
        password: await bcrypt.hash('password123', 10),
        userTypes: [UserType.EMPLOYER],
        
        status: UserStatus.ACTIVE,
        isVerified: true,
        isOnline: true,
      },
      // 10 kullanıcı daha istersen onları da ekleyebilirim.
    ];

    for (const userData of demoUsers) {
      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);
      console.log(`Created user: ${userData.firstName} ${userData.lastName} (${userData.phone})`);
    }
 
    console.log(`Successfully created ${demoUsers.length} test users`);
    return true;
  }
} 