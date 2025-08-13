# 📚 API Örnekleri

Bu doküman, Online Jobs Backend API'sinin kullanım örneklerini içerir.

## 🔐 Authentication

Tüm korumalı endpoint'ler için JWT token gereklidir:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📝 Register Endpoint

### 1. Kullanıcı Kaydı (Email Koşullu)

**Endpoint:** `POST /auth/register`

**Açıklama:** Yeni kullanıcı kaydı oluşturur. Worker kullanıcıları için email opsiyonel, employer kullanıcıları için zorunludur.

**Request Body:**
```json
{
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",  // Worker için opsiyonel, Employer için zorunlu
  "phone": "+905551234567",
  "password": "123456",
  "userType": "worker",  // "worker" veya "employer"
  "categoryId": "category-id-123"  // Worker için opsiyonel - kategori seçimi
}
```

**Worker Kaydı (Email olmadan):**
```json
{
  "firstName": "Mehmet",
  "lastName": "Demir",
  "phone": "+905551234568",
  "password": "123456",
  "userType": "worker",
  "categoryId": "category-id-123"
}
```

**Employer Kaydı (Email zorunlu):**
```json
{
  "firstName": "Ayşe",
  "lastName": "Kaya",
  "email": "ayse@example.com",
  "phone": "+905551234569",
  "password": "123456",
  "userType": "employer"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "email": "ahmet@example.com",
    "phone": "+905551234567",
    "userType": "worker",
    "status": "active",
    "isVerified": false,
    "isOnline": false,
    "rating": 0,
    "totalReviews": 0,
    "profileImage": null,
    "bio": null,
    "categories": [
      {
        "id": "category-id-123",
        "name": "Elektrik"
      }
    ]
  },
  "message": "Kullanıcı başarıyla kayıt oldu",
  "status": "success",
  "statusCode": 201
}
```

**Hata Durumları:**

**Worker için Email Hatası:**
```json
{
  "message": "Validation failed",
  "error": "Bad Request",
  "statusCode": 400,
  "details": [
    {
      "field": "email",
      "message": "email should not be empty"
    }
  ]
}
```

**Employer için Email Hatası:**
```json
{
  "message": "Validation failed",
  "error": "Bad Request",
  "statusCode": 400,
  "details": [
    {
      "field": "email",
      "message": "email must be an email"
    }
  ]
}
```

**Telefon Numarası Zaten Kullanımda:**
```json
{
  "message": "Telefon numarası zaten kullanımda",
  "error": "Conflict",
  "statusCode": 409
}
```

**Email Zaten Kullanımda (Employer):**
```json
{
  "message": "Email veya telefon numarası zaten kullanımda",
  "error": "Conflict",
  "statusCode": 409
}
```

## 📋 Verification Endpoints

### 1. Gerekli Belge Türlerini Getir

**Endpoint:** `GET /verification/required-documents`

**Açıklama:** Worker kullanıcıları için gerekli belge türlerini listeler

**Response:**
```json
[
  {
    "type": "mastery_certificate",
    "name": "Ustalık Belgesi",
    "description": "Mesleki yeterlilik belgesi veya ustalık belgesi"
  },
  {
    "type": "tax_certificate",
    "name": "Vergi Levhası",
    "description": "Vergi dairesinden alınan vergi levhası"
  },
  {
    "type": "contract_pdf",
    "name": "Sözleşme Çıktısı",
    "description": "İş sözleşmesi veya anlaşma belgesi (PDF)"
  }
]
```

### 2. Doğrulama Belgesi Yükle

**Endpoint:** `POST /verification/upload`

**Açıklama:** Worker kullanıcıları için doğrulama belgesi yükleme (Sadece worker'lar)

**Headers:**
```bash
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

**Form Data:**
- `documentType`: Belge türü (mastery_certificate, tax_certificate, contract_pdf)
- `description`: Belge açıklaması (opsiyonel)
- `file`: Belge dosyası (PDF, JPG, PNG, max 5MB)

**Örnek:**
```bash
curl -X POST http://localhost:3000/verification/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "documentType=mastery_certificate" \
  -F "description=2023 yılı ustalık belgesi" \
  -F "file=@ustalik_belgesi.pdf"
```

**Response:**
```json
{
  "id": "verification-id",
  "userId": "user-id",
  "documentType": "mastery_certificate",
  "documentUrl": "/uploads/verifications/verification-1234567890.pdf",
  "originalFileName": "ustalik_belgesi.pdf",
  "mimeType": "application/pdf",
  "fileSize": 1024000,
  "status": "pending",
  "createdAt": "2024-01-10T10:30:00.000Z",
  "updatedAt": "2024-01-10T10:30:00.000Z"
}
```

### 3. Kullanıcının Belgelerini Getir

**Endpoint:** `GET /verification/my-documents`

**Açıklama:** Kullanıcının yüklediği tüm doğrulama belgelerini listeler

**Headers:**
```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
[
  {
    "id": "verification-id-1",
    "documentType": "mastery_certificate",
    "documentUrl": "/uploads/verifications/verification-1234567890.pdf",
    "originalFileName": "ustalik_belgesi.pdf",
    "mimeType": "application/pdf",
    "fileSize": 1024000,
    "status": "approved",
    "adminNotes": "Belge onaylandı",
    "rejectionReason": null,
    "reviewedAt": "2024-01-11T15:30:00.000Z",
    "createdAt": "2024-01-10T10:30:00.000Z"
  },
  {
    "id": "verification-id-2",
    "documentType": "tax_certificate",
    "documentUrl": "/uploads/verifications/verification-1234567891.jpg",
    "originalFileName": "vergi_levhasi.jpg",
    "mimeType": "image/jpeg",
    "fileSize": 512000,
    "status": "pending",
    "adminNotes": null,
    "rejectionReason": null,
    "reviewedAt": null,
    "createdAt": "2024-01-10T11:30:00.000Z"
  }
]
```

### 4. Doğrulama Durumunu Getir

**Endpoint:** `GET /verification/my-status`

**Açıklama:** Kullanıcının doğrulama durumunu ve istatistiklerini getirir

**Headers:**
```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "isVerified": false,
  "totalDocuments": 2,
  "approvedDocuments": 1,
  "pendingDocuments": 1,
  "rejectedDocuments": 0,
  "documents": [
    {
      "id": "verification-id-1",
      "documentType": "mastery_certificate",
      "status": "approved"
    },
    {
      "id": "verification-id-2",
      "documentType": "tax_certificate",
      "status": "pending"
    }
  ]
}
```

### 5. Belge Sil

**Endpoint:** `DELETE /verification/:id`

**Açıklama:** Bekleyen durumdaki belgeyi siler (Sadece pending belgeler)

**Headers:**
```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "message": "Belge başarıyla silindi"
}
```

### 6. Admin: Bekleyen Belgeleri Listele

**Endpoint:** `GET /verification/admin/pending`

**Açıklama:** Tüm bekleyen doğrulama belgelerini listeler (Admin yetkisi gerekli)

**Headers:**
```bash
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
```

**Response:**
```json
[
  {
    "id": "verification-id",
    "documentType": "mastery_certificate",
    "documentUrl": "/uploads/verifications/verification-1234567890.pdf",
    "originalFileName": "ustalik_belgesi.pdf",
    "status": "pending",
    "createdAt": "2024-01-10T10:30:00.000Z",
    "user": {
      "id": "user-id",
      "firstName": "Ahmet",
      "lastName": "Yılmaz",
      "userType": "worker"
    }
  }
]
```

### 7. Admin: Belge Durumunu Güncelle

**Endpoint:** `PUT /verification/admin/:id/status`

**Açıklama:** Doğrulama belgesi durumunu günceller (Admin yetkisi gerekli)

**Headers:**
```bash
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "approved",
  "adminNotes": "Belge geçerli ve onaylandı"
}
```

**Veya Red Durumu:**
```json
{
  "status": "rejected",
  "adminNotes": "Belge eksik bilgi içeriyor",
  "rejectionReason": "Belge net değil, yeniden yüklenmesi gerekiyor"
}
```

**Response:**
```json
{
  "id": "verification-id",
  "status": "approved",
  "adminNotes": "Belge geçerli ve onaylandı",
  "rejectionReason": null,
  "reviewedAt": "2024-01-11T15:30:00.000Z",
  "reviewedBy": "admin-id"
}
```

**Hata Durumları:**

**Worker Olmayan Kullanıcı Belge Yüklemeye Çalışırsa:**
```json
{
  "message": "Sadece worker kullanıcıları belge yükleyebilir",
  "error": "Bad Request",
  "statusCode": 400
}
```

**Aynı Belge Türü Zaten Yüklenmişse:**
```json
{
  "message": "Bu belge türü için zaten bir belge yüklenmiş",
  "error": "Conflict",
  "statusCode": 409
}
```

**Geçersiz Dosya Türü:**
```json
{
  "message": "Geçersiz dosya türü. Sadece PDF, JPG, PNG dosyaları kabul edilir",
  "error": "Bad Request",
  "statusCode": 400
}
```

**Dosya Boyutu Aşımı:**
```json
{
  "message": "Dosya boyutu 5MB'dan büyük olamaz",
  "error": "Bad Request",
  "statusCode": 400
}
```

## 👤 Users Endpoints

### 1. Kullanıcıları Listele

**Endpoint:** `GET /users`

**Açıklama:** Kullanıcıları listeler (filtreleme seçenekleri ile)

**Query Parameters:**
- `status`: Kullanıcı durumu (active, inactive)
- `userType`: Kullanıcı tipi (worker, employer)
- `isOnline`: Online durumu (true, false)

**Örnek:**
```bash
curl -X GET "http://localhost:3000/users?status=active&userType=worker"
```

**Response:**
```json
[
  {
    "id": "user-id",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "email": null,
    "phone": "+905551234567",
    "userType": "worker",
    "status": "active",
    "isVerified": false,
    "isOnline": true,
    "rating": 0,
    "totalReviews": 0,
    "profileImage": null,
    "bio": null,
    "categoryIds": ["category-id-1", "category-id-2"],
    "createdAt": "2024-01-10T10:30:00.000Z"
  }
]
```

## 📋 Jobs Endpoints

### 1. İş İlanlarını Listele (Kategori Filtreleme ile)

**Endpoint:** `GET /jobs`

**Açıklama:** İş ilanlarını listeler. Worker kullanıcıları için kategorilerine göre otomatik filtreleme yapar.

**Headers (Opsiyonel):**
```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `status`: İş durumu (open, closed, in_progress)
- `categoryId`: Kategori ID'si
- `employerId`: İşveren ID'si
- `latitude`: Enlem (konum filtreleme için)
- `longitude`: Boylam (konum filtreleme için)
- `radius`: Yarıçap (km) (konum filtreleme için)

**Özellikler:**
- **Worker kullanıcıları:** Sadece kendi kategorilerindeki işleri görür
- **Employer kullanıcıları:** Tüm işleri görür
- **Giriş yapmayan kullanıcılar:** Tüm işleri görür

**Örnek (Worker için):**
```bash
curl -X GET "http://localhost:3000/jobs" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Örnek (Giriş yapmadan):**
```bash
curl -X GET "http://localhost:3000/jobs?status=open&categoryId=category-id"
```

**Response:**
```json
[
  {
    "id": "job-id",
    "title": "Elektrik Tesisatçısı Aranıyor",
    "description": "Deneyimli elektrik tesisatçısı aranıyor...",
    "salary": 8000,
    "status": "open",
    "employerId": "employer-id",
    "categoryId": "category-id",
    "createdAt": "2024-01-10T10:30:00.000Z",
    "employer": {
      "id": "employer-id",
      "firstName": "Mehmet",
      "lastName": "Demir",
      "userType": "employer"
    },
    "category": {
      "id": "category-id",
      "name": "Elektrik",
      "description": "Elektrik işleri"
    },
    "userInfo": {
      "latitude": 41.0082,
      "longitude": 28.9784
    }
  }
]
```

### 2. İş İlanı Oluştur

**Endpoint:** `POST /jobs`

**Açıklama:** Yeni iş ilanı oluşturur (Sadece employer'lar)

**Headers:**
```bash
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Elektrik Tesisatçısı Aranıyor",
  "description": "Deneyimli elektrik tesisatçısı aranıyor. En az 3 yıl deneyim gerekli.",
  "salary": 8000,
  "categoryId": "category-id",
  "requirements": "Elektrik mühendisliği mezunu, 3+ yıl deneyim",
  "location": "İstanbul, Kadıköy",
  "latitude": 41.0082,
  "longitude": 28.9784
}
```

**Response:**
```json
{
  "id": "job-id",
  "title": "Elektrik Tesisatçısı Aranıyor",
  "description": "Deneyimli elektrik tesisatçısı aranıyor...",
  "salary": 8000,
  "status": "open",
  "employerId": "employer-id",
  "categoryId": "category-id",
  "createdAt": "2024-01-10T10:30:00.000Z"
}
```

### 3. İş İlanı Detayı

**Endpoint:** `GET /jobs/:id`

**Açıklama:** Belirli bir iş ilanının detaylarını getirir

**Örnek:**
```bash
curl -X GET http://localhost:3000/jobs/job-id
```

**Response:**
```json
{
  "id": "job-id",
  "title": "Elektrik Tesisatçısı Aranıyor",
  "description": "Deneyimli elektrik tesisatçısı aranıyor...",
  "salary": 8000,
  "status": "open",
  "employerId": "employer-id",
  "categoryId": "category-id",
  "requirements": "Elektrik mühendisliği mezunu, 3+ yıl deneyim",
  "location": "İstanbul, Kadıköy",
  "createdAt": "2024-01-10T10:30:00.000Z",
  "employer": {
    "id": "employer-id",
    "firstName": "Mehmet",
    "lastName": "Demir",
    "userType": "employer"
  },
  "category": {
    "id": "category-id",
    "name": "Elektrik",
    "description": "Elektrik işleri"
  },
  "applications": [
    {
      "id": "application-id",
      "workerId": "worker-id",
      "status": "pending",
      "createdAt": "2024-01-10T11:30:00.000Z"
    }
  ]
}
```

### 4. İş Başvurusu Yap

**Endpoint:** `POST /jobs/:id/apply`

**Açıklama:** İş ilanına başvuru yapar (Sadece worker'lar)

**Headers:**
```bash
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "coverLetter": "Bu pozisyon için başvuruyorum. Deneyimlerim...",
  "expectedSalary": 7500
}
```

**Response:**
```json
{
  "id": "application-id",
  "jobId": "job-id",
  "workerId": "worker-id",
  "status": "pending",
  "coverLetter": "Bu pozisyon için başvuruyorum...",
  "expectedSalary": 7500,
  "createdAt": "2024-01-10T11:30:00.000Z"
}
```

### 5. Kendi İşlerimi Getir

**Endpoint:** `GET /jobs/my/jobs`

**Açıklama:** Kullanıcının oluşturduğu iş ilanlarını getirir (Sadece employer'lar)

**Headers:**
```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
[
  {
    "id": "job-id",
    "title": "Elektrik Tesisatçısı Aranıyor",
    "status": "open",
    "applicationsCount": 3,
    "createdAt": "2024-01-10T10:30:00.000Z"
  }
]
```

### 6. Başvurularımı Getir

**Endpoint:** `GET /jobs/my/applications`

**Açıklama:** Kullanıcının yaptığı iş başvurularını getirir (Sadece worker'lar)

**Headers:**
```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
[
  {
    "id": "application-id",
    "jobId": "job-id",
    "status": "pending",
    "createdAt": "2024-01-10T11:30:00.000Z",
    "job": {
      "id": "job-id",
      "title": "Elektrik Tesisatçısı Aranıyor",
      "employer": {
        "firstName": "Mehmet",
        "lastName": "Demir"
      }
    }
  }
]
```

**Worker Kategori Filtreleme Özelliği:**

Worker kullanıcıları `/jobs` endpoint'ini çağırdığında:

1. **Kullanıcının kategorileri kontrol edilir** (`user.categoryIds`)
2. **user_categories tablosu ile join yapılır**
3. **Sadece kullanıcının kategorilerindeki işler filtrelenir**
4. **Kategori yoksa tüm işler gösterilir**

**Örnek SQL Sorgusu:**
```sql
SELECT job.* 
FROM jobs job
LEFT JOIN user_categories uc ON uc.userId = :userId
WHERE job.categoryId = uc.categoryId 
AND uc.categoryId IN (:categoryIds)
```

**Test Senaryoları:**

1. **Worker giriş yapmadan:** Tüm işler görünür
2. **Worker giriş yaparak:** Sadece kategorilerindeki işler görünür
3. **Employer giriş yaparak:** Tüm işler görünür
4. **Kategori filtresi ile:** Ek filtreleme yapılır 