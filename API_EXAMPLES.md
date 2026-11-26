# API Örnekleri

Bu dosya, Online Jobs API'sinin kullanım örneklerini içerir.

## Authentication

### Kullanıcı Kaydı
```bash
POST /auth/register
Content-Type: application/json

{
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",
  "phone": "+905551234567",
  "password": "123456",
  "userType": "job_seeker",
  "categoryId": "uuid-of-category"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "email": "ahmet@example.com",
    "phone": "+905551234567",
    "userType": "job_seeker",
    "status": "active",
    "isVerified": false,
    "rating": 0,
    "totalReviews": 0,
    "category": {
      "id": "uuid",
      "name": "Elektrikçi"
    }
  }
}
```

### Kullanıcı Girişi
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "ahmet@example.com",
  "password": "123456"
}
```

## Users

### Online İş Arayanları Listele
```bash
GET /users/online-job-seekers?latitude=41.0082&longitude=28.9784&radius=10&categoryId=uuid
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "firstName": "Mehmet",
    "lastName": "Demir",
    "email": "mehmet@example.com",
    "phone": "+905559876543",
    "userType": "job_seeker",
    "status": "online",
    "rating": 4.5,
    "totalReviews": 12,
    "latitude": 41.0082,
    "longitude": 28.9784,
    "address": "Kadıköy, İstanbul",
    "city": "İstanbul",
    "district": "Kadıköy",
    "category": {
      "id": "uuid",
      "name": "Elektrikçi"
    }
  }
]
```

### Kullanıcı Durumu Güncelle
```bash
PUT /users/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "online"
}
```

## Jobs

### İş İlanı Oluştur (Resimsiz)
```bash
POST /jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Elektrik Arızası",
  "description": "Evde elektrik kesintisi var, acil elektrikçi arıyorum.",
  "budget": "200",
  "categoryId": "uuid-of-category",
  "userInfoId": "uuid-of-user-info",
  "scheduledDate": "2024-01-20",
  "scheduledTime": "14:00",
  "priority": "urgent"
}
```

### İş İlanı Oluştur (Resimlerle)
```bash
POST /jobs
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- title: "Elektrik Arızası"
- description: "Evde elektrik kesintisi var, acil elektrikçi arıyorum."
- budget: "200"
- categoryId: "uuid-of-category"
- userInfoId: "uuid-of-user-info"
- scheduledDate: "2024-01-20"
- scheduledTime: "14:00"
- priority: "urgent"
- images: [file1.jpg]  // Dosya olarak, max 5 adet resim
- images: [file2.jpg]
```

**ÖNEMLİ NOTLAR:** 
- **Resim göndermeden JSON isteği yapıyorsanız:** `Content-Type: application/json` kullanın ve body'de `images` alanı GÖNDERMEYİN
- **Resim gönderiyorsanız:** `Content-Type: multipart/form-data` kullanın ve resimleri dosya olarak gönderin
- `images` alanını JSON body'de ASLA göndermemelisiniz (sadece multipart/form-data ile dosya olarak)
- `priority` değerleri: `urgent`, `immediate`, `scheduled`, `normal`
- `budget`, `scheduledDate`, `scheduledTime`, `categoryId`, `userInfoId`, `priority` alanları opsiyoneldir

### İş İlanlarını Listele
```bash
GET /jobs?status=open&categoryId=uuid&latitude=41.0082&longitude=28.9784&radius=10
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Elektrik Arızası",
    "description": "Evde elektrik kesintisi var, acil elektrikçi arıyorum.",
    "status": "open",
    "priority": "urgent",
    "budget": "200",
    "scheduledDate": "2024-01-20",
    "scheduledTime": "14:00",
    "jobImages": ["url1.jpg", "url2.jpg"],
    "viewCount": 5,
    "applicationCount": 2,
    "isFeatured": false,
    "featuredScore": 0,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "employerId": "uuid",
    "categoryId": "uuid",
    "userInfoId": "uuid",
    "employer": {
      "id": "uuid",
      "firstName": "Ayşe",
      "lastName": "Kaya",
      "phone": "+905551234567"
    },
    "category": {
      "id": "uuid",
      "name": "Elektrikçi"
    },
    "userInfo": {
      "id": "uuid",
      "address": "Kadıköy, İstanbul",
      "neighborhood": "Fenerbahçe",
      "city": "İstanbul",
      "district": "Kadıköy"
    }
  }
]
```

### İş Başvurusu Yap
```bash
POST /jobs/uuid/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "coverLetter": "Merhaba, elektrik arızanızı giderebilirim. 10 yıllık deneyimim var.",
  "proposedPrice": 180,
  "estimatedDuration": "2 saat",
  "proposedStartDate": "2024-01-15T14:00:00Z"
}
```

## Messages

### Mesaj Gönder
```bash
POST /messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "uuid",
  "content": "Merhaba, iş ilanınızı gördüm. Size yardımcı olabilirim.",
  "type": "text"
}
```

### Konuşmaları Listele
```bash
GET /messages/conversations
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "partnerId": "uuid",
    "partner": {
      "id": "uuid",
      "firstName": "Mehmet",
      "lastName": "Demir",
      "profileImage": "https://example.com/image.jpg"
    },
    "lastMessage": {
      "id": "uuid",
      "content": "Merhaba, iş ilanınızı gördüm.",
      "type": "text",
      "createdAt": "2024-01-15T11:30:00Z"
    },
    "unreadCount": 2
  }
]
```

### Konuşma Getir
```bash
GET /messages/conversation/uuid
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "content": "Merhaba, iş ilanınızı gördüm.",
    "type": "text",
    "isRead": false,
    "createdAt": "2024-01-15T11:30:00Z",
    "sender": {
      "id": "uuid",
      "firstName": "Mehmet",
      "lastName": "Demir"
    },
    "receiver": {
      "id": "uuid",
      "firstName": "Ayşe",
      "lastName": "Kaya"
    }
  }
]
```

## Categories

### Kategorileri Listele
```bash
GET /categories
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Elektrikçi",
    "description": "Elektrik tesisatı, arıza giderme, bakım onarım",
    "icon": "⚡",
    "orderIndex": 1
  },
  {
    "id": "uuid",
    "name": "Sıhhi Tesisatçı",
    "description": "Su tesisatı, kanalizasyon, ısıtma sistemleri",
    "icon": "🚰",
    "orderIndex": 2
  }
]
```

## Locations

### Şehirleri Listele
```bash
GET /locations/cities
```

**Response:**
```json
[
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya"
]
```

### İlçeleri Listele
```bash
GET /locations/districts?city=İstanbul
```

**Response:**
```json
[
  "Kadıköy",
  "Beşiktaş",
  "Şişli",
  "Beyoğlu",
  "Fatih"
]
```

### Mesafe Hesapla
```bash
GET /locations/distance?lat1=41.0082&lon1=28.9784&lat2=41.0151&lon2=28.9799
```

**Response:**
```json
{
  "distance": 0.85
}
```

## Error Responses

### Validation Error
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

### Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Not Found
```json
{
  "statusCode": 404,
  "message": "Kullanıcı bulunamadı"
}
```

### Conflict
```json
{
  "statusCode": 409,
  "message": "Email veya telefon numarası zaten kullanımda"
}
``` 