# Swagger API Endpoints - Güncel Liste

## 📌 Ana Kullanıcı Endpoint'leri

### **User Controller** - `/user` (Tek Kullanıcı İçin)

| Method | Endpoint | Açıklama | Auth | Tag |
|--------|----------|----------|------|-----|
| `GET` | `/user` | Kendi tüm bilgilerimi getir (User + UserInfos + UserCategories + UserVerifications + UserVerified) | ✅ JWT | User |
| `PUT` | `/user` | Kendi tüm bilgilerimi güncelle (Worker: city, district, neighborhood, lat/lng; Employer: address bilgileri) | ✅ JWT | User |

**Response Yapısı:**
```json
{
  "id": "uuid",
  "firstName": "Ahmet",
  "userType": "worker",
  "city": "İstanbul",              // Worker için
  "district": "Kadıköy",           // Worker için
  "neighborhood": "Fenerbahçe",    // Worker için
  "latitude": 41.0082,             // Worker için
  "longitude": 28.9784,            // Worker için
  "userCategories": [...],         // Kategori detayları
  "userInfos": [...],              // Employer için adresler
  "userVerifications": [...],      // Verification kayıtları
  "userVerified": true             // Boolean
}
```

---

## 📋 Users Controller - `/users` (Çoklu Kullanıcı Listesi)

### Admin/Development Endpoint'leri

| Method | Endpoint | Açıklama | Auth | Amaç |
|--------|----------|----------|------|------|
| `GET` | `/users/test` | Test kullanıcıları (+905550000001-005) | ❌ Public | Development |
| `GET` | `/users/real` | Gerçek kullanıcılar (test hariç) | ❌ Public | Development |
| `GET` | `/users` | Tüm kullanıcılar | ✅ JWT | Admin |
| `GET` | `/users/active` | Aktif kullanıcılar (status: ACTIVE) | ✅ JWT | Admin |
| `GET` | `/users/online` | Online kullanıcılar (isOnline: true) | ✅ JWT | Admin |
| `GET` | `/users/by-type/:userType` | Tipe göre listele (worker/employer) | ✅ JWT | Admin |

### İş Akışı Endpoint'leri

| Method | Endpoint | Açıklama | Auth | Amaç |
|--------|----------|----------|------|------|
| `GET` | `/users/online-workers` | Yakındaki online worker'ları listele | ✅ JWT | Employer |
| `GET` | `/users/online-employers` | Yakındaki online employer'ları listele | ✅ JWT | Worker |
| `GET` | `/users/:id` | Başka kullanıcının detaylarını getir | ✅ JWT | Chat, Profil |
| `GET` | `/users/user-status/:userId` | Kullanıcının online durumu | ❌ Public | Chat |
| `GET` | `/users/profile-image/:userId` | Profil fotoğrafı URL'i | ❌ Public | Profil |
| `GET` | `/users/portfolio/images/:userId` | Başka kullanıcının portföy resimleri | ❌ Public | Profil |

### Upload Endpoint'leri (Dosya İşlemleri)

| Method | Endpoint | Açıklama | Auth | Amaç |
|--------|----------|----------|------|------|
| `PUT` | `/users/profile-image` | Profil fotoğrafı yükle | ✅ JWT | Upload |
| `POST` | `/users/portfolio/images` | Portföy resmi ekle (max 10) | ✅ JWT | Upload (Worker) |
| `POST` | `/users/portfolio/images/delete` | Portföy resmi sil | ✅ JWT | Delete |
| `POST` | `/users/portfolio/images/delete-all` | Tüm portföy resimlerini sil | ✅ JWT | Delete |

---

## 🗑️ KALDIRILDI - Artık `/user` Kullanın

Bu endpoint'ler **tamamen kaldırıldı**, artık `GET /user` ve `PUT /user` kullanılıyor:

| Eski Endpoint | Yeni Çözüm |
|---------------|------------|
| `PUT /users/user-types` | `PUT /user` → `{ "userType": "worker" }` |
| `GET /users/user-info` | `GET /user` → response'da `userInfos` array |
| `GET /users/user-infos` | `GET /user` → response'da `userInfos` array |
| `PUT /users/status` | `PUT /user` → `{ "status": "active" }` |
| `PUT /users/is-online` | `PUT /user` → `{ "isOnline": true }` |
| `PUT /users/is-offline` | `PUT /user` → `{ "isOnline": false }` |
| `GET /users/is-verified` | `GET /user` → response'da `userVerified` boolean |
| `PUT /users/location` | `PUT /user` → `{ "latitude": 41.0082, "longitude": 28.9784, "city": "İstanbul" }` |
| `PUT /users/user-info` | `PUT /user` → `{ "addressName": "Ev", "address": "..." }` |
| `POST /users/user-info` | `PUT /user` → Aynı DTO |
| `PUT /users/profile` | `PUT /user` → Aynı alanlar |
| `GET /users/portfolio/images` | `GET /user` → response'da `portfolioImages` array |

---

## 💼 Jobs Controller - `/jobs`

### Job Priority Değişikliği

| Eski | Yeni |
|------|------|
| `isUrgent: boolean` ❌ | `priority: JobPriority` ✅ |

**JobPriority Enum:**
```typescript
enum JobPriority {
  URGENT = 'urgent',        // Acil (Skor: 60)
  IMMEDIATE = 'immediate',  // Hemen (Skor: 50)
  SCHEDULED = 'scheduled',  // İleri zamanlı (Skor: 30)
  NORMAL = 'normal',        // Normal (Skor: 20)
}
```

---

## 🗑️ Job Application - Kaldırılan

| Eski | Durum |
|------|-------|
| `ApplicationTag` enum ❌ | Kaldırıldı |
| `tag` field ❌ | Kaldırıldı |

`tag` alanı artık job-application'da yok. İş öncelikleri artık Job entity'de `priority` olarak tutuluyor.

---

## 📊 Veri Yapısı Değişiklikleri

### Worker (User Tablosunda)
```json
{
  "userType": "worker",
  "city": "İstanbul",
  "district": "Kadıköy",
  "neighborhood": "Fenerbahçe",
  "latitude": 41.0082,
  "longitude": 28.9784,
  "userInfos": []  // Boş - Worker'ların UserInfo kaydı yok
}
```

### Employer (UserInfo Tablosunda)
```json
{
  "userType": "employer",
  "city": null,
  "district": null,
  "neighborhood": null,
  "latitude": null,
  "longitude": null,
  "userInfos": [
    {
      "name": "Ev Adresim",
      "address": "Bağdat Cad. No:14",
      "buildingNo": "12/A",
      "floor": "3",
      "apartmentNo": "8"
    }
  ]
}
```

---

## 🎯 Önerilen Kullanım

### Kendi Bilgilerini Alma/Güncelleme
```bash
# Tüm bilgilerini al
GET /user

# Bilgilerini güncelle (sadece değişecek alanlar)
PUT /user
{ "firstName": "Mehmet", "bio": "Yeni bio" }
```

### Başka Kullanıcı Bilgileri
```bash
# Profil görüntüle
GET /users/:userId

# Online durumu
GET /users/user-status/:userId

# Profil resmi
GET /users/profile-image/:userId

# Portföy resimleri
GET /users/portfolio/images/:userId
```

### Worker/Employer Listesi
```bash
# Yakındaki online worker'lar
GET /users/online-workers?latitude=41&longitude=28&radius=10&categoryId=uuid

# Yakındaki online employer'lar
GET /users/online-employers?latitude=41&longitude=28&radius=10
```

---

## ✅ Swagger'da Görünüm

Swagger'ı açtığınızda (`http://localhost:3000/api`):

1. **User** tag (Yeni!) - 2 endpoint
   - `GET /user`
   - `PUT /user`

2. **Users** tag - Liste ve admin endpoint'leri
   - Admin: test, real, active, online, by-type
   - Liste: online-workers, online-employers
   - Diğer: :id, user-status, profile-image, portfolio

3. **Jobs** tag
   - Artık `priority` field'ı var (urgent, immediate, scheduled, normal)
   - `isUrgent` kaldırıldı

4. **Job Applications** tag  
   - `tag` field'ı kaldırıldı

