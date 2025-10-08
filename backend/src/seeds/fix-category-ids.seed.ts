import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FixCategoryIdsSeed {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async fixAllUserCategoryIds(): Promise<void> {
    console.log('🔧 CategoryIds senkronizasyonu başlatılıyor...');

    // Tüm kullanıcıları categories relation'ı ile getir
    const users = await this.userRepository.find({
      relations: ['categories'],
    });

    let fixedCount = 0;
    let alreadyOkCount = 0;

    for (const user of users) {
      // categories relation'ı var ama categoryIds array'i boş/null ise
      if (user.categories && user.categories.length > 0) {
        const categoryIdsFromRelation = user.categories.map(cat => cat.id);
        
        // categoryIds array'i eksik veya senkronize değilse
        const needsUpdate = 
          !user.categoryIds || 
          user.categoryIds.length === 0 ||
          JSON.stringify(user.categoryIds.sort()) !== JSON.stringify(categoryIdsFromRelation.sort());

        if (needsUpdate) {
          user.categoryIds = categoryIdsFromRelation;
          await this.userRepository.save(user);
          
          console.log(`✅ ${user.id} (${user.firstName} ${user.lastName}) - CategoryIds güncellendi:`, categoryIdsFromRelation);
          fixedCount++;
        } else {
          alreadyOkCount++;
        }
      } else if (user.categoryIds && user.categoryIds.length > 0) {
        // categoryIds var ama relation yok - temizle
        user.categoryIds = [];
        await this.userRepository.save(user);
        console.log(`🧹 ${user.id} - Boş categoryIds temizlendi`);
        fixedCount++;
      }
    }

    console.log('✅ CategoryIds senkronizasyonu tamamlandı!');
    console.log(`   📊 Toplam kullanıcı: ${users.length}`);
    console.log(`   ✅ Düzeltilen: ${fixedCount}`);
    console.log(`   ✔️ Zaten doğru: ${alreadyOkCount}`);
  }

  async fixSpecificUser(userId: string): Promise<User> {
    console.log('🔧 Kullanıcı categoryIds senkronizasyonu:', userId);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['categories'],
    });

    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    if (user.categories && user.categories.length > 0) {
      user.categoryIds = user.categories.map(cat => cat.id);
      await this.userRepository.save(user);
      
      console.log(`✅ ${user.firstName} ${user.lastName} - CategoryIds güncellendi:`, user.categoryIds);
    } else {
      user.categoryIds = [];
      await this.userRepository.save(user);
      console.log(`⚠️ Kullanıcının kategorisi yok, boş array set edildi`);
    }

    return user;
  }
}

