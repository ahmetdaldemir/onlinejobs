import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserInfo } from '../users/entities/user-info.entity';

@Injectable()
export class UserInfoSeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
  ) {}

  async seed() {
    console.log('Starting UserInfo seed...');
    
    // Mevcut kullanıcıları al
    const users = await this.userRepository.find();
    console.log(`Found ${users.length} users to add UserInfo data`);
    
    if (users.length === 0) {
      console.log('No users found, skipping UserInfo seed...');
      return;
    }

    // Her kullanıcı için UserInfo datası oluştur
    const userInfoData = [];
    
    for (const user of users) {
      // Her kullanıcı için 1-2 adet adres oluştur
      const addresses = this.generateAddressesForUser(user);
      
      for (const address of addresses) {
        userInfoData.push({
          ...address,
          user: user,
        });
      }
    }

    // Mevcut UserInfo kayıtlarını kontrol et
    const existingUserInfos = await this.userInfoRepository.count();
    if (existingUserInfos > 0) {
      console.log('UserInfo data already exists, skipping seed...');
      return;
    }

    // UserInfo verilerini kaydet
    await this.userInfoRepository.save(userInfoData);
    console.log(`Successfully added UserInfo data for ${users.length} users`);
  }

  private generateAddressesForUser(user: User) {
    const addresses = [];
    
    // İstanbul koordinatları (yaklaşık merkez)
    const istanbulCenter = {
      latitude: 41.0082,
      longitude: 28.9784,
    };

    // Kullanıcı tipine göre farklı adresler oluştur
    if (user.userType === 'worker') {
      // Worker'lar için ev adresi
      addresses.push({
        name: 'Ev Adresi',
        latitude: istanbulCenter.latitude + (Math.random() - 0.5) * 0.1, // ±0.05 derece
        longitude: istanbulCenter.longitude + (Math.random() - 0.5) * 0.1,
        address: this.getRandomIstanbulAddress(),
        neighborhood: this.getRandomNeighborhood(),
        buildingNo: Math.floor(Math.random() * 100) + 1 + '',
        floor: Math.floor(Math.random() * 10) + 1 + '',
        apartmentNo: Math.floor(Math.random() * 20) + 1 + '',
        description: 'Ana ikamet adresi',
      });

      // Worker'lar için iş yeri adresi (opsiyonel)
      if (Math.random() > 0.5) {
        addresses.push({
          name: 'İş Yeri',
          latitude: istanbulCenter.latitude + (Math.random() - 0.5) * 0.1,
          longitude: istanbulCenter.longitude + (Math.random() - 0.5) * 0.1,
          address: this.getRandomIstanbulAddress(),
          neighborhood: this.getRandomNeighborhood(),
          buildingNo: Math.floor(Math.random() * 50) + 1 + '',
          floor: Math.floor(Math.random() * 5) + 1 + '',
          apartmentNo: Math.floor(Math.random() * 10) + 1 + '',
          description: 'Çalışma adresi',
        });
      }
    } else {
      // Employer'lar için ofis adresi
      addresses.push({
        name: 'Ofis Adresi',
        latitude: istanbulCenter.latitude + (Math.random() - 0.5) * 0.1,
        longitude: istanbulCenter.longitude + (Math.random() - 0.5) * 0.1,
        address: this.getRandomIstanbulAddress(),
        neighborhood: this.getRandomNeighborhood(),
        buildingNo: Math.floor(Math.random() * 30) + 1 + '',
        floor: Math.floor(Math.random() * 15) + 1 + '',
        apartmentNo: Math.floor(Math.random() * 5) + 1 + '',
        description: 'Şirket ofisi',
      });
    }

    return addresses;
  }

  private getRandomIstanbulAddress(): string {
    const districts = [
      'Kadıköy', 'Beşiktaş', 'Şişli', 'Beyoğlu', 'Fatih', 'Üsküdar', 
      'Bakırköy', 'Maltepe', 'Ataşehir', 'Kartal', 'Pendik', 'Tuzla',
      'Sarıyer', 'Beykoz', 'Ümraniye', 'Sultanbeyli', 'Sancaktepe'
    ];
    
    const streets = [
      'Atatürk Caddesi', 'İstiklal Caddesi', 'Bağdat Caddesi', 'Moda Caddesi',
      'Fenerbahçe Caddesi', 'Göztepe Caddesi', 'Erenköy Caddesi', 'Sahrayıcedit Caddesi',
      'Barbaros Bulvarı', 'Levent Caddesi', 'Etiler Caddesi', 'Nişantaşı Caddesi'
    ];

    const district = districts[Math.floor(Math.random() * districts.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const number = Math.floor(Math.random() * 200) + 1;

    return `${street} No:${number}, ${district}/İstanbul`;
  }

  private getRandomNeighborhood(): string {
    const neighborhoods = [
      'Moda', 'Fenerbahçe', 'Göztepe', 'Erenköy', 'Sahrayıcedit', 'Suadiye',
      'Levent', 'Etiler', 'Nişantaşı', 'Teşvikiye', 'Maçka', 'Beşiktaş',
      'Ortaköy', 'Bebek', 'Arnavutköy', 'Sarıyer', 'Tarabya', 'Yeniköy'
    ];

    return neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
  }
} 