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
var CronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const jobs_service_1 = require("../jobs/jobs.service");
const admin_service_1 = require("../admin/admin.service");
let CronService = CronService_1 = class CronService {
    constructor(jobsService, adminService) {
        this.jobsService = jobsService;
        this.adminService = adminService;
        this.logger = new common_1.Logger(CronService_1.name);
    }
    async updateFeaturedScores() {
        this.logger.log('🔄 Öne çıkan iş skorları güncelleniyor...');
        try {
            await this.jobsService.updateAllFeaturedScores();
            this.logger.log('✅ Öne çıkan iş skorları başarıyla güncellendi');
        }
        catch (error) {
            this.logger.error('❌ Öne çıkan iş skorları güncellenirken hata:', error);
        }
    }
    async checkHighScoreJobs() {
        this.logger.log('🔍 Yüksek skorlu işler kontrol ediliyor...');
        try {
            const highScoreJobs = await this.jobsService.getHighScoreJobs(5);
            this.logger.log(`📊 En yüksek skorlu 5 iş: ${highScoreJobs.map(job => `${job.title} (${job.featuredScore} puan)`).join(', ')}`);
        }
        catch (error) {
            this.logger.error('❌ Yüksek skorlu işler kontrol edilirken hata:', error);
        }
    }
    async closeExpiredJobs() {
        this.logger.log('🔄 Süresi dolmuş işler kontrol ediliyor...');
        try {
            const result = await this.adminService.closeExpiredJobs();
            this.logger.log(`✅ ${result.message}`);
        }
        catch (error) {
            this.logger.error('❌ Süresi dolmuş işler kapatılırken hata:', error);
        }
    }
};
exports.CronService = CronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "updateFeaturedScores", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "checkHighScoreJobs", null);
__decorate([
    (0, schedule_1.Cron)('0 6 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "closeExpiredJobs", null);
exports.CronService = CronService = CronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jobs_service_1.JobsService,
        admin_service_1.AdminService])
], CronService);
//# sourceMappingURL=cron.service.js.map