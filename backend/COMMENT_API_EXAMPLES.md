# Comment API Örnekleri

## Endpoints

### 1. Yorum Oluştur
**POST** `/comments`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (İş ile):**
```json
{
  "commentedUserId": "4b27001b-759d-47e3-9a49-67d3445e26e8",
  "description": "Çok iyi bir işçi, zamanında geldi ve işini hakkıyla yaptı.",
  "rating": 5,
  "jobId": "5c7db92b-1894-4618-99f3-93e993a63f48",
  "showName": true
}
```

**Body (İş olmadan):**
```json
{
  "commentedUserId": "4b27001b-759d-47e3-9a49-67d3445e26e8",
  "description": "Genel olarak çok iyi bir işçi.",
  "rating": 4,
  "showName": true
}
```

**Response:**
```json
{
  "id": "8f9e7d6c-5b4a-3c2d-1e0f-9a8b7c6d5e4f",
  "commenterId": "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
  "commentedUserId": "4b27001b-759d-47e3-9a49-67d3445e26e8",
  "description": "Çok iyi bir işçi, zamanında geldi ve işini hakkıyla yaptı.",
  "rating": 5,
  "jobId": "5c7db92b-1894-4618-99f3-93e993a63f48",
  "showName": true,
  "createdAt": "2025-01-08T17:30:00.000Z",
  "updatedAt": "2025-01-08T17:30:00.000Z",
  "commenter": {
    "id": "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "profileImage": "https://example.com/profile.jpg"
  },
  "commentedUser": {
    "id": "4b27001b-759d-47e3-9a49-67d3445e26e8",
    "firstName": "Fatma",
    "lastName": "Koç",
    "profileImage": "https://example.com/profile2.jpg"
  },
  "job": {
    "id": "5c7db92b-1894-4618-99f3-93e993a63f48",
    "title": "Temizlikçi Arıyorum",
    "description": "Ev temizliği için güvenilir kişi arıyorum"
  }
}
```

### 2. Tüm Yorumları Listele
**GET** `/comments`

**Query Parameters:**
- `commentedUserId`: Yorum yapılan kullanıcı ID'si
- `commenterId`: Yorum yapan kullanıcı ID'si
- `jobId`: İş ID'si
- `rating`: Rating değeri (1-5)

**Example:**
```
GET /comments?commentedUserId=4b27001b-759d-47e3-9a49-67d3445e26e8&rating=5
```

**Response:**
```json
[
  {
    "id": "8f9e7d6c-5b4a-3c2d-1e0f-9a8b7c6d5e4f",
    "commenterId": "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
    "commentedUserId": "4b27001b-759d-47e3-9a49-67d3445e26e8",
    "description": "Çok iyi bir işçi, zamanında geldi ve işini hakkıyla yaptı.",
    "rating": 5,
    "jobId": "5c7db92b-1894-4618-99f3-93e993a63f48",
    "showName": true,
    "createdAt": "2025-01-08T17:30:00.000Z",
    "updatedAt": "2025-01-08T17:30:00.000Z",
    "commenter": {
      "id": "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
      "firstName": "Ahmet",
      "lastName": "Yılmaz",
      "profileImage": "https://example.com/profile.jpg"
    },
    "commentedUser": {
      "id": "4b27001b-759d-47e3-9a49-67d3445e26e8",
      "firstName": "Fatma",
      "lastName": "Koç",
      "profileImage": "https://example.com/profile2.jpg"
    },
    "job": {
      "id": "5c7db92b-1894-4618-99f3-93e993a63f48",
      "title": "Temizlikçi Arıyorum"
    }
  }
]
```

### 3. Kullanıcının Aldığı Yorumları Listele
**GET** `/comments/user/:userId`

**Example:**
```
GET /comments/user/4b27001b-759d-47e3-9a49-67d3445e26e8
```

**Response:** (Yukarıdaki gibi)

### 4. Kendi Yaptığım Yorumları Listele
**GET** `/comments/my`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** (Yukarıdaki gibi)

### 5. İşe Ait Yorumları Listele
**GET** `/comments/job/:jobId`

**Example:**
```
GET /comments/job/5c7db92b-1894-4618-99f3-93e993a63f48
```

**Response:** (Yukarıdaki gibi)

### 6. Yorum Detayı
**GET** `/comments/:id`

**Example:**
```
GET /comments/8f9e7d6c-5b4a-3c2d-1e0f-9a8b7c6d5e4f
```

**Response:** (Yukarıdaki gibi)

### 7. Yorum Güncelle
**PUT** `/comments/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "description": "Güncellenmiş yorum metni",
  "rating": 4,
  "showName": false
}
```

**Response:** (Güncellenmiş yorum objesi)

### 8. Yorum Sil
**DELETE** `/comments/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Yorum başarıyla silindi"
}
```

## Özellikler

1. **Rating Sistemi**: 1-5 arası rating
2. **Anonim Yorumlar**: `showName: false` ile anonim yorum yapılabilir
3. **İş İlişkisi**: `jobId` ile yorumun hangi iş için yapıldığı belirtilebilir
4. **Tekrar Yorum Engeli**: Aynı kullanıcıya aynı iş için birden fazla yorum yapılamaz
5. **Kendine Yorum Engeli**: Kullanıcı kendine yorum yapamaz
6. **Otomatik Rating Güncelleme**: Yorum eklendiğinde/silindiğinde kullanıcının ortalama rating'i otomatik güncellenir

## Hata Kodları

- `400`: Geçersiz veri (kendine yorum, tekrar yorum, geçersiz rating)
- `401`: Yetkilendirme hatası
- `403`: Yetkisiz erişim (yorumu düzenleme/silme)
- `404`: Kullanıcı, iş veya yorum bulunamadı 