# 📸 Profil Fotoğrafı Yükleme - Kullanım Kılavuzu

## ✅ Düzeltilen Sorun

**Önceki Durum:** ❌  
`PUT /users/profile-image` endpoint'i sadece `imageUrl` string alıyordu, gerçek dosya upload'ı yapmıyordu.

**Yeni Durum:** ✅  
Endpoint artık `multipart/form-data` ile gerçek dosya upload'ı yapıyor.

---

## 📡 API Endpoint

### **PUT** `/users/profile-image`

**Authentication:** JWT Bearer Token gerekli  
**Content-Type:** `multipart/form-data`

**Form Data:**
```
file: [binary file] (max 5MB)
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

**Response:**
```json
{
  "id": "user-uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "profileImage": "/uploads/profile-1234567890-123456789.jpg",
  "userType": "worker",
  "status": "active"
}
```

---

## 🔧 Backend İşleyişi

### 1. **Eski Fotoğrafı Sil**
```typescript
// Eski profil fotoğrafı varsa ve default değilse sil
if (user.profileImage && !user.profileImage.includes('default')) {
  await this.uploadService.deleteFile(oldFilename);
}
```

### 2. **Yeni Dosyayı Kaydet**
```typescript
// Benzersiz dosya adı oluştur
const filename = `profile-${Date.now()}-${Math.random()}.jpg`;

// uploads/ klasörüne kaydet
fs.writeFileSync(filepath, file.buffer);
```

### 3. **Database'e URL Kaydet**
```typescript
// URL oluştur ve kullanıcı kaydına ekle
const imageUrl = `/uploads/${filename}`;
user.profileImage = imageUrl;
await this.userRepository.save(user);
```

---

## 💻 Frontend Kullanım Örnekleri

### React Native (Expo)

#### 1. **Image Picker ile Seçim**
```javascript
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const uploadProfileImage = async () => {
  // İzin kontrolü
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Galeri erişim izni gerekli!');
    return;
  }

  // Resim seç
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1], // Kare profil fotoğrafı
    quality: 0.8,
  });

  if (!result.canceled) {
    await uploadImage(result.assets[0].uri);
  }
};
```

#### 2. **Camera ile Çekim**
```javascript
const takeProfilePhoto = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    alert('Kamera izni gerekli!');
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    await uploadImage(result.assets[0].uri);
  }
};
```

#### 3. **Upload İşlemi**
```javascript
const uploadImage = async (imageUri) => {
  const formData = new FormData();
  
  // Dosya ekle
  formData.append('file', {
    uri: imageUri,
    name: 'profile.jpg',
    type: 'image/jpeg',
  });

  try {
    const response = await axios.put(
      'http://localhost:3000/users/profile-image',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        // Upload progress
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload: ${percentCompleted}%`);
        },
      }
    );

    console.log('✅ Profil fotoğrafı yüklendi:', response.data.profileImage);
    return response.data;
  } catch (error) {
    console.error('❌ Upload hatası:', error.response?.data);
    throw error;
  }
};
```

#### 4. **Component Örneği**
```javascript
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';

const ProfileImageUploader = ({ currentImage, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUri, setImageUri] = useState(currentImage);

  const handleUpload = async () => {
    setUploading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const response = await uploadImage(result.assets[0].uri);
        setImageUri(response.profileImage);
        onUploadComplete?.(response.profileImage);
      }
    } catch (error) {
      alert('Fotoğraf yüklenirken hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity onPress={handleUpload} disabled={uploading}>
        <Image
          source={{ 
            uri: imageUri 
              ? `http://localhost:3000${imageUri}` 
              : 'https://via.placeholder.com/150' 
          }}
          style={{ 
            width: 150, 
            height: 150, 
            borderRadius: 75,
            borderWidth: 3,
            borderColor: '#ddd',
          }}
        />
        {uploading && (
          <View style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 75,
          }}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </TouchableOpacity>
      <Text style={{ marginTop: 10, color: '#666' }}>
        {uploading ? 'Yükleniyor...' : 'Fotoğrafı Değiştir'}
      </Text>
    </View>
  );
};
```

---

### React (Web)

```javascript
const ProfileImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview göster
    setPreview(URL.createObjectURL(file));

    // Upload
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/users/profile-image', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('✅ Upload başarılı:', data);
    } catch (error) {
      console.error('❌ Upload hatası:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      <div onClick={() => fileInputRef.current?.click()}>
        <img 
          src={preview || 'https://via.placeholder.com/150'} 
          alt="Profile"
          style={{ 
            width: 150, 
            height: 150, 
            borderRadius: '50%',
            cursor: 'pointer',
            objectFit: 'cover'
          }}
        />
        {uploading && <div>Yükleniyor...</div>}
      </div>
    </div>
  );
};
```

---

## 🧪 Test (cURL)

```bash
# 1. Kullanıcı girişi yap ve token al
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.accessToken')

# 2. Profil fotoğrafı yükle
curl -X PUT http://localhost:3000/users/profile-image \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.jpg"
```

---

## 🔍 Swagger'da Test

1. Swagger UI'a git: `http://localhost:3000/api`
2. "Authorize" butonuna tıkla
3. JWT token'ı yapıştır
4. `PUT /users/profile-image` endpoint'ini bul
5. "Try it out" butonuna tıkla
6. Dosya seç
7. "Execute" butonuna tıkla

---

## ⚠️ Önemli Notlar

### Validasyon
- ✅ Sadece image dosyaları kabul edilir (`image/*`)
- ✅ Max dosya boyutu: 5MB
- ✅ Desteklenen formatlar: JPG, PNG, GIF, WebP

### Güvenlik
- ✅ JWT authentication zorunlu
- ✅ Sadece kendi profil fotoğrafını güncelleyebilir
- ✅ Eski fotoğraf otomatik siliniyor (disk temizliği)

### Dosya İsimlendirme
```
profile-{timestamp}-{random}.{extension}
Örnek: profile-1704614400-123456789.jpg
```

### Storage
```
backend/
└── uploads/
    ├── profile-1704614400-123456789.jpg
    ├── profile-1704614401-987654321.png
    └── ...
```

---

## 🐛 Hata Mesajları

| HTTP Code | Mesaj | Açıklama |
|-----------|-------|----------|
| 400 | Profil fotoğrafı yüklenmedi | Dosya gönderilmemiş |
| 400 | Dosya bulunamadı | File objesi boş |
| 401 | Unauthorized | Token geçersiz veya yok |
| 413 | Payload too large | Dosya 5MB'dan büyük |
| 415 | Unsupported Media Type | Dosya formatı geçersiz |

---

## 📊 Diğer Profil Endpoint'leri

### **PUT** `/users/profile` (Genel Profil Güncelleme)
Profil fotoğrafı + diğer bilgileri birlikte günceller

```javascript
const formData = new FormData();
formData.append('firstName', 'John');
formData.append('lastName', 'Doe');
formData.append('bio', 'Deneyimli temizlikçi');
formData.append('file', imageFile); // Opsiyonel

await axios.put('/users/profile', formData);
```

### **GET** `/users/profile-image/:userId`
Kullanıcının profil fotoğrafı URL'ini getir

```javascript
const response = await axios.get(`/users/profile-image/${userId}`);
console.log(response.data.profileImage);
```

---

## ✅ Değişiklik Özeti

### Controller (`users.controller.ts`)
```diff
- @Body() body: { imageUrl: string }
+ @UploadedFile() file: Express.Multer.File
+ @ApiConsumes('multipart/form-data')
+ @UseInterceptors(FileInterceptor('file'))
```

### Service (`users.service.ts`)
```diff
+ async updateProfileWithFile(userId: string, file: Express.Multer.File)
  - Eski fotoğrafı sil
  - Yeni dosyayı kaydet
  - URL oluştur ve database'e kaydet
```

---

**Durum:** ✅ Çalışır Durumda  
**Test Edildi:** Backend başarıyla çalışıyor  
**Swagger:** Dokümantasyon güncel

