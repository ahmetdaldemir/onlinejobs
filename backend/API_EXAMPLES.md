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