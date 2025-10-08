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
exports.FixCategoryIdsSeed = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
let FixCategoryIdsSeed = class FixCategoryIdsSeed {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async fixAllUserCategoryIds() {
        console.log('🔧 CategoryIds senkronizasyonu başlatılıyor...');
        const users = await this.userRepository.find({
            relations: ['categories'],
        });
        let fixedCount = 0;
        let alreadyOkCount = 0;
        for (const user of users) {
            if (user.categories && user.categories.length > 0) {
                const categoryIdsFromRelation = user.categories.map(cat => cat.id);
                const needsUpdate = !user.categoryIds ||
                    user.categoryIds.length === 0 ||
                    JSON.stringify(user.categoryIds.sort()) !== JSON.stringify(categoryIdsFromRelation.sort());
                if (needsUpdate) {
                    user.categoryIds = categoryIdsFromRelation;
                    await this.userRepository.save(user);
                    console.log(`✅ ${user.id} (${user.firstName} ${user.lastName}) - CategoryIds güncellendi:`, categoryIdsFromRelation);
                    fixedCount++;
                }
                else {
                    alreadyOkCount++;
                }
            }
            else if (user.categoryIds && user.categoryIds.length > 0) {
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
    async fixSpecificUser(userId) {
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
        }
        else {
            user.categoryIds = [];
            await this.userRepository.save(user);
            console.log(`⚠️ Kullanıcının kategorisi yok, boş array set edildi`);
        }
        return user;
    }
};
exports.FixCategoryIdsSeed = FixCategoryIdsSeed;
exports.FixCategoryIdsSeed = FixCategoryIdsSeed = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FixCategoryIdsSeed);
//# sourceMappingURL=fix-category-ids.seed.js.map