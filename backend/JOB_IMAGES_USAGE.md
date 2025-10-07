# İş İlanı Resimleri - Kullanım Kılavuzu

## 🎯 Genel Bakış

Jobs modülüne multiple image upload özelliği eklendi. Artık iş ilanları oluşturulurken veya sonradan birden fazla resim yüklenebilir.

## 📋 Özellikler

- ✅ İş ilanı oluştururken resim yükleme (max 5 adet)
- ✅ Var olan işe sonradan resim ekleme
- ✅ İş ilanından resim silme
- ✅ Maksimum 10 resim limiti (iş başına)
- ✅ Her resim için max 5MB boyut limiti
- ✅ Sadece image formatları (jpg, jpeg, png, gif, webp)

## 🔧 Database Değişiklikleri

### Job Entity
```typescript
// Eski
jobImage: string

// Yeni
jobImages: string[]  // Array of image URLs
```

## 📡 API Endpoints

### 1. İş İlanı Oluştur (Resimlerle)
**POST** `/jobs`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

**Form Data:**
```
title: "Ev Temizliği"
description: "3+1 ev temizliği gerekiyor"
budget: "500 TL"
categoryId: "category-uuid"
userInfoId: "userinfo-uuid"
images[]: file1.jpg  (max 5 adet)
images[]: file2.jpg
images[]: file3.jpg
```

**Response:**
```json
{
  "id": "job-uuid",
  "title": "Ev Temizliği",
  "description": "3+1 ev temizliği gerekiyor",
  "jobImages": [
    "/uploads/job-images/job-1234567890-123456789.jpg",
    "/uploads/job-images/job-1234567890-987654321.jpg",
    "/uploads/job-images/job-1234567890-555555555.jpg"
  ],
  "employerId": "user-uuid",
  "createdAt": "2025-01-08T12:00:00.000Z"
}
```

### 2. İş İlanına Resim Ekle
**POST** `/jobs/:id/images`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

**Form Data:**
```
images[]: new-file1.jpg  (max 5 adet)
images[]: new-file2.jpg
```

**Notlar:**
- Sadece iş sahibi (employer) resim ekleyebilir
- Toplam resim sayısı 10'u geçemez
- Mevcut + yeni resim sayısı kontrolü yapılır

**Response:**
```json
{
  "id": "job-uuid",
  "jobImages": [
    "/uploads/job-images/job-1234567890-123456789.jpg",
    "/uploads/job-images/job-1234567890-987654321.jpg",
    "/uploads/job-images/job-1234567890-555555555.jpg",
    "/uploads/job-images/job-1234567890-111111111.jpg",
    "/uploads/job-images/job-1234567890-222222222.jpg"
  ]
}
```

### 3. İş İlanından Resim Sil
**DELETE** `/jobs/:id/images/:filename`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**URL Parameters:**
- `id`: İş ilanı UUID
- `filename`: Sadece dosya adı (örn: job-1234567890-123456789.jpg)

**Notlar:**
- Sadece iş sahibi resim silebilir
- Dosya hem veritabanından hem de diskten silinir

**Response:**
```json
{
  "id": "job-uuid",
  "jobImages": [
    "/uploads/job-images/job-1234567890-987654321.jpg",
    "/uploads/job-images/job-1234567890-555555555.jpg"
  ]
}
```

## 📁 Dosya Yapısı

```
backend/
├── uploads/
│   ├── job-images/           # İş ilanı resimleri (YENİ)
│   │   ├── job-1234567890-123456789.jpg
│   │   ├── job-1234567890-987654321.jpg
│   │   └── ...
│   ├── verifications/        # Doğrulama belgeleri
│   └── profile-*.jpg         # Profil resimleri
```

## 🔐 Güvenlik

### Yetkilendirme
- **İş Oluştur:** Sadece `employer` user type'ı
- **Resim Ekle:** Sadece iş sahibi (employerId kontrolü)
- **Resim Sil:** Sadece iş sahibi (employerId kontrolü)

### Validasyon
- Dosya formatı: Sadece image/* (jpg, jpeg, png, gif, webp)
- Dosya boyutu: Max 5MB per file
- Resim limiti: Max 10 resim per job
- Max upload: 5 resim per request

## 💻 Frontend Kullanım Örnekleri

### React Native (Axios)

#### 1. İş İlanı Oluştururken Resim Yükleme
```javascript
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const createJobWithImages = async () => {
  // Resimleri seç
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 0.8,
    selectionLimit: 5,
  });

  if (!result.canceled) {
    const formData = new FormData();
    
    // İş bilgileri
    formData.append('title', 'Ev Temizliği');
    formData.append('description', '3+1 ev temizliği gerekiyor');
    formData.append('budget', '500 TL');
    formData.append('categoryId', categoryId);
    formData.append('userInfoId', userInfoId);
    
    // Resimleri ekle
    result.assets.forEach((asset, index) => {
      formData.append('images', {
        uri: asset.uri,
        name: `job-image-${index}.jpg`,
        type: 'image/jpeg',
      });
    });

    try {
      const response = await axios.post(
        'http://localhost:3000/jobs',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('İş oluşturuldu:', response.data);
      console.log('Yüklenen resimler:', response.data.jobImages);
    } catch (error) {
      console.error('Hata:', error.response?.data);
    }
  }
};
```

#### 2. Var Olan İşe Resim Ekleme
```javascript
const addImagesToJob = async (jobId) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 0.8,
    selectionLimit: 5,
  });

  if (!result.canceled) {
    const formData = new FormData();
    
    result.assets.forEach((asset, index) => {
      formData.append('images', {
        uri: asset.uri,
        name: `job-image-${index}.jpg`,
        type: 'image/jpeg',
      });
    });

    try {
      const response = await axios.post(
        `http://localhost:3000/jobs/${jobId}/images`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('Resimler eklendi:', response.data.jobImages);
    } catch (error) {
      console.error('Hata:', error.response?.data);
    }
  }
};
```

#### 3. Resim Silme
```javascript
const deleteJobImage = async (jobId, imageUrl) => {
  // URL'den filename'i çıkar
  const filename = imageUrl.split('/').pop();
  
  try {
    const response = await axios.delete(
      `http://localhost:3000/jobs/${jobId}/images/${filename}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    console.log('Resim silindi. Kalan resimler:', response.data.jobImages);
  } catch (error) {
    console.error('Hata:', error.response?.data);
  }
};
```

#### 4. Resimleri Gösterme
```javascript
import { Image, FlatList } from 'react-native';

const JobImages = ({ job }) => {
  return (
    <FlatList
      data={job.jobImages || []}
      horizontal
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Image
          source={{ uri: `http://localhost:3000${item}` }}
          style={{ width: 200, height: 200, marginRight: 10 }}
          resizeMode="cover"
        />
      )}
    />
  );
};
```

## 🧪 Test

### cURL Örnekleri

#### İş İlanı Oluştur (Resimlerle)
```bash
curl -X POST http://localhost:3000/jobs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Ev Temizliği" \
  -F "description=3+1 ev temizliği gerekiyor" \
  -F "budget=500 TL" \
  -F "categoryId=category-uuid" \
  -F "userInfoId=userinfo-uuid" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "images=@/path/to/image3.jpg"
```

#### Resim Ekle
```bash
curl -X POST http://localhost:3000/jobs/job-uuid/images \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "images=@/path/to/new-image1.jpg" \
  -F "images=@/path/to/new-image2.jpg"
```

#### Resim Sil
```bash
curl -X DELETE http://localhost:3000/jobs/job-uuid/images/job-1234567890-123456789.jpg \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🐛 Hata Mesajları

| HTTP Code | Mesaj | Açıklama |
|-----------|-------|----------|
| 400 | En az bir resim yüklemelisiniz | POST images endpoint'e resim gönderilmemiş |
| 400 | Maksimum 10 resim yükleyebilirsiniz | Job başına max resim limitine ulaşılmış |
| 400 | Sadece resim dosyaları yüklenebilir | Yanlış dosya formatı |
| 403 | Bu işe resim ekleme yetkiniz yok | Farklı bir employer'ın işine resim eklenmeye çalışılıyor |
| 403 | Bu işin resmini silme yetkiniz yok | Farklı bir employer'ın işinden resim silinmeye çalışılıyor |
| 404 | İş ilanı bulunamadı | Geçersiz job ID |
| 404 | İş ilanında resim bulunamadı | Job'un hiç resmi yok |
| 404 | Resim bulunamadı | Belirtilen filename job'da yok |
| 413 | Dosya çok büyük | 5MB limit aşımı |

## 📊 Swagger Dokümantasyonu

Tüm endpoint'ler Swagger UI'da mevcut:
```
http://localhost:3000/api
```

- **Jobs** tag'i altında bulabilirsiniz
- Swagger UI üzerinden test edebilirsiniz
- "Try it out" butonunu kullanarak dosya yükleyebilirsiniz

## ✅ Yapılanlar

1. ✅ Job entity'de `jobImage` → `jobImages` (array)
2. ✅ UploadService'e job images için özel config
3. ✅ CreateJobDto validasyonu
4. ✅ JobsController'da multipart/form-data desteği
5. ✅ JobsService'de image upload/delete mantığı
6. ✅ Yeni endpoint'ler (create, add, delete)
7. ✅ Maksimum limit kontrolleri
8. ✅ Yetkilendirme kontrolleri
9. ✅ Static file serving (/uploads/job-images)
10. ✅ Error handling

## 📝 Migration Notları

Eğer mevcut database'de `jobImage` column'u varsa:

```sql
-- PostgreSQL
ALTER TABLE jobs 
  DROP COLUMN "jobImage",
  ADD COLUMN "jobImages" text[];

-- Veya TypeORM synchronize: true kullanıyorsanız otomatik yapılacaktır
```

## 🚀 Deployment Notları

1. **Uploads Klasörü:** `uploads/job-images` klasörünün write permission'u olmalı
2. **Static Files:** Express static middleware doğru ayarlanmalı
3. **CORS:** Frontend domain'i CORS ayarlarına eklenmiş olmalı
4. **Max File Size:** Nginx/Apache'de upload limit ayarları kontrol edilmeli

## 💡 İpuçları

1. **Performans:** Büyük resimleri yüklemeden önce frontend'de compress edin
2. **UX:** Upload progress bar gösterin
3. **Validasyon:** Frontend'de de file type ve size kontrolü yapın
4. **Preview:** Yüklemeden önce resim preview gösterin
5. **Thumbnails:** Gelecekte thumbnail generation eklenebilir

## 📞 Destek

Sorunuz veya öneriniz varsa issue açabilirsiniz.

