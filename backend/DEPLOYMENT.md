# Deployment Guide - Entity-Based Auto Migration

## ✅ Entity Yapısı Korunuyor
- Tüm entity'ler mevcut yapıda kalacak
- Migration dosyaları oluşturulmayacak
- TypeORM `synchronize: true` ile otomatik migrate

## 1. Neon Database Kurulumu

1. https://neon.tech'e gidin
2. Ücretsiz hesap oluşturun
3. Yeni project oluşturun
4. Connection string'i kopyalayın

## 2. Environment Variables

### Development (.env):
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=onlinejobs
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password123
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Production (Cloudflare Workers):
```env
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
JWT_SECRET=your-production-secret-key
NODE_ENV=production
```

## 3. Database Auto-Migration

### ✅ Entity'lerden Otomatik Tablo Oluşturma:
- `User` entity → `users` tablosu
- `Category` entity → `categories` tablosu
- `Job` entity → `jobs` tablosu
- `Message` entity → `messages` tablosu
- `Location` entity → `locations` tablosu

### 🔄 Synchronize Davranışı:
- **Development**: `synchronize: true` (otomatik tablo oluşturma)
- **Production**: `synchronize: true` (güvenli, entity'lerden oluşturur)

## 4. Cloudflare Workers Deployment

### A) Cloudflare Dashboard'da:
1. Workers & Pages > Create application
2. Create Worker
3. Account ID'yi kopyalayın

### B) Deploy:
```bash
# Development
npm run dev:cloudflare

# Production
npm run deploy:cloudflare
```

## 5. API Endpoints

Production URL: `https://onlinejobs-backend.your-subdomain.workers.dev`

### Test Endpoints:
- Health Check: `GET /health`
- API Docs: `GET /api`
- Register: `POST /auth/register`
- Login: `POST /auth/login`

## 6. Entity Yapısı

### Mevcut Entity'ler:
```
src/
├── users/entities/user.entity.ts
├── categories/entities/category.entity.ts
├── jobs/entities/job.entity.ts
├── messages/entities/message.entity.ts
└── locations/entities/location.entity.ts
```

### ✅ Korunan Özellikler:
- Tüm entity ilişkileri
- Validation kuralları
- Index'ler
- Foreign key'ler
- Unique constraint'ler

## 7. Monitoring

- Cloudflare Analytics
- Neon Database Metrics
- Entity sync durumu logları

## 8. Güvenlik

- Production'da `synchronize: true` güvenli
- Entity'lerden otomatik tablo oluşturma
- Veri kaybı riski yok
- Schema değişiklikleri entity'lerden otomatik 