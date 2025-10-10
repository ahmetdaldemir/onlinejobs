# 📸 Worker Portföy Resimleri Kullanım Kılavuzu

Bu kılavuz, worker (iş arayan) kullanıcıların portföy resimlerini nasıl yöneteceklerini açıklar.

## 🎯 Özellik Özeti

Worker kullanıcılar, yaptıkları işlerin fotoğraflarını portföy olarak yükleyebilir. Bu sayede potansiyel işverenler, worker'ın geçmiş işlerini görebilir.

### Kısıtlamalar
- ✅ Sadece **worker** kullanıcılar portföy resmi ekleyebilir
- ✅ Maksimum **10 resim** yüklenebilir
- ✅ Maksimum dosya boyutu: **5MB**
- ✅ Desteklenen formatlar: **JPG, PNG, JPEG, GIF, WEBP**

---

## 📋 API Endpoint'leri

### 1. Portföy Resmi Ekle

**POST** `/users/portfolio/images`

**Authorization:** Bearer Token (JWT)

**Content-Type:** `multipart/form-data`

**Request Body:**
```
file: (binary) - Resim dosyası
```

**Response (201):**
```json
{
  "message": "Portföy resmi başarıyla eklendi",
  "portfolioImages": [
    "/uploads/portfolio-images/portfolio-1234567890-123456789.jpg",
    "/uploads/portfolio-images/portfolio-1234567891-987654321.jpg"
  ],
  "totalImages": 2
}
```

**Hata Durumları:**
- `400` - Resim dosyası yüklenmedi
- `400` - Sadece worker kullanıcılar portföy resmi ekleyebilir
- `400` - Maksimum 10 portföy resmi eklenebilir
- `401` - Unauthorized (Token geçersiz)

---

### 2. Kendi Portföy Resimlerini Getir

**GET** `/users/portfolio/images`

**Authorization:** Bearer Token (JWT)

**Response (200):**
```json
{
  "portfolioImages": [
    "/uploads/portfolio-images/portfolio-1234567890-123456789.jpg",
    "/uploads/portfolio-images/portfolio-1234567891-987654321.jpg"
  ],
  "totalImages": 2
}
```

---

### 3. Başka Bir Kullanıcının Portföy Resimlerini Getir (Public)

**GET** `/users/portfolio/images/:userId`

**Authorization:** Gerekli değil (Public endpoint)

**URL Parameters:**
- `userId` (UUID) - Kullanıcı ID'si

**Response (200):**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "portfolioImages": [
    "/uploads/portfolio-images/portfolio-1234567890-123456789.jpg"
  ],
  "totalImages": 1
}
```

---

### 4. Portföy Resmini Sil

**POST** `/users/portfolio/images/delete`

**Authorization:** Bearer Token (JWT)

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "imageUrl": "/uploads/portfolio-images/portfolio-1234567890-123456789.jpg"
}
```

**Response (200):**
```json
{
  "message": "Portföy resmi başarıyla silindi",
  "portfolioImages": [
    "/uploads/portfolio-images/portfolio-1234567891-987654321.jpg"
  ],
  "totalImages": 1
}
```

**Hata Durumları:**
- `400` - Resim URL'si gerekli
- `400` - Sadece worker kullanıcılar portföy resmi silebilir
- `400` - Bu resim kullanıcıya ait değil
- `401` - Unauthorized

---

### 5. Tüm Portföy Resimlerini Sil

**POST** `/users/portfolio/images/delete-all`

**Authorization:** Bearer Token (JWT)

**Response (200):**
```json
{
  "message": "Tüm portföy resimleri başarıyla silindi",
  "portfolioImages": [],
  "totalImages": 0
}
```

---

### 6. Portföy Resmini Görüntüle

**GET** `/upload/portfolio-images/:filename`

**Authorization:** Gerekli değil (Public endpoint)

**URL Parameters:**
- `filename` (string) - Resim dosya adı

**Response:** Resim dosyası (binary)

---

## 🧪 Kullanım Örnekleri

### cURL ile Portföy Resmi Ekleme

```bash
curl -X POST http://localhost:3000/users/portfolio/images \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/image.jpg"
```

### JavaScript (Fetch API) ile Portföy Resmi Ekleme

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:3000/users/portfolio/images', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const result = await response.json();
console.log(result);
```

### JavaScript ile Portföy Resimlerini Getirme

```javascript
const response = await fetch('http://localhost:3000/users/portfolio/images', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { portfolioImages, totalImages } = await response.json();
console.log(`Toplam ${totalImages} portföy resmi var`);
```

### JavaScript ile Portföy Resmi Silme

```javascript
const response = await fetch('http://localhost:3000/users/portfolio/images/delete', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    imageUrl: '/uploads/portfolio-images/portfolio-1234567890-123456789.jpg'
  })
});

const result = await response.json();
console.log(result.message);
```

---

## 📱 React Native Kullanım Örneği

```javascript
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// Resim seç ve yükle
const pickAndUploadImage = async () => {
  // Galeriden resim seç
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    
    // FormData oluştur
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'portfolio.jpg',
      type: 'image/jpeg',
    });

    // API'ye gönder
    try {
      const response = await fetch('http://localhost:3000/users/portfolio/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Portföy resmi eklendi:', data);
      Alert.alert('Başarılı', 'Portföy resmi eklendi');
    } catch (error) {
      console.error('Hata:', error);
      Alert.alert('Hata', 'Resim yüklenirken hata oluştu');
    }
  }
};

// Portföy resimlerini göster
const Portfolio = ({ userId }) => {
  const [portfolioImages, setPortfolioImages] = useState([]);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/portfolio/images/${userId}`);
      const data = await response.json();
      setPortfolioImages(data.portfolioImages);
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  const deleteImage = async (imageUrl) => {
    try {
      const response = await fetch('http://localhost:3000/users/portfolio/images/delete', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();
      setPortfolioImages(data.portfolioImages);
      Alert.alert('Başarılı', 'Resim silindi');
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  return (
    <View>
      <ScrollView horizontal>
        {portfolioImages.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image 
              source={{ uri: `http://localhost:3000${image}` }} 
              style={styles.portfolioImage}
            />
            <TouchableOpacity 
              onPress={() => deleteImage(image)}
              style={styles.deleteButton}
            >
              <Text>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      
      {portfolioImages.length < 10 && (
        <Button title="Resim Ekle" onPress={pickAndUploadImage} />
      )}
    </View>
  );
};
```

---

## 🗄️ Veritabanı Yapısı

**User Entity** tablosuna eklenen alan:

```typescript
@Column('text', { array: true, nullable: true, default: [] })
@ApiProperty({ 
  type: [String], 
  description: 'Worker kullanıcılar için portföy resimleri (max 10 resim)',
  required: false 
})
portfolioImages: string[];
```

**Örnek veri:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "userType": "worker",
  "portfolioImages": [
    "/uploads/portfolio-images/portfolio-1234567890-123456789.jpg",
    "/uploads/portfolio-images/portfolio-1234567891-987654321.jpg",
    "/uploads/portfolio-images/portfolio-1234567892-456789123.jpg"
  ]
}
```

---

## 📁 Dosya Yönetimi

### Dosya Kayıt Yeri
```
backend/
  uploads/
    portfolio-images/
      portfolio-1234567890-123456789.jpg
      portfolio-1234567891-987654321.jpg
      ...
```

### Dosya Adlandırma
Format: `portfolio-{timestamp}-{random}.{extension}`

Örnek: `portfolio-1704470400000-123456789.jpg`

---

## ✅ Güvenlik Kontrolleri

1. ✅ **JWT Authentication**: Tüm yazma işlemleri için token gerekli
2. ✅ **User Type Check**: Sadece worker kullanıcılar ekleyebilir/silebilir
3. ✅ **Ownership Check**: Kullanıcı sadece kendi resimlerini silebilir
4. ✅ **File Type Validation**: Sadece resim dosyaları kabul edilir
5. ✅ **File Size Limit**: Maksimum 5MB
6. ✅ **Count Limit**: Maksimum 10 resim
7. ✅ **Path Traversal Protection**: Dosya adları güvenli şekilde oluşturulur

---

## 🚀 Test Etme

1. **Swagger UI** üzerinden test edin:
   - http://localhost:3000/api
   - "Users" bölümünden portfolio endpoint'lerini bulun

2. **Postman** ile test edin:
   - Collection'ı import edin
   - Token'ı "Authorization" header'ına ekleyin

3. **Test HTML sayfası** ile test edin:
   - http://localhost:3000/test-portfolio.html

---

## 📊 İstatistikler

### Eklenen Dosyalar
- ✅ `user.entity.ts` - portfolioImages alanı eklendi
- ✅ `users.service.ts` - 4 yeni metod eklendi
- ✅ `users.controller.ts` - 5 yeni endpoint eklendi
- ✅ `upload.service.ts` - Portfolio için yardımcı metodlar eklendi
- ✅ `upload.controller.ts` - Portfolio resim görüntüleme endpoint'i eklendi

### Yeni Endpoint'ler (5 adet)
1. `POST /users/portfolio/images` - Resim ekle
2. `GET /users/portfolio/images` - Kendi resimlerini getir
3. `GET /users/portfolio/images/:userId` - Başkasının resimlerini getir
4. `POST /users/portfolio/images/delete` - Resim sil
5. `POST /users/portfolio/images/delete-all` - Hepsini sil

---

## 📝 Notlar

- Portföy resimleri `User` entity'sinde string array olarak saklanır
- Fiziksel dosyalar `uploads/portfolio-images/` klasöründe saklanır
- Resimler kullanıcı silindiğinde otomatik olarak silinmez (manuel temizlik gerekebilir)
- Public endpoint'ler sayesinde worker profilleri herkese açık olarak görüntülenebilir

---

## 🔧 Sorun Giderme

### "Sadece worker kullanıcılar portföy resmi ekleyebilir" hatası
- Kullanıcının `userType` alanının `"worker"` olduğundan emin olun

### "Maksimum 10 portföy resmi eklenebilir" hatası
- Önce bazı resimleri silin veya hepsini silin

### Resimler görünmüyor
- Backend'in çalıştığından emin olun
- Resim URL'lerinin doğru olduğundan emin olun
- Tarayıcı konsolunda hata olup olmadığını kontrol edin

### Dosya yükleme çalışmıyor
- `Content-Type: multipart/form-data` header'ının kullanıldığından emin olun
- Dosya boyutunun 5MB'dan küçük olduğundan emin olun
- JWT token'ın geçerli olduğundan emin olun

---

**Geliştirme Tarihi:** {{ current_date }}  
**Versiyon:** 1.0.0  
**Durum:** ✅ Production Ready

