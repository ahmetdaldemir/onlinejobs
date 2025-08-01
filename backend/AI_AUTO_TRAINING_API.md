# AI Otomatik Eğitim ve Analiz API Dokümantasyonu

## Genel Bakış

Bu API, kullanıcı mesajlarından otomatik olarak eğitim verisi oluşturur, AI modelini eğitir ve kullanıcı davranışlarını analiz eder. Sistem şu özelliklere sahiptir:

- **Kullanıcı Bazlı Eğitim**: Belirli bir kullanıcının mesajlarından eğitim verisi oluşturur
- **Tüm Kullanıcılar**: Tüm kullanıcıların mesajlarından eğitim verisi oluşturur
- **Akıllı Filtreleme**: Kaliteli mesajları otomatik olarak seçer
- **Profil Bazlı**: Kullanıcı tipine göre özel eğitim verisi oluşturur
- **Otomatik Mesajlaşma**: Kullanıcı tipine göre karşılama ve bilgilendirme mesajları
- **Kullanıcı Analizi**: Detaylı kullanıcı davranış analizi ve AI puanlama

## Endpoints

### 1. Otomatik Mesajlaşma

#### Karşılama Mesajı Oluştur
**POST** `/ai/welcome-message/:userId`

Kullanıcı tipine göre otomatik karşılama mesajı oluşturur.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
- `userId`: Kullanıcı ID'si

**Body:**
```json
{
  "userType": "employer" // veya "worker"
}
```

**Response:**
```json
{
  "message": "Merhaba Ahmet! 👋\n\nHoş geldiniz! İşçi arama sürecinizde size yardımcı olmaktan mutluluk duyarım.\n\n📍 Konum: İstanbul Kadıköy\n\nSize nasıl yardımcı olabilirim?\n• Hangi kategoride işçi arıyorsunuz?\n• İş tanımınızı detaylandırmak ister misiniz?\n• Bütçe aralığınız nedir?\n\nBaşlamak için yukarıdaki sorulardan birini sorabilirsiniz. 😊"
}
```

#### İş Detayları Mesajı Oluştur
**POST** `/ai/job-details-message/:jobId`

İş detayları için otomatik bilgilendirme mesajı oluşturur.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
- `jobId`: İş ID'si

**Body:**
```json
{
  "userId": "user-id"
}
```

**Response:**
```json
{
  "message": "📋 İş Detayları\n\n🏢 İşveren: Ahmet Yılmaz\n📍 Konum: İstanbul Kadıköy\n📂 Kategori: Temizlik\n💰 Maaş: 5000 TL\n📅 Tarih: 08.01.2025\n\n📝 Açıklama:\nEv temizliği için güvenilir kişi arıyorum\n\n⏰ Çalışma Süresi: 4 saat\n📞 İletişim: +90 555 123 4567\n\nBu iş hakkında daha fazla bilgi almak ister misiniz? 🤔"
}
```

### 2. Kullanıcı Tipine Göre Eğitim

#### Kullanıcı Tipine Göre Eğitim Verisi Oluştur
**POST** `/ai/models/:id/user-type-training/:userId`

Kullanıcı tipine göre özel eğitim verisi oluşturur.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
- `id`: AI model ID'si
- `userId`: Kullanıcı ID'si

**Body:**
```json
{
  "userType": "employer" // veya "worker"
}
```

**Response:**
```json
[
  {
    "id": "training-data-id",
    "aiModelId": "model-id",
    "userId": "user-id",
    "inputMessage": "İşçi arıyorum",
    "responseMessage": "Hangi kategoride işçi arıyorsunuz? Size uygun adayları bulabilirim. 📍 Konum: İstanbul Kadıköy",
    "rating": 5,
    "context": {
      "userType": "employer",
      "location": "İstanbul Kadıköy"
    }
  }
]
```

### 3. Kullanıcı Analizi

#### Tek Kullanıcı Analizi
**GET** `/ai/user-analysis/:userId`

Belirli bir kullanıcının detaylı analizini oluşturur.

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `userId`: Kullanıcı ID'si

**Response:**
```json
{
  "userId": "user-id",
  "userProfile": {
    "userType": "employer",
    "registrationDate": "2025-01-01T00:00:00.000Z",
    "lastActive": "2025-01-08T17:30:00.000Z",
    "location": "İstanbul Kadıköy",
    "categories": "Temizlik"
  },
  "messageAnalysis": {
    "totalMessages": 25,
    "sentMessages": 15,
    "receivedMessages": 10,
    "averageResponseTime": 3.2,
    "commonWords": [
      { "word": "temizlik", "count": 8 },
      { "word": "işçi", "count": 6 }
    ],
    "communicationStyle": "Formal",
    "activeHours": {
      "9": 5,
      "10": 8,
      "14": 6
    }
  },
  "jobAnalysis": {
    "totalJobs": 3,
    "jobCategories": ["Temizlik", "Bakım"],
    "averageSalary": 4500,
    "preferredLocations": ["İstanbul Kadıköy"]
  },
  "aiScore": 85,
  "recommendations": [
    "Daha aktif mesajlaşma yaparak profil görünürlüğünüzü artırabilirsiniz.",
    "Daha fazla iş ilanı oluşturarak aday havuzunuzu genişletebilirsiniz."
  ]
}
```

#### Tüm Kullanıcılar Analizi
**GET** `/ai/user-analysis`

Tüm kullanıcıların analizini oluşturur.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalUsers": 150,
  "analyzedUsers": 145,
  "analyses": [
    // Yukarıdaki gibi kullanıcı analizleri
  ]
}
```

### 4. Kullanıcı Bazlı Model Eğitimi

**POST** `/ai/models/:id/train/user/:userId`

Kullanıcının mesajlarından eğitim verisi oluşturur ve modeli eğitir.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
- `id`: AI model ID'si
- `userId`: Kullanıcı ID'si

**Response:**
```json
{
  "id": "model-id",
  "name": "Job Matching AI",
  "status": "ACTIVE",
  "trainingDataCount": 25,
  "accuracy": 0.85,
  "lastTrainedAt": "2025-01-08T17:30:00.000Z"
}
```

### 5. Tüm Kullanıcılar için Otomatik Eğitim

**POST** `/ai/models/:id/train/all-users`

Tüm kullanıcıların mesajlarından eğitim verisi oluşturur ve modeli eğitir.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
- `id`: AI model ID'si

**Response:**
```json
{
  "id": "model-id",
  "name": "Job Matching AI",
  "status": "ACTIVE",
  "trainingDataCount": 150,
  "accuracy": 0.82,
  "lastTrainedAt": "2025-01-08T17:30:00.000Z"
}
```

### 6. Eğitim Verisi Oluşturma

**POST** `/ai/models/:id/generate-training-data/:userId`

Kullanıcının mesajlarından eğitim verisi oluşturur (eğitim yapmaz).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
- `id`: AI model ID'si
- `userId`: Kullanıcı ID'si

**Response:**
```json
[
  {
    "id": "training-data-id",
    "aiModelId": "model-id",
    "userId": "user-id",
    "inputMessage": "İş arıyorum",
    "responseMessage": "Hangi alanda çalışmak istiyorsunuz? Size uygun iş ilanlarını gösterebilirim.",
    "rating": 4,
    "context": {
      "userType": "worker",
      "jobContext": {
        "hasJobs": false,
        "jobCategories": [],
        "jobTitles": []
      }
    }
  }
]
```

## AI Puanlama Sistemi

### Puanlama Kriterleri

1. **Mesaj Aktivitesi** (0-20 puan)
   - 20+ mesaj: +10 puan
   - 50+ mesaj: +10 puan

2. **Yanıt Süresi** (0-25 puan)
   - 5 dakikadan az: +15 puan
   - 2 dakikadan az: +10 puan

3. **İletişim Tarzı** (0-10 puan)
   - Formal: +10 puan
   - Casual: +5 puan

4. **İş Aktivitesi** (0-20 puan)
   - İş ilanı varsa: +10 puan
   - 5+ iş ilanı: +10 puan

5. **Kayıt Süresi** (0-20 puan)
   - 30+ gün: +10 puan
   - 90+ gün: +10 puan

### AI Puanı Aralıkları

- **Yüksek (80-100)**: Çok aktif ve güvenilir kullanıcı
- **Orta (50-80)**: Aktif kullanıcı
- **Düşük (0-50)**: Az aktif kullanıcı

## Kullanıcı Analizi Özellikleri

### Mesaj Analizi
- Toplam mesaj sayısı
- Gönderilen/alınan mesaj oranı
- Ortalama yanıt süresi
- Sık kullanılan kelimeler
- İletişim tarzı (Formal/Casual/Neutral)
- Aktif saatler

### İş Analizi
- Toplam iş ilanı sayısı
- İş kategorileri
- Ortalama maaş
- Tercih edilen lokasyonlar

### Kullanıcı Profili
- Kullanıcı tipi (İşveren/İşçi)
- Kayıt tarihi
- Son aktif zaman
- Konum bilgisi
- Kategori tercihleri

## Otomatik Mesajlaşma Özellikleri

### Karşılama Mesajları
- Kullanıcı adına göre kişiselleştirme
- Konum bilgisi entegrasyonu
- Kullanıcı tipine göre farklı içerik
- Emoji ve görsel öğeler

### İş Detayları Mesajları
- İşveren bilgileri
- Konum ve kategori
- Maaş bilgisi
- İletişim bilgileri
- Çalışma süresi

## Örnek Kullanım

### 1. Karşılama Mesajı Oluşturma
```bash
curl -X POST http://localhost:3000/ai/welcome-message/user-id \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userType": "employer"
  }'
```

### 2. Kullanıcı Analizi
```bash
curl -X GET http://localhost:3000/ai/user-analysis/user-id \
  -H "Authorization: Bearer <token>"
```

### 3. Tüm Kullanıcılar Analizi
```bash
curl -X GET http://localhost:3000/ai/user-analysis \
  -H "Authorization: Bearer <token>"
```

### 4. Kullanıcı Tipine Göre Eğitim
```bash
curl -X POST http://localhost:3000/ai/models/model-id/user-type-training/user-id \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userType": "employer"
  }'
```

## Test Sayfaları

### Admin AI Analiz Paneli
```
http://localhost:3000/admin-ai-analysis.html
```

### Otomatik Eğitim Testi
```
http://localhost:3000/test-ai-auto-training.html
```

## Özellikler

### ✅ Otomatik Mesajlaşma
- Kullanıcı tipine göre karşılama mesajları
- İş detayları için bilgilendirme mesajları
- Kişiselleştirilmiş içerik
- Emoji ve görsel öğeler

### ✅ Kullanıcı Analizi
- Detaylı mesaj analizi
- İş aktivitesi analizi
- AI puanlama sistemi
- Öneriler ve tavsiyeler

### ✅ Akıllı Filtreleme
- Kaliteli mesajları otomatik seçer
- Spam ve gereksiz mesajları eler
- Mesaj uzunluğu kontrolü

### ✅ Profil Bazlı Eğitim
- İşveren/İşçi ayrımı
- Kullanıcı tipine özel eğitim verisi
- İş kategorilerine göre özelleştirme

### ✅ Otomatik Rating
- Mesaj kalitesine göre rating
- Çoklu kriter değerlendirmesi
- Dinamik rating hesaplama

### ✅ Bağlam Analizi
- İş kategorileri analizi
- Kullanıcı geçmişi değerlendirmesi
- Zaman damgası takibi

## Hata Kodları

- `400`: Geçersiz model ID veya kullanıcı ID
- `401`: Yetkilendirme hatası
- `404`: Model, kullanıcı veya iş bulunamadı
- `500`: Eğitim verisi oluşturma hatası

## Performans Notları

- **Kullanıcı Bazlı Eğitim**: 1-5 dakika
- **Tüm Kullanıcılar**: 10-30 dakika (kullanıcı sayısına göre)
- **Eğitim Verisi Oluşturma**: 1-3 dakika
- **Model Eğitimi**: 30 saniye - 2 dakika
- **Kullanıcı Analizi**: 1-3 dakika
- **Otomatik Mesaj Oluşturma**: 1-5 saniye

## Güvenlik

- Tüm endpoint'ler JWT token gerektirir
- Kullanıcı sadece kendi verilerine erişebilir
- Admin kullanıcılar tüm kullanıcılar için eğitim yapabilir
- Kullanıcı analizleri sadece admin tarafından görüntülenebilir 