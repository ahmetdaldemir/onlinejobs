# 📚 API Örnekleri

Bu doküman, Online Jobs Backend API'sinin kullanım örneklerini içerir.

## 🔐 Authentication

Tüm korumalı endpoint'ler için JWT token gereklidir:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

## 👤 Users Endpoints

### 1. Kullanıcı Bilgilerini Güncelle (ID ile)

**Endpoint:** `PUT /users/user-info`

**Açıklama:** UserInfo kaydını ID ile günceller veya yeni kayıt oluşturur.

**Request Body:**
```json
{
  "userInfoId": "550e8400-e29b-41d4-a716-446655440000",  // Opsiyonel - ID varsa günceller
  "name": "Ev Adresi",                                    // Opsiyonel - ID yoksa zorunlu
  "latitude": 41.0082,
  "longitude": 28.9784,
  "address": "İstanbul, Türkiye",
  "neighborhood": "Kadıköy",
  "buildingNo": "123",
  "floor": "3",
  "apartmentNo": "A",
  "description": "Ana giriş, asansör var"
}
```

**Örnekler:**

**1. ID ile Güncelleme:**
```bash
curl -X PUT http://localhost:3000/users/user-info \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userInfoId": "550e8400-e29b-41d4-a716-446655440000",
    "address": "Yeni adres bilgisi",
    "latitude": 41.0082,
    "longitude": 28.9784
  }'
```

**2. Name ile Güncelleme (ID yoksa):**
```bash
curl -X PUT http://localhost:3000/users/user-info \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ev Adresi",
    "address": "İstanbul, Türkiye",
    "latitude": 41.0082,
    "longitude": 28.9784
  }'
```

**3. Yeni Kayıt Oluşturma:**
```bash
curl -X PUT http://localhost:3000/users/user-info \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "İş Yeri Adresi",
    "address": "Ankara, Türkiye",
    "latitude": 39.9334,
    "longitude": 32.8597
  }'
```

**Response:**
```json
{
  "id": "user-id",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "userInfos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Ev Adresi",
      "latitude": 41.0082,
      "longitude": 28.9784,
      "address": "İstanbul, Türkiye"
    }
  ]
}
```

**Hata Durumları:**
```json
{
  "message": "Adres adı (name) zorunludur veya userInfoId belirtilmelidir",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "Belirtilen userInfoId ile kayıt bulunamadı veya bu kullanıcıya ait değil",
  "error": "Bad Request", 
  "statusCode": 400
}
```

## 💼 Jobs Endpoints

### 1. İş İlanı Oluştur

**Endpoint:** `POST /jobs`

**Açıklama:** Employer kullanıcıları için iş ilanı oluşturur. Sadece employer tipindeki kullanıcılar iş ilanı oluşturabilir.

**Request Body:**
```json
{
  "title": "Ev Temizliği İhtiyacı",
  "description": "3+1 evimizin haftalık temizliği için güvenilir temizlik görevlisi arıyoruz. Deneyimli, düzenli ve temiz çalışan birini tercih ediyoruz.",
  "budget": "500-800 TL",
  "scheduledDate": "2024-01-15",
  "scheduledTime": "09:00",
  "isUrgent": false,
  "categoryId": "550e8400-e29b-41d4-a716-446655440000",
  "userInfoId": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Zorunlu Alanlar:**
- `title`: İş ilanının başlığı
- `description`: İş ilanının açıklaması

**Opsiyonel Alanlar:**
- `budget`: Bütçe bilgisi (örn: "500-800 TL", "Saatlik 50 TL")
- `scheduledDate`: Planlanan tarih (YYYY-MM-DD formatında)
- `scheduledTime`: Planlanan saat (HH:MM formatında)
- `isUrgent`: Acil iş mi? (boolean)
- `categoryId`: Kategori ID'si
- `userInfoId`: Konum bilgilerini içeren UserInfo ID'si

**Örnekler:**

**1. Temel İş İlanı:**
```bash
curl -X POST http://localhost:3000/jobs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bahçe Bakımı",
    "description": "Villa bahçemizin düzenli bakımı için deneyimli bahçıvan arıyoruz.",
    "budget": "1000-1500 TL",
    "categoryId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**2. Konum Bilgili İş İlanı:**
```bash
curl -X POST http://localhost:3000/jobs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ev Taşıma Hizmeti",
    "description": "2+1 evimizi taşımak için güvenilir taşıma firması arıyoruz.",
    "budget": "2000-3000 TL",
    "scheduledDate": "2024-01-20",
    "scheduledTime": "10:00",
    "isUrgent": true,
    "categoryId": "550e8400-e29b-41d4-a716-446655440000",
    "userInfoId": "550e8400-e29b-41d4-a716-446655440001"
  }'
```

**3. Acil İş İlanı:**
```bash
curl -X POST http://localhost:3000/jobs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Acil Su Tesisatı Tamiri",
    "description": "Evimizde su kaçağı var, acil tamir gerekiyor.",
    "budget": "500-1000 TL",
    "isUrgent": true,
    "categoryId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "title": "Ev Temizliği İhtiyacı",
  "description": "3+1 evimizin haftalık temizliği için güvenilir temizlik görevlisi arıyoruz.",
  "status": "open",
  "budget": "500-800 TL",
  "scheduledDate": "2024-01-15",
  "scheduledTime": "09:00",
  "isUrgent": false,
  "viewCount": 0,
  "applicationCount": 0,
  "createdAt": "2024-01-10T10:30:00.000Z",
  "updatedAt": "2024-01-10T10:30:00.000Z",
  "employerId": "550e8400-e29b-41d4-a716-446655440003",
  "categoryId": "550e8400-e29b-41d4-a716-446655440000",
  "userInfoId": "550e8400-e29b-41d4-a716-446655440001",
  "employer": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "category": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Temizlik",
    "description": "Temizlik hizmetleri"
  }
}
```

**Hata Durumları:**

**Sadece Employer'lar İş İlanı Oluşturabilir:**
```json
{
  "message": "Sadece employer'lar iş ilanı oluşturabilir",
  "error": "Forbidden",
  "statusCode": 403
}
```

**Geçersiz Veri:**
```json
{
  "message": "Validation failed",
  "error": "Bad Request",
  "statusCode": 400,
  "details": [
    {
      "field": "title",
      "message": "title should not be empty"
    }
  ]
}
```

### 2. İş İlanlarını Listele

**Endpoint:** `GET /jobs`

**Query Parameters:**
- `status`: İş durumu (open, in_progress, completed, cancelled)
- `categoryId`: Kategori ID'si
- `employerId`: İşveren ID'si
- `latitude`: Enlem (konum bazlı arama için)
- `longitude`: Boylam (konum bazlı arama için)
- `radius`: Arama yarıçapı (km)

**Örnek:**
```bash
curl -X GET "http://localhost:3000/jobs?status=open&categoryId=550e8400-e29b-41d4-a716-446655440000&latitude=40.9909&longitude=29.0303&radius=10"
```

### 3. İş İlanı Detayı

**Endpoint:** `GET /jobs/:id`

**Örnek:**
```bash
curl -X GET http://localhost:3000/jobs/550e8400-e29b-41d4-a716-446655440002
``` 