# 🔧 Sorun Giderme Rehberi

Bu doküman, Online Jobs Backend projesinde karşılaşılan yaygın sorunları ve çözümlerini içerir.

## 🚨 Yaygın Sorunlar ve Çözümleri

### 1. PowerShell Sözdizimi Hatası

**Sorun:**
```powershell
cd backend && npm run start:dev
# Hata: The token '&&' is not a valid statement separator in this version.
```

**Çözüm:**
PowerShell'de komutları zincirlemek için şu yöntemleri kullanın:

```powershell
# Yöntem 1: & operatörü (ardışık çalıştırma)
cd backend & npm run start:dev

# Yöntem 2: ; operatörü (sıralı çalıştırma)
cd backend ; npm run start:dev

# Yöntem 3: Ayrı komutlar
cd backend
npm run start:dev

# Yöntem 4: PowerShell script kullanın
.\start-dev.ps1
```

**Alternatif:** Git Bash, WSL veya Command Prompt kullanabilirsiniz.

### 2. UUID Hatası: "user-infos"

**Sorun:**
```
ERROR [ExceptionsHandler] invalid input syntax for type uuid: "user-infos"
```

**Neden:** `/users/user-infos` isteği `@Get(':id')` route'una yakalanıyor ve "user-infos" string'i bir UUID olarak işlenmeye çalışılıyor.

**Çözüm:** Route sıralamasını düzelttik. Daha spesifik route'lar, parametreli route'lardan önce tanımlanmalı.

**Düzeltilen Route'lar:**
- `@Get('user-info')` → `@Get(':id')` öncesine taşındı
- `@Get('my/applications')` → `@Get(':id')` öncesine taşındı

### 3. Route Sıralama Sorunu

**Sorun:** Spesifik route'lar parametreli route'lardan sonra tanımlandığında, parametreli route'lar önce eşleşir.

**Çözüm:** Her zaman spesifik route'ları parametreli route'lardan önce tanımlayın.

```typescript
// ✅ Doğru sıralama
@Get('user-info')        // Spesifik route
@Get('my/applications')  // Spesifik route
@Get(':id')              // Parametreli route

// ❌ Yanlış sıralama
@Get(':id')              // Parametreli route
@Get('user-info')        // Spesifik route (hiçbir zaman eşleşmez)
```

### 4. UUID Validasyonu

**Eklenen Özellik:** Tüm `findById` metodlarına UUID validasyonu eklendi.

```typescript
// UUID formatını kontrol et
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
if (!uuidRegex.test(id)) {
  throw new BadRequestException(`Geçersiz UUID formatı: ${id}. Lütfen geçerli bir kullanıcı ID'si girin.`);
}
```

## 🧪 Test Araçları

### 1. UUID Test Sayfası
```
http://localhost:3000/test/test-uuid.html
```

Bu sayfa ile:
- Geçerli UUID'lerle test
- Geçersiz UUID'lerle test
- API endpoint'lerinin doğru çalışıp çalışmadığını kontrol

### 2. Upload Test Sayfası
```
http://localhost:3000/test-upload.html
```

Bu sayfa ile:
- Dosya upload işlevselliğini test
- Profil fotoğrafı yükleme testi

### 3. Admin Panel
```
http://localhost:3000/public/admin-dashboard.html
```

Bu panel ile:
- Kullanıcı yönetimi
- Kategori yönetimi
- Profil fotoğrafı yükleme

## 🔍 Debug İpuçları

### 1. Konsol Logları
Backend'de detaylı loglar eklendi:
- Upload işlemleri için loglar
- Notification işlemleri için loglar
- UUID validasyonu için loglar

### 2. API Dokümantasyonu
```
http://localhost:3000/api
```

Swagger UI ile tüm endpoint'leri test edebilirsiniz.

### 3. Health Check
```
http://localhost:3000/health
```

Backend'in çalışıp çalışmadığını kontrol edin.

## 🚀 Başlatma Komutları

### PowerShell için:
```powershell
# Yöntem 1
cd backend & npm run start:dev

# Yöntem 2
.\start-dev.ps1
```

### Git Bash/WSL için:
```bash
cd backend && npm run start:dev
```

### Command Prompt için:
```cmd
cd backend && npm run start:dev
```

## 📋 Kontrol Listesi

Backend'i başlatmadan önce:

- [ ] Node.js 18+ yüklü
- [ ] PostgreSQL çalışıyor
- [ ] Redis çalışıyor (opsiyonel)
- [ ] `.env` dosyası doğru yapılandırılmış
- [ ] `npm install` çalıştırıldı

## 🆘 Hala Sorun Yaşıyorsanız

1. **Logları kontrol edin:** Backend konsolunda hata mesajlarını okuyun
2. **Test sayfalarını kullanın:** UUID ve upload test sayfalarını deneyin
3. **API dokümantasyonunu kontrol edin:** Swagger UI'da endpoint'leri test edin
4. **Veritabanı bağlantısını kontrol edin:** PostgreSQL'in çalıştığından emin olun

## 📞 Destek

Sorun devam ederse:
1. Hata mesajını kopyalayın
2. Hangi adımda sorun yaşadığınızı belirtin
3. Test sayfalarından aldığınız sonuçları paylaşın 