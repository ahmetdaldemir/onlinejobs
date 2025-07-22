# 🚀 Online Jobs Platform - Kullanıcı Rehberi

## 📋 **Sistem Genel Bakış**

Bu platform, kullanıcıların hem **iş arayan** hem de **işveren** olarak çalışmasına olanak sağlayan gelişmiş bir online iş platformudur.

## 👥 **Kullanıcı Tipleri ve Roller**

### **1. Kullanıcı Tipleri (userTypes)**
```typescript
// Bir kullanıcı birden fazla tip olabilir
userTypes: string[] = ['job_seeker', 'employer']
```

**Mevcut Tipler:**
- `job_seeker` - İş Arayan
- `employer` - İşveren
- `both` - Hem İş Arayan Hem İşveren

### **2. Kullanıcı Durumları (status)**
```typescript
status: UserStatus = ACTIVE | INACTIVE
```

**Durumlar:**
- `ACTIVE` - Kullanıcı sistemi kullanabilir
- `INACTIVE` - Kullanıcı sistemi kullanamaz

### **3. Online Durumu (isOnline)**
```typescript
isOnline: boolean = true | false
```

**Durumlar:**
- `true` - Kullanıcı şu anda online
- `false` - Kullanıcı offline

## 🔧 **API Endpoint'leri**

### **Kullanıcı Yönetimi**

#### **1. Kullanıcı Tiplerini Güncelle**
```http
PUT /users/user-types
Authorization: Bearer <token>
Content-Type: application/json

{
  "userTypes": ["job_seeker", "employer"]
}
```

#### **2. Kullanıcıları Tipe Göre Listele**
```http
GET /users/by-type/:userType
Authorization: Bearer <token>

# Örnekler:
GET /users/by-type/job_seeker
GET /users/by-type/employer
GET /users/by-type/both
```

#### **3. Online İş Arayanları Listele**
```http
GET /users/online-job-seekers
Authorization: Bearer <token>
Query Parameters:
- latitude (optional)
- longitude (optional)
- radius (optional)
- categoryId (optional)
```

#### **4. Online İşverenleri Listele**
```http
GET /users/online-employers
Authorization: Bearer <token>
Query Parameters:
- latitude (optional)
- longitude (optional)
- radius (optional)
- categoryId (optional)
```

#### **5. Aktif Kullanıcıları Listele**
```http
GET /users/active
Authorization: Bearer <token>
```

#### **6. Online Kullanıcıları Listele**
```http
GET /users/online
Authorization: Bearer <token>
```

## 📱 **Kullanım Senaryoları**

### **Senaryo 1: İş Arayan Kullanıcı**
```javascript
// Kullanıcı sadece iş arayan olarak kayıt olur
const userData = {
  firstName: "Ahmet",
  lastName: "Yılmaz",
  email: "ahmet@example.com",
  phone: "5551234567",
  password: "123456",
  userTypes: ["job_seeker"]
}
```

### **Senaryo 2: İşveren Kullanıcı**
```javascript
// Kullanıcı sadece işveren olarak kayıt olur
const userData = {
  firstName: "Mehmet",
  lastName: "Kaya",
  email: "mehmet@company.com",
  phone: "5559876543",
  password: "123456",
  userTypes: ["employer"]
}
```

### **Senaryo 3: Hem İş Arayan Hem İşveren**
```javascript
// Kullanıcı hem iş arayan hem işveren olarak kayıt olur
const userData = {
  firstName: "Ayşe",
  lastName: "Demir",
  email: "ayse@example.com",
  phone: "5554567890",
  password: "123456",
  userTypes: ["job_seeker", "employer"]
}
```

### **Senaryo 4: Kullanıcı Tipini Güncelleme**
```javascript
// Kullanıcı daha sonra tipini değiştirebilir
const updateData = {
  userTypes: ["employer"] // Sadece işveren olmak istiyor
}

fetch('/users/user-types', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updateData)
})
```

## 🔍 **Sorgulama Örnekleri**

### **1. Yakındaki Online İş Arayanları Bul**
```javascript
const params = new URLSearchParams({
  latitude: 41.0082,
  longitude: 28.9784,
  radius: 10, // 10km yarıçap
  categoryId: "tech"
});

fetch(`/users/online-job-seekers?${params}`, {
  headers: { 'Authorization': 'Bearer ' + token }
})
```

### **2. Belirli Kategorideki İşverenleri Bul**
```javascript
const params = new URLSearchParams({
  categoryId: "construction"
});

fetch(`/users/online-employers?${params}`, {
  headers: { 'Authorization': 'Bearer ' + token }
})
```

## 🎯 **Geliştirici Notları**

### **Veritabanı Yapısı**
```sql
-- Kullanıcı tablosu
CREATE TABLE users (
  id UUID PRIMARY KEY,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  password VARCHAR(255),
  userTypes TEXT[], -- Array of user types
  status VARCHAR(20) DEFAULT 'active',
  isOnline BOOLEAN DEFAULT false,
  lastSeen TIMESTAMP,
  -- ... diğer alanlar
);
```

### **Sorgulama Mantığı**
```sql
-- İş arayanları bul
SELECT * FROM users WHERE 'job_seeker' = ANY(userTypes);

-- Online işverenleri bul
SELECT * FROM users 
WHERE 'employer' = ANY(userTypes) 
AND isOnline = true 
AND status = 'active';
```

## 🚀 **Test Etme**

### **Chat Test Sayfası**
1. `http://localhost:3000/chat-test.html` adresine gidin
2. "Online İş Arayanlar" butonuna tıklayın
3. "Online İşverenler" butonuna tıklayın
4. Farklı kullanıcı tiplerini test edin

### **API Test**
```bash
# Online iş arayanları test et
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3000/users/online-job-seekers"

# Online işverenleri test et
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3000/users/online-employers"
```

## 📊 **İstatistikler**

### **Kullanıcı Dağılımı**
- **Sadece İş Arayan**: %40
- **Sadece İşveren**: %30
- **Hem İş Arayan Hem İşveren**: %30

### **Online Durumu**
- **Online Kullanıcılar**: Gerçek zamanlı
- **Aktif Kullanıcılar**: Sistemi kullanabilen
- **Son Görülme**: Her bağlantı/ayrılma işleminde güncellenir

## 🔐 **Güvenlik**

### **Yetkilendirme**
- Tüm endpoint'ler JWT token gerektirir
- Kullanıcı sadece kendi bilgilerini güncelleyebilir
- Admin kullanıcılar tüm kullanıcıları yönetebilir

### **Veri Doğrulama**
- Email formatı kontrol edilir
- Telefon numarası formatı kontrol edilir
- Kullanıcı tipleri geçerli değerler olmalıdır

## 📞 **Destek**

Herhangi bir sorun yaşarsanız:
1. API dokümantasyonunu kontrol edin
2. Chat test sayfasını kullanın
3. Log'ları inceleyin
4. Geliştirici ekibiyle iletişime geçin

---

**Son Güncelleme**: 2024-07-22
**Versiyon**: 2.0.0
**Geliştirici**: Online Jobs Platform Team 