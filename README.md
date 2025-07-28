# Online Jobs - Backend API

Bu proje, iş verenler ile iş arayanları buluşturan online usta/personel platformunun backend API'sidir. İş arayanlar (elektrikçi, sıhhi tesisatçı, taksici vb.) online durumda olduklarında iş verenler tarafından görülebilir ve mesajlaşabilirler.

## 🚀 Teknolojiler

- **Node.js** + **NestJS** - API framework
- **PostgreSQL** - Veritabanı
- **TypeORM** - ORM
- **JWT** - Authentication
- **Redis** - Cache/Session
- **Swagger** - API dokümantasyonu
- **Docker** - Containerization

## ⚠️ PowerShell Kullanıcıları İçin Önemli Not

Windows PowerShell kullanıyorsanız, komutları zincirlemek için `&&` yerine şu yöntemleri kullanın:

```powershell
# Yöntem 1: & operatörü (ardışık çalıştırma)
cd backend & npm run start:dev

# Yöntem 2: ; operatörü (sıralı çalıştırma)
cd backend ; npm run start:dev

# Yöntem 3: Ayrı komutlar
cd backend
npm run start:dev
```

**Alternatif:** Git Bash, WSL veya Command Prompt kullanabilirsiniz.

## 📋 Özellikler

### Kullanıcı Yönetimi
- İş veren ve iş arayan kayıt sistemi
- JWT tabanlı authentication
- Profil yönetimi ve güncelleme
- Online/offline durum takibi

### İş İlanları
- İş ilanı oluşturma ve yönetimi
- Kategori bazlı filtreleme
- Konum bazlı arama
- Başvuru sistemi

### Mesajlaşma
- Real-time mesajlaşma
- Okundu/okunmadı durumu
- Konuşma geçmişi

### Konum Servisleri
- Şehir ve ilçe listesi
- Mesafe hesaplama
- Konum bazlı arama

## 🏗️ Proje Yapısı

```
onlinejobs/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication
│   │   ├── users/          # Kullanıcı yönetimi
│   │   ├── jobs/           # İş ilanları
│   │   ├── messages/       # Mesajlaşma
│   │   ├── categories/     # Kategoriler
│   │   ├── locations/      # Konum servisleri
│   │   ├── seeds/          # Seed data
│   │   └── database/       # Veritabanı konfigürasyonu
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Docker konfigürasyonu
└── README.md
```

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL
- Redis

### 1. Projeyi klonlayın
```bash
git clone <repository-url>
cd onlinejobs
```

### 2. Backend bağımlılıklarını yükleyin
```bash
cd backend
npm install
```

### 3. Ortam değişkenlerini ayarlayın
```bash
cp backend/env.example backend/.env
```

### 4. Docker ile servisleri başlatın
```bash
docker-compose up -d
```

### 5. Backend'i başlatın
```bash
cd backend
npm run start:dev
```

## 📚 API Dokümantasyonu

Uygulama çalıştıktan sonra Swagger dokümantasyonuna erişebilirsiniz:
- **Swagger UI**: http://localhost:3000/api

## 🔧 Ortam Değişkenleri

Backend için `.env` dosyası oluşturun:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=onlinejobs
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password123

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key

# App
PORT=3000
NODE_ENV=development
```

## 📱 API Endpoints

### Authentication
- `POST /auth/register` - Kullanıcı kaydı
- `POST /auth/login` - Kullanıcı girişi
- `GET /auth/profile` - Kullanıcı profili

### Users
- `GET /users` - Tüm kullanıcılar
- `GET /users/online-job-seekers` - Online iş arayanlar
- `GET /users/:id` - Kullanıcı detayı
- `PUT /users/status` - Durum güncelleme
- `PUT /users/location` - Konum güncelleme
- `PUT /users/profile` - Profil güncelleme

### Jobs
- `GET /jobs` - İş ilanları
- `POST /jobs` - İş ilanı oluşturma
- `GET /jobs/:id` - İş ilanı detayı
- `PUT /jobs/:id` - İş ilanı güncelleme
- `DELETE /jobs/:id` - İş ilanı silme
- `POST /jobs/:id/apply` - İş başvurusu
- `GET /jobs/my/applications` - Başvurularım
- `GET /jobs/:id/applications` - İş başvuruları

### Messages
- `POST /messages` - Mesaj gönderme
- `GET /messages/conversations` - Konuşmalarım
- `GET /messages/conversation/:userId` - Konuşma
- `PUT /messages/:id/read` - Mesaj okundu
- `GET /messages/unread/count` - Okunmamış sayısı

### Categories
- `GET /categories` - Kategoriler
- `GET /categories/:id` - Kategori detayı
- `POST /categories` - Kategori oluşturma
- `PUT /categories/:id` - Kategori güncelleme
- `DELETE /categories/:id` - Kategori silme

### Locations
- `GET /locations/cities` - Şehirler
- `GET /locations/districts` - İlçeler
- `GET /locations/distance` - Mesafe hesaplama

## 🗄️ Veritabanı Şeması

### Users
- Kullanıcı bilgileri (ad, soyad, email, telefon)
- Kullanıcı tipi (iş veren/iş arayan)
- Durum (aktif, online, offline)
- Konum bilgileri (latitude, longitude)
- Kategori ilişkisi

### Categories
- Meslek kategorileri (elektrikçi, tesisatçı, vb.)
- Açıklama ve ikon bilgileri

### Jobs
- İş ilanı bilgileri
- İş veren ilişkisi
- Kategori ilişkisi
- Konum bilgileri
- Durum (açık, devam ediyor, tamamlandı)

### JobApplications
- İş başvuruları
- Başvuran ve iş ilanı ilişkileri
- Başvuru durumu

### Messages
- Mesajlaşma sistemi
- Gönderen ve alıcı ilişkileri
- Okundu/okunmadı durumu

## 🔒 Güvenlik

- JWT tabanlı authentication
- Şifre hash'leme (bcrypt)
- CORS konfigürasyonu
- Input validation
- SQL injection koruması

## 🐳 Docker

### Servisleri başlatma
```bash
docker-compose up -d
```

### Servisleri durdurma
```bash
docker-compose down
```

### Logları görüntüleme
```bash
docker-compose logs -f
```

## 📝 Geliştirme

### Backend geliştirme
```bash
cd backend
npm run start:dev
```

### Test çalıştırma
```bash
cd backend
npm run test
```

### Build
```bash
cd backend
npm run build
```

## 🌱 Seed Data

Uygulama ilk çalıştığında otomatik olarak kategoriler yüklenir:
- Elektrikçi
- Sıhhi Tesisatçı
- Taksici
- Temizlikçi
- Bakıcı
- Bahçıvan
- Tesisatçı
- Boya Badana
- Marangoz
- Çilingir
- Klima Teknisyeni
- Asansör Teknisyeni
- Çatı Ustası
- Seramikçi
- Demirci

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje hakkında sorularınız için issue açabilirsiniz. 