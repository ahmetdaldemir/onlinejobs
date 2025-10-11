# User Endpoints Migration Guide

## 🎯 Amaç

Tüm user güncellemeleri ve bilgi alımı **TEK ENDPOINT** üzerinden yapılıyor:
- **GET /user** - Kendi bilgilerimi getir
- **PUT /user** - Kendi bilgilerimi güncelle

## ❌ KALDIRILDI - Artık /user Kullanın

### Güncelleme Endpoint'leri
| Eski Endpoint | Yeni Endpoint | Açıklama |
|---------------|---------------|----------|
| `PUT /users/user-types` | `PUT /user` | `userType` alanını gönderin |
| `PUT /users/status` | `PUT /user` | `status` alanını gönderin (veya admin endpoint) |
| `PUT /users/is-online` | `PUT /user` | `isOnline: true` gönderin |
| `PUT /users/is-offline` | `PUT /user` | `isOnline: false` gönderin |
| `PUT /users/location` | `PUT /user` | `latitude`, `longitude`, `city`, `district`, `neighborhood` gönderin |
| `PUT /users/user-info` | `PUT /user` | `addressName`, `address`, `buildingNo`, vb. gönderin |

### Bilgi Getirme Endpoint'leri
| Eski Endpoint | Yeni Endpoint | Açıklama |
|---------------|---------------|----------|
| `GET /users/user-info` | `GET /user` | Response'da `userInfos` array'i |
| `GET /users/user-infos` | `GET /user` | Response'da `userInfos` array'i |
| `GET /users/is-verified` | `GET /user` | Response'da `userVerified` boolean |

## ✅ KALDILAR - Kullanılmaya Devam Edebilir

### Admin ve Liste Endpoint'leri
- `GET /users` - Tüm kullanıcıları listele (admin için)
- `GET /users/test` - Test kullanıcıları (admin için)
- `GET /users/real` - Gerçek kullanıcılar (admin için)
- `GET /users/active` - Aktif kullanıcılar (admin için)
- `GET /users/online` - Online kullanıcılar (admin için)
- `GET /users/by-type/:userType` - Tipe göre listele (admin için)

### İş Akışı Endpoint'leri
- `GET /users/online-workers` - Online worker'ları listele (iş verenler için)
- `GET /users/online-employers` - Online employer'ları listele (worker'lar için)
- `GET /users/:id` - Başka kullanıcının bilgisini getir (chat, profil için)
- `GET /users/user-status/:userId` - Kullanıcının online durumu (chat için)

### Upload Endpoint'leri
- `POST /users/profile-image` - Profil fotoğrafı yükle
- `GET /users/profile-image/:userId` - Profil fotoğrafı getir
- `POST /users/portfolio/images` - Portföy resmi ekle (worker için)
- `DELETE /users/portfolio/images/:filename` - Portföy resmi sil
- `DELETE /users/portfolio/images` - Tüm portföy resimlerini sil

### Verification Endpoint'leri
- `/user-verification/*` - Ayrı controller'da (UserVerificationController)

## 🔧 Kullanım Örnekleri

### Eski Yöntem (❌ Artık Kullanılmıyor)
```bash
# Online durumu güncelle
PUT /users/is-online
{ "isOnline": true }

# Konum güncelle
PUT /users/location
{ "latitude": 41.0082, "longitude": 28.9784 }

# UserInfo güncelle
PUT /users/user-info
{ "addressName": "Ev", "address": "İstanbul" }
```

### Yeni Yöntem (✅ Kullanın)
```bash
# Tek istekle tümünü güncelle
PUT /user
{
  "firstName": "Ahmet",
  "isOnline": true,
  "latitude": 41.0082,
  "longitude": 28.9784,
  "city": "İstanbul",
  "district": "Kadıköy",
  "addressName": "Ev",
  "address": "Bağdat Cad."
}
```

### Bilgi Alma

**Eski Yöntem (❌):**
```bash
GET /users/user-info    → userInfos
GET /users/is-verified  → isVerified
```

**Yeni Yöntem (✅):**
```bash
GET /user
```

**Response:**
```json
{
  "id": "...",
  "firstName": "Ahmet",
  "isOnline": true,
  "latitude": 41.0082,
  "longitude": 28.9784,
  "city": "İstanbul",
  "userInfos": [...],
  "userVerified": true,
  "userCategories": [...],
  "userVerifications": [...]
}
```

## 📊 Avantajlar

1. **Tek İstek** - Network trafiği azaldı
2. **Tutarlılık** - Tüm bilgiler tek yerden
3. **Daha Az Kod** - Frontend'de daha az endpoint yönetimi
4. **Performans** - Daha az HTTP overhead

## 🚀 Migration Adımları

1. ✅ Frontend'de `/users/*` kullanımlarını bulun
2. ✅ Hepsini `/user` endpoint'ine taşıyın
3. ✅ Request body'leri birleştirin (tek istek)
4. ✅ Response'ları `GET /user` formatına göre güncelleyin
5. ✅ Test edin

## ⚠️ Dikkat Edilmesi Gerekenler

- **Worker** kullanıcılar: `city`, `district`, `neighborhood`, `latitude`, `longitude` (User tablosunda)
- **Employer** kullanıcılar: `addressName`, `address`, `buildingNo`, `floor`, `apartmentNo` (UserInfo tablosunda)
- Worker'a employer alanları gönderilemez (hata alırsınız)
- Employer'a worker alanları gönderilemez (hata alırsınız)

