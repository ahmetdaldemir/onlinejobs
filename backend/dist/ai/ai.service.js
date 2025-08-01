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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ai_model_entity_1 = require("./entities/ai-model.entity");
const ai_training_data_entity_1 = require("./entities/ai-training-data.entity");
const message_entity_1 = require("../messages/entities/message.entity");
const user_entity_1 = require("../users/entities/user.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
let AiService = class AiService {
    constructor(aiModelRepository, trainingDataRepository, messageRepository, userRepository, jobRepository) {
        this.aiModelRepository = aiModelRepository;
        this.trainingDataRepository = trainingDataRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
    }
    async createModel(name, description) {
        const model = this.aiModelRepository.create({
            name,
            description,
            status: ai_model_entity_1.AiModelStatus.INACTIVE,
            modelConfig: {
                learningRate: 0.01,
                maxEpochs: 100,
                batchSize: 32,
            },
        });
        return this.aiModelRepository.save(model);
    }
    async updateModelStatus(modelId, status) {
        const model = await this.aiModelRepository.findOne({ where: { id: modelId } });
        if (!model) {
            throw new common_1.NotFoundException('AI model bulunamadı');
        }
        model.status = status;
        return this.aiModelRepository.save(model);
    }
    async getActiveModel() {
        return this.aiModelRepository.findOne({ where: { status: ai_model_entity_1.AiModelStatus.ACTIVE } });
    }
    async getAllModels() {
        return this.aiModelRepository.find();
    }
    async getTrainingDataCount(modelId) {
        const total = await this.trainingDataRepository.count({
            where: { aiModelId: modelId }
        });
        const unused = await this.trainingDataRepository.count({
            where: { aiModelId: modelId, isUsedForTraining: false }
        });
        return { total, unused };
    }
    async addTrainingData(modelId, userId, inputMessage, responseMessage, context) {
        const trainingData = this.trainingDataRepository.create({
            aiModelId: modelId,
            userId,
            inputMessage,
            responseMessage,
            context,
        });
        return this.trainingDataRepository.save(trainingData);
    }
    async generateWelcomeMessage(userId, userType) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['userInfos']
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        const userInfo = user.userInfos?.[0];
        const location = userInfo ? `${userInfo.address || ''} ${userInfo.neighborhood || ''}`.trim() : '';
        if (userType === 'employer') {
            return `Merhaba ${user.firstName}! 👋 

Hoş geldiniz! İşçi arama sürecinizde size yardımcı olmaktan mutluluk duyarım.

${location ? `📍 Konum: ${location}` : ''}

Size nasıl yardımcı olabilirim?
• Hangi kategoride işçi arıyorsunuz?
• İş tanımınızı detaylandırmak ister misiniz?
• Bütçe aralığınız nedir?

Başlamak için yukarıdaki sorulardan birini sorabilirsiniz. 😊`;
        }
        else {
            return `Merhaba ${user.firstName}! 👋 

Hoş geldiniz! İş arama sürecinizde size yardımcı olmaktan mutluluk duyarım.

${location ? `📍 Konum: ${location}` : ''}

Size nasıl yardımcı olabilirim?
• Hangi alanda çalışmak istiyorsunuz?
• Deneyim seviyeniz nedir?
• Maaş beklentiniz nedir?

Başlamak için yukarıdaki sorulardan birini sorabilirsiniz. 😊`;
        }
    }
    async generateJobDetailsMessage(jobId, userId) {
        const job = await this.jobRepository.findOne({
            where: { id: jobId },
            relations: ['category', 'employer', 'employer.userInfos']
        });
        if (!job) {
            throw new common_1.NotFoundException('İş bulunamadı');
        }
        const employer = job.employer;
        const employerInfo = employer.userInfos?.[0];
        const location = employerInfo ? `${employerInfo.address || ''} ${employerInfo.neighborhood || ''}`.trim() : '';
        return `📋 İş Detayları

🏢 İşveren: ${employer.firstName} ${employer.lastName}
📍 Konum: ${location || 'Belirtilmemiş'}
📂 Kategori: ${job.category?.name || 'Genel'}
💰 Bütçe: ${job.budget ? `${job.budget} TL` : 'Belirtilmemiş'}
📅 Tarih: ${job.createdAt.toLocaleDateString('tr-TR')}

📝 Açıklama:
${job.description}

⏰ Zaman: ${job.scheduledTime || 'Belirtilmemiş'}
📞 İletişim: ${employer.phone || 'Belirtilmemiş'}

Bu iş hakkında daha fazla bilgi almak ister misiniz? 🤔`;
    }
    async generateUserTypeBasedTrainingData(modelId, userId, userType) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['userInfos']
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        const trainingData = [];
        const userInfo = user.userInfos?.[0];
        const location = userInfo ? `${userInfo.address || ''} ${userInfo.neighborhood || ''}`.trim() : '';
        if (userType === 'employer') {
            const employerTrainingData = [
                {
                    input: "İşçi arıyorum",
                    response: `Hangi kategoride işçi arıyorsunuz? Size uygun adayları bulabilirim. ${location ? `📍 Konum: ${location}` : ''}`,
                    rating: 5
                },
                {
                    input: "Güvenilir işçi bulamıyorum",
                    response: "Profilinizi detaylı doldurun ve referanslarınızı ekleyin. Bu şekilde daha güvenilir adaylar bulabilirsiniz. Ayrıca yorum sistemi ile adayların geçmiş performanslarını görebilirsiniz.",
                    rating: 5
                },
                {
                    input: "Maaş ne kadar olmalı?",
                    response: "Maaş, iş kategorisine ve deneyim seviyesine göre değişir. Piyasa ortalamasını öğrenmek için benzer iş ilanlarını inceleyebilirsiniz.",
                    rating: 4
                },
                {
                    input: "İş tanımı nasıl yazmalıyım?",
                    response: "İş tanımınızda şunları belirtin: • Gerekli beceriler • Çalışma saatleri • Maaş aralığı • İş yeri konumu • İletişim bilgileri",
                    rating: 5
                },
                {
                    input: "Hangi kategoriler var?",
                    response: "Temizlik, bakım, inşaat, bahçe, ev işleri, çocuk bakımı, yaşlı bakımı, kurye, garson, aşçı gibi kategoriler mevcuttur.",
                    rating: 4
                }
            ];
            employerTrainingData.forEach(data => {
                trainingData.push(this.trainingDataRepository.create({
                    aiModelId: modelId,
                    userId: userId,
                    inputMessage: data.input,
                    responseMessage: data.response,
                    rating: data.rating,
                    context: { userType: 'employer', location }
                }));
            });
        }
        else {
            const workerTrainingData = [
                {
                    input: "İş arıyorum",
                    response: `Hangi alanda çalışmak istiyorsunuz? Size uygun iş ilanlarını gösterebilirim. ${location ? `📍 Konum: ${location}` : ''}`,
                    rating: 5
                },
                {
                    input: "Deneyimim yok",
                    response: "Deneyimsiz işçiler için de iş ilanları var. Profilinizi güncelleyin ve başvurmaya başlayın. Bazı işverenler eğitim verebilir.",
                    rating: 4
                },
                {
                    input: "Maaş ne kadar?",
                    response: "Maaşlar iş türüne ve deneyime göre değişir. İlan detaylarında maaş bilgisi bulabilirsiniz. Müzakere edebilirsiniz.",
                    rating: 4
                },
                {
                    input: "Hangi işler var?",
                    response: "Temizlik, bakım, inşaat, bahçe, ev işleri, çocuk bakımı, yaşlı bakımı, kurye, garson, aşçı gibi birçok kategori var.",
                    rating: 4
                },
                {
                    input: "Güvenli mi?",
                    response: "Tüm kullanıcılar doğrulanmıştır ve yorum sistemi ile güvenilirlik kontrol edilir. İlk görüşmeyi güvenli bir yerde yapın.",
                    rating: 5
                }
            ];
            workerTrainingData.forEach(data => {
                trainingData.push(this.trainingDataRepository.create({
                    aiModelId: modelId,
                    userId: userId,
                    inputMessage: data.input,
                    responseMessage: data.response,
                    rating: data.rating,
                    context: { userType: 'worker', location }
                }));
            });
        }
        return this.trainingDataRepository.save(trainingData);
    }
    async generateUserAnalysis(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['userInfos']
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        const messages = await this.messageRepository.find({
            where: [
                { senderId: userId },
                { receiverId: userId }
            ],
            order: { createdAt: 'ASC' },
            relations: ['sender', 'receiver']
        });
        const userJobs = await this.jobRepository.find({
            where: { employerId: userId },
            relations: ['category']
        });
        const messageAnalysis = {
            totalMessages: messages.length,
            sentMessages: messages.filter(m => m.senderId === userId).length,
            receivedMessages: messages.filter(m => m.receiverId === userId).length,
            averageResponseTime: this.calculateAverageResponseTime(messages, userId),
            commonWords: this.extractCommonWords(messages, userId),
            communicationStyle: this.analyzeCommunicationStyle(messages, userId),
            activeHours: this.analyzeActiveHours(messages, userId)
        };
        const jobAnalysis = {
            totalJobs: userJobs.length,
            jobCategories: [...new Set(userJobs.map(job => job.category?.name).filter(Boolean))],
            averageSalary: userJobs.length > 0 ? userJobs.reduce((sum, job) => sum + (parseInt(job.budget) || 0), 0) / userJobs.length : 0,
            preferredLocations: this.extractPreferredLocations(userJobs)
        };
        const userProfile = {
            userType: userJobs.length > 0 ? 'employer' : 'worker',
            registrationDate: user.createdAt,
            lastActive: user.updatedAt,
            location: user.userInfos?.[0] ? `${user.userInfos[0].address || ''} ${user.userInfos[0].neighborhood || ''}`.trim() : 'Belirtilmemiş',
            categories: 'Belirtilmemiş'
        };
        const aiScore = this.calculateAIScore(messageAnalysis, jobAnalysis, userProfile);
        return {
            userId,
            userProfile,
            messageAnalysis,
            jobAnalysis,
            aiScore,
            recommendations: this.generateRecommendations(messageAnalysis, jobAnalysis, userProfile)
        };
    }
    calculateAverageResponseTime(messages, userId) {
        let totalResponseTime = 0;
        let responseCount = 0;
        for (let i = 0; i < messages.length - 1; i++) {
            const currentMessage = messages[i];
            const nextMessage = messages[i + 1];
            if (currentMessage.senderId !== userId && nextMessage.senderId === userId) {
                const responseTime = nextMessage.createdAt.getTime() - currentMessage.createdAt.getTime();
                totalResponseTime += responseTime;
                responseCount++;
            }
        }
        return responseCount > 0 ? totalResponseTime / responseCount / 1000 / 60 : 0;
    }
    extractCommonWords(messages, userId) {
        const userMessages = messages.filter(m => m.senderId === userId);
        const words = {};
        userMessages.forEach(msg => {
            const messageWords = msg.content.toLowerCase().split(' ');
            messageWords.forEach(word => {
                if (word.length > 2) {
                    words[word] = (words[word] || 0) + 1;
                }
            });
        });
        return Object.entries(words)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([word, count]) => ({ word, count }));
    }
    analyzeCommunicationStyle(messages, userId) {
        const userMessages = messages.filter(m => m.senderId === userId);
        let formalCount = 0;
        let casualCount = 0;
        let emojiCount = 0;
        const formalWords = ['teşekkür', 'rica', 'lütfen', 'memnun', 'güvenilir', 'kaliteli'];
        const casualWords = ['slm', 'selam', 'nasılsın', 'iyi', 'güzel'];
        userMessages.forEach(msg => {
            const content = msg.content.toLowerCase();
            if (formalWords.some(word => content.includes(word)))
                formalCount++;
            if (casualWords.some(word => content.includes(word)))
                casualCount++;
            if (content.includes('😊') || content.includes('👍') || content.includes('🙏'))
                emojiCount++;
        });
        if (formalCount > casualCount)
            return 'Formal';
        if (casualCount > formalCount)
            return 'Casual';
        return 'Neutral';
    }
    analyzeActiveHours(messages, userId) {
        const userMessages = messages.filter(m => m.senderId === userId);
        const hours = {};
        userMessages.forEach(msg => {
            const hour = msg.createdAt.getHours();
            hours[hour] = (hours[hour] || 0) + 1;
        });
        return hours;
    }
    extractPreferredLocations(jobs) {
        const locations = jobs.map(job => job.userInfo?.address || job.userInfo?.neighborhood).filter(Boolean);
        return [...new Set(locations)];
    }
    calculateAIScore(messageAnalysis, jobAnalysis, userProfile) {
        let score = 50;
        if (messageAnalysis.totalMessages > 20)
            score += 10;
        if (messageAnalysis.totalMessages > 50)
            score += 10;
        if (messageAnalysis.averageResponseTime < 5)
            score += 15;
        if (messageAnalysis.averageResponseTime < 2)
            score += 10;
        if (messageAnalysis.communicationStyle === 'Formal')
            score += 10;
        if (messageAnalysis.communicationStyle === 'Casual')
            score += 5;
        if (jobAnalysis.totalJobs > 0)
            score += 10;
        if (jobAnalysis.totalJobs > 5)
            score += 10;
        const daysSinceRegistration = (Date.now() - userProfile.registrationDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceRegistration > 30)
            score += 10;
        if (daysSinceRegistration > 90)
            score += 10;
        return Math.min(100, Math.max(0, score));
    }
    generateRecommendations(messageAnalysis, jobAnalysis, userProfile) {
        const recommendations = [];
        if (messageAnalysis.totalMessages < 10) {
            recommendations.push('Daha aktif mesajlaşma yaparak profil görünürlüğünüzü artırabilirsiniz.');
        }
        if (messageAnalysis.averageResponseTime > 10) {
            recommendations.push('Daha hızlı yanıt vererek kullanıcı memnuniyetini artırabilirsiniz.');
        }
        if (userProfile.userType === 'employer' && jobAnalysis.totalJobs < 3) {
            recommendations.push('Daha fazla iş ilanı oluşturarak aday havuzunuzu genişletebilirsiniz.');
        }
        if (userProfile.userType === 'worker' && jobAnalysis.totalJobs === 0) {
            recommendations.push('Profilinizi güncelleyerek daha fazla iş fırsatı yakalayabilirsiniz.');
        }
        return recommendations;
    }
    async generateTrainingDataFromUserMessages(modelId, userId) {
        const messages = await this.messageRepository.find({
            where: [
                { senderId: userId },
                { receiverId: userId }
            ],
            order: { createdAt: 'ASC' },
            relations: ['sender', 'receiver']
        });
        const trainingData = [];
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        const userJobs = await this.jobRepository.find({
            where: { employerId: userId },
            relations: ['category']
        });
        for (let i = 0; i < messages.length - 1; i++) {
            const currentMessage = messages[i];
            const nextMessage = messages[i + 1];
            if (currentMessage.senderId !== nextMessage.senderId) {
                const inputMessage = currentMessage.content;
                const responseMessage = nextMessage.content;
                if (this.isValidTrainingMessage(inputMessage) && this.isValidTrainingMessage(responseMessage)) {
                    const trainingDataItem = this.trainingDataRepository.create({
                        aiModelId: modelId,
                        userId: userId,
                        inputMessage: inputMessage,
                        responseMessage: responseMessage,
                        rating: this.calculateMessageRating(inputMessage, responseMessage),
                        context: {
                            userType: currentMessage.senderId === userId ? 'sender' : 'receiver',
                            jobContext: this.extractJobContext(userJobs, inputMessage),
                            timestamp: currentMessage.createdAt
                        }
                    });
                    trainingData.push(trainingDataItem);
                }
            }
        }
        const profileTrainingData = this.generateProfileBasedTrainingData(modelId, userId, user, userJobs);
        trainingData.push(...profileTrainingData);
        const jobSearchTrainingData = this.generateJobSearchTrainingData(modelId, userId, userJobs);
        trainingData.push(...jobSearchTrainingData);
        return this.trainingDataRepository.save(trainingData);
    }
    async trainModelForUser(modelId, userId) {
        const model = await this.aiModelRepository.findOne({ where: { id: modelId } });
        if (!model) {
            throw new common_1.NotFoundException('AI model bulunamadı');
        }
        await this.generateTrainingDataFromUserMessages(modelId, userId);
        return this.trainModel(modelId);
    }
    async autoTrainModelForAllUsers(modelId) {
        const users = await this.userRepository.find({
            relations: ['userInfos']
        });
        const model = await this.aiModelRepository.findOne({ where: { id: modelId } });
        if (!model) {
            throw new common_1.NotFoundException('AI model bulunamadı');
        }
        let totalTrainingData = 0;
        let processedUsers = 0;
        const results = [];
        console.log(`🚀 Otomatik eğitim başlatılıyor... ${users.length} kullanıcı için`);
        for (const user of users) {
            try {
                console.log(`📝 Kullanıcı ${user.id} (${user.userType}) için eğitim verisi oluşturuluyor...`);
                const trainingData = await this.generateUserTypeBasedTrainingData(modelId, user.id, user.userType);
                totalTrainingData += trainingData.length;
                processedUsers++;
                results.push({
                    userId: user.id,
                    userType: user.userType,
                    trainingDataCount: trainingData.length,
                    status: 'success'
                });
                console.log(`✅ Kullanıcı ${user.id} için ${trainingData.length} eğitim verisi oluşturuldu`);
            }
            catch (error) {
                console.log(`❌ Kullanıcı ${user.id} için eğitim verisi oluşturulamadı:`, error.message);
                results.push({
                    userId: user.id,
                    userType: user.userType,
                    trainingDataCount: 0,
                    status: 'error',
                    error: error.message
                });
            }
        }
        console.log(`🎯 Model eğitimi başlatılıyor...`);
        const trainedModel = await this.trainModel(modelId);
        console.log(`✅ Otomatik eğitim tamamlandı! ${processedUsers}/${users.length} kullanıcı işlendi, ${totalTrainingData} eğitim verisi oluşturuldu`);
        return {
            ...trainedModel,
            additionalInfo: {
                trainingDataCount: totalTrainingData,
                processedUsers,
                totalUsers: users.length,
                results
            }
        };
    }
    isValidTrainingMessage(message) {
        if (!message || message.length < 3)
            return false;
        if (message.length > 500)
            return false;
        if (message.includes('http') || message.includes('www'))
            return false;
        return true;
    }
    calculateMessageRating(input, response) {
        let rating = 3;
        if (response.length > 10 && response.length < 200)
            rating += 1;
        if (input.includes('?') && !response.includes('?'))
            rating += 1;
        if (response.includes('😊') || response.includes('👍') || response.includes('🙏'))
            rating += 0.5;
        const professionalWords = ['teşekkür', 'rica', 'lütfen', 'memnun', 'güvenilir', 'kaliteli'];
        if (professionalWords.some(word => response.toLowerCase().includes(word)))
            rating += 0.5;
        return Math.min(5, Math.max(1, rating));
    }
    extractJobContext(userJobs, message) {
        const jobContext = {
            hasJobs: userJobs.length > 0,
            jobCategories: [],
            jobTitles: []
        };
        if (userJobs.length > 0) {
            jobContext.jobCategories = [...new Set(userJobs.map(job => job.category?.name).filter(Boolean))];
            jobContext.jobTitles = userJobs.map(job => job.title).filter(Boolean);
        }
        return jobContext;
    }
    generateProfileBasedTrainingData(modelId, userId, user, userJobs) {
        const trainingData = [];
        if (userJobs.length > 0) {
            trainingData.push(this.trainingDataRepository.create({
                aiModelId: modelId,
                userId: userId,
                inputMessage: "İşçi arıyorum",
                responseMessage: "Hangi kategoride işçi arıyorsunuz? Size uygun adayları bulabilirim.",
                rating: 4,
                context: { userType: 'employer' }
            }), this.trainingDataRepository.create({
                aiModelId: modelId,
                userId: userId,
                inputMessage: "Güvenilir işçi bulamıyorum",
                responseMessage: "Profilinizi detaylı doldurun ve referanslarınızı ekleyin. Bu şekilde daha güvenilir adaylar bulabilirsiniz.",
                rating: 4,
                context: { userType: 'employer' }
            }));
        }
        else {
            trainingData.push(this.trainingDataRepository.create({
                aiModelId: modelId,
                userId: userId,
                inputMessage: "İş arıyorum",
                responseMessage: "Hangi alanda çalışmak istiyorsunuz? Size uygun iş ilanlarını gösterebilirim.",
                rating: 4,
                context: { userType: 'worker' }
            }), this.trainingDataRepository.create({
                aiModelId: modelId,
                userId: userId,
                inputMessage: "Deneyimim yok",
                responseMessage: "Deneyimsiz işçiler için de iş ilanları var. Profilinizi güncelleyin ve başvurmaya başlayın.",
                rating: 4,
                context: { userType: 'worker' }
            }));
        }
        return trainingData;
    }
    generateJobSearchTrainingData(modelId, userId, userJobs) {
        const trainingData = [];
        const generalQuestions = [
            { input: "Nasıl iş bulabilirim?", response: "Profilinizi güncelleyin, kategorilerinizi seçin ve aktif iş ilanlarını takip edin." },
            { input: "Hangi işler var?", response: "Temizlik, bakım, inşaat, bahçe, ev işleri gibi birçok kategori var. Hangi alanda çalışmak istiyorsunuz?" },
            { input: "Maaş ne kadar?", response: "Maaşlar iş türüne ve deneyime göre değişir. İlan detaylarında maaş bilgisi bulabilirsiniz." },
            { input: "Güvenli mi?", response: "Tüm kullanıcılar doğrulanmıştır ve yorum sistemi ile güvenilirlik kontrol edilir." }
        ];
        generalQuestions.forEach(q => {
            trainingData.push(this.trainingDataRepository.create({
                aiModelId: modelId,
                userId: userId,
                inputMessage: q.input,
                responseMessage: q.response,
                rating: 4,
                context: { type: 'general_job_search' }
            }));
        });
        return trainingData;
    }
    async trainModel(modelId) {
        const model = await this.aiModelRepository.findOne({ where: { id: modelId } });
        if (!model) {
            throw new common_1.NotFoundException('AI model bulunamadı');
        }
        model.status = ai_model_entity_1.AiModelStatus.TRAINING;
        await this.aiModelRepository.save(model);
        try {
            const trainingData = await this.trainingDataRepository.find({
                where: { aiModelId: modelId, isUsedForTraining: false },
            });
            if (trainingData.length === 0) {
                throw new Error('Bu model için eğitim verisi bulunamadı. Lütfen önce eğitim verisi ekleyin.');
            }
            const patterns = this.extractPatterns(trainingData);
            model.modelConfig = {
                ...model.modelConfig,
                patterns,
                lastTrainedAt: new Date(),
            };
            model.trainingDataCount = trainingData.length;
            model.accuracy = this.calculateAccuracy(trainingData, patterns);
            model.status = ai_model_entity_1.AiModelStatus.ACTIVE;
            model.lastTrainedAt = new Date();
            await this.trainingDataRepository.update({ aiModelId: modelId }, { isUsedForTraining: true });
            return this.aiModelRepository.save(model);
        }
        catch (error) {
            model.status = ai_model_entity_1.AiModelStatus.INACTIVE;
            await this.aiModelRepository.save(model);
            throw error;
        }
    }
    async generateResponse(userId, message) {
        console.log(`🤖 AI yanıtı oluşturuluyor...`);
        console.log(`👤 Kullanıcı ID: ${userId}`);
        console.log(`💬 Mesaj: ${message}`);
        const activeModel = await this.getActiveModel();
        console.log(`🔍 Aktif model:`, activeModel ? `ID: ${activeModel.id}, Status: ${activeModel.status}` : 'Bulunamadı');
        if (!activeModel || activeModel.status !== ai_model_entity_1.AiModelStatus.ACTIVE) {
            console.log(`❌ Aktif AI modeli bulunamadı veya aktif değil`);
            const testResponses = {
                'merhaba': 'Merhaba! Ben AI asistanınızım. Size nasıl yardımcı olabilirim?',
                'nasılsın': 'İyiyim, teşekkürler! Siz nasılsınız?',
                'iş': 'İş konusunda size yardımcı olabilirim. Hangi alanda çalışmak istiyorsunuz?',
                'maaş': 'Maaş konusunda bilgi verebilirim. Deneyim seviyenize göre değişir.',
                'deneyim': 'Deneyim konusunda endişelenmeyin. Her seviyede iş var.'
            };
            const lowerMessage = message.toLowerCase();
            for (const [key, response] of Object.entries(testResponses)) {
                if (lowerMessage.includes(key)) {
                    console.log(`✅ Test yanıtı bulundu: ${response}`);
                    return response;
                }
            }
            console.log(`✅ Varsayılan test yanıtı veriliyor`);
            return 'Teşekkürler! Mesajınızı aldım. Size en kısa sürede dönüş yapacağım.';
        }
        let patterns = activeModel.modelConfig?.patterns || [];
        console.log(`📋 Mevcut pattern sayısı: ${patterns.length}`);
        if (patterns.length === 0) {
            console.log(`🔄 Training data'dan patterns oluşturuluyor...`);
            const trainingData = await this.trainingDataRepository.find({
                where: { aiModelId: activeModel.id }
            });
            console.log(`📊 Training data sayısı: ${trainingData.length}`);
            if (trainingData.length > 0) {
                patterns = this.extractPatterns(trainingData);
                console.log(`✅ ${patterns.length} pattern oluşturuldu`);
                await this.aiModelRepository.update(activeModel.id, {
                    modelConfig: { ...activeModel.modelConfig, patterns }
                });
            }
            else {
                console.log(`❌ Training data bulunamadı`);
            }
        }
        const response = this.findBestResponse(message, patterns);
        console.log(`✅ AI yanıtı: ${response}`);
        return response;
    }
    extractPatterns(trainingData) {
        const patterns = [];
        trainingData.forEach(data => {
            const words = data.inputMessage.toLowerCase().split(' ');
            const response = data.responseMessage;
            patterns.push({
                keywords: words,
                response,
                rating: data.rating,
                count: 1,
            });
        });
        return patterns;
    }
    findBestResponse(message, patterns) {
        const messageWords = message.toLowerCase().split(' ');
        let bestMatch = null;
        let bestScore = 0;
        console.log(`🔍 "${message}" için en iyi yanıt aranıyor...`);
        console.log(`📝 Mesaj kelimeleri: ${messageWords.join(', ')}`);
        patterns.forEach((pattern, index) => {
            const score = this.calculateSimilarity(messageWords, pattern.keywords);
            console.log(`📊 Pattern ${index + 1}: "${pattern.keywords.join(' ')}" -> Score: ${score.toFixed(3)}`);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = pattern;
            }
        });
        console.log(`🏆 En iyi skor: ${bestScore.toFixed(3)}`);
        console.log(`🎯 En iyi eşleşme: ${bestMatch ? bestMatch.response.substring(0, 50) + '...' : 'Yok'}`);
        if (bestScore > 0.1 && bestMatch) {
            console.log(`✅ Eşik değeri geçildi (${bestScore.toFixed(3)} > 0.1), yanıt veriliyor`);
            return bestMatch.response;
        }
        console.log(`❌ Eşik değeri geçilemedi (${bestScore.toFixed(3)} <= 0.1), yanıt verilmiyor`);
        return null;
    }
    calculateSimilarity(messageWords, patternWords) {
        const commonWords = messageWords.filter(word => patternWords.includes(word));
        return commonWords.length / Math.max(messageWords.length, patternWords.length);
    }
    calculateAccuracy(trainingData, patterns) {
        let correctPredictions = 0;
        trainingData.forEach(data => {
            const predictedResponse = this.findBestResponse(data.inputMessage, patterns);
            if (predictedResponse === data.responseMessage) {
                correctPredictions++;
            }
        });
        return trainingData.length > 0 ? correctPredictions / trainingData.length : 0;
    }
    async analyzeUserMessages(userId) {
        const messages = await this.messageRepository.find({
            where: [
                { senderId: userId },
                { receiverId: userId },
            ],
            order: { createdAt: 'ASC' },
        });
        const analysis = {
            totalMessages: messages.length,
            averageMessageLength: 0,
            commonWords: {},
            responsePatterns: [],
        };
        if (messages.length > 0) {
            const totalLength = messages.reduce((sum, msg) => sum + msg.content.length, 0);
            analysis.averageMessageLength = totalLength / messages.length;
            messages.forEach(msg => {
                const words = msg.content.toLowerCase().split(' ');
                words.forEach(word => {
                    if (word.length > 2) {
                        analysis.commonWords[word] = (analysis.commonWords[word] || 0) + 1;
                    }
                });
            });
        }
        return analysis;
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ai_model_entity_1.AiModel)),
    __param(1, (0, typeorm_1.InjectRepository)(ai_training_data_entity_1.AiTrainingData)),
    __param(2, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AiService);
//# sourceMappingURL=ai.service.js.map