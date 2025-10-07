# 👷 Worker Kategori Filtreleme - İş Mantığı

## 📋 Düzeltilen Sorun

**Önceki Durum:** ❌  
Worker kullanıcısının kategorisi yoksa **TÜM** işler gösteriliyordu.

**Yeni Durum:** ✅  
Worker kullanıcısının kategorisi yoksa **HİÇ** iş gösterilmiyor.

---

## 🎯 İş Mantığı

### Worker Kullanıcısı İçin Kurallar

#### 1. **Kategorisi VAR** ✅
```typescript
// Worker'ın kategorileri: ['Temizlik', 'Bahçıvan']
// Sonuç: Sadece bu kategorilerdeki işler gösterilir
```

**Örnek:**
```json
{
  "userId": "worker-uuid",
  "userType": "worker",
  "categoryIds": ["category-uuid-1", "category-uuid-2"]
}

// GET /jobs → Sadece category-uuid-1 ve category-uuid-2'deki işler
```

#### 2. **Kategorisi YOK** ❌
```typescript
// Worker'ın kategorileri: [] veya null
// Sonuç: BOŞ ARRAY döner
```

**Örnek:**
```json
{
  "userId": "worker-uuid",
  "userType": "worker",
  "categoryIds": []  // veya null
}

// GET /jobs → []  (Boş array döner)
```

#### 3. **Employer Kullanıcısı** ✅
```typescript
// Employer'lar için kategori filtresi YOK
// Sonuç: TÜM işler gösterilir
```

**Örnek:**
```json
{
  "userId": "employer-uuid",
  "userType": "employer"
}

// GET /jobs → Tüm açık işler
```

#### 4. **Giriş Yapmamış (Guest)** ✅
```typescript
// Token yoksa
// Sonuç: TÜM işler gösterilir (public)
```

---

## 🔧 Teknik Implementasyon

### Code
```typescript
// Worker kullanıcıları için kategori filtreleme
if (user?.userType === 'worker') {
  if (user.categoryIds && user.categoryIds.length > 0) {
    // Kategorileri olan worker'lar: sadece kendi kategorilerindeki işler
    query.andWhere('job.categoryId IN (:...categoryIds)', { 
      categoryIds: user.categoryIds 
    });
  } else {
    // Kategorisi olmayan worker'lar: hiç iş gösterme
    query.andWhere('1 = 0');  // SQL trick: Her zaman false
  }
}
```

### SQL Açıklaması
```sql
-- Kategorisi olan worker için
WHERE job.categoryId IN ('uuid-1', 'uuid-2')

-- Kategorisi olmayan worker için
WHERE 1 = 0  -- Bu sorgu her zaman boş sonuç döner
```

---

## 📊 Test Senaryoları

### Senaryo 1: Worker + Kategori VAR
```bash
# Login ol (Worker olarak)
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"worker@example.com","password":"password123"}')

# İşleri getir
curl -X GET http://localhost:3000/jobs \
  -H "Authorization: Bearer $TOKEN"

# Beklenen: Sadece worker'ın kategorilerindeki işler
```

### Senaryo 2: Worker + Kategori YOK
```bash
# Worker'ın kategorisi olmayan kullanıcı
# İşleri getir
curl -X GET http://localhost:3000/jobs \
  -H "Authorization: Bearer $TOKEN"

# Beklenen: []  (Boş array)
```

### Senaryo 3: Employer
```bash
# Login ol (Employer olarak)
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"employer@example.com","password":"password123"}')

# İşleri getir
curl -X GET http://localhost:3000/jobs \
  -H "Authorization: Bearer $TOKEN"

# Beklenen: Tüm açık işler (kategori filtresi yok)
```

### Senaryo 4: Guest (Token yok)
```bash
# Token olmadan
curl -X GET http://localhost:3000/jobs

# Beklenen: Tüm açık işler (public görünüm)
```

---

## 💡 Kullanıcı Deneyimi

### Frontend'de Gösterim

#### Worker'ın Kategorisi Yoksa
```javascript
// React Native
const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchJobs();
  }, []);
  
  const fetchJobs = async () => {
    const response = await axios.get('/jobs', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setJobs(response.data);
  };
  
  if (user?.userType === 'worker' && (!user.categoryIds || user.categoryIds.length === 0)) {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          📋 Kategori Seçmelisiniz
        </Text>
        <Text style={{ color: '#666', textAlign: 'center' }}>
          İş ilanlarını görebilmek için önce çalışmak istediğiniz kategorileri seçmelisiniz.
        </Text>
        <Button 
          title="Kategori Seç" 
          onPress={() => navigation.navigate('CategorySelection')}
        />
      </View>
    );
  }
  
  return (
    <FlatList
      data={jobs}
      renderItem={({ item }) => <JobCard job={item} />}
      ListEmptyComponent={() => (
        <Text>Şu anda iş ilanı bulunmuyor</Text>
      )}
    />
  );
};
```

---

## 🔍 Debug Log Çıktıları

### Worker + Kategori VAR
```
👷 Worker kullanıcısı için kategori filtreleme yapılıyor...
📋 Kullanıcının kategorileri: ['uuid-1', 'uuid-2']
🔍 Kategori filtresi eklendi. Aranan kategoriler: ['uuid-1', 'uuid-2']
📊 Sorgu sonucu: 5 iş ilanı bulundu
```

### Worker + Kategori YOK
```
👷 Worker kullanıcısı için kategori filtreleme yapılıyor...
📋 Kullanıcının kategorileri: []
⚠️ Worker kullanıcısının seçili kategorisi yok, hiç iş gösterilmeyecek
📊 Sorgu sonucu: 0 iş ilanı bulundu
```

### Employer
```
// Kategori kontrolü yapılmıyor
📊 Sorgu sonucu: 25 iş ilanı bulundu
```

---

## 🎯 İş Akışı

### Worker Kayıt Süreci
```
1. Kayıt ol → /auth/register
2. Profil oluştur
3. ⚠️ KATEGORİ SEÇ (ZORUNLU)
4. İşleri görüntüle → /jobs
```

### Kategori Seçim API
```bash
# Worker kategorilerini güncelle
POST /users/:id/categories
{
  "categoryIds": ["uuid-1", "uuid-2"]
}
```

---

## ⚠️ Önemli Notlar

### Neden Bu Mantık?

**1. Kullanıcı Deneyimi:**
- Worker'lar sadece ilgilendikleri kategorilerdeki işleri görmeli
- İlgilenmedikleri alanlardaki işler spam gibi görünür

**2. Platform Kalitesi:**
- Alakasız işlere başvuru engellenir
- Employer'lar doğru adaylarla eşleşir

**3. Veri Güvenliği:**
- Worker'lar sadece kendi alanlarındaki işlere erişebilir

### Frontend Validation

```javascript
// Worker kayıt ekranında kategori zorunlu olmalı
const RegisterWorker = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const handleRegister = () => {
    if (selectedCategories.length === 0) {
      alert('En az bir kategori seçmelisiniz!');
      return;
    }
    // Kayıt işlemi devam eder
  };
};
```

---

## 🔄 Kategori Güncelleme

Worker istediği zaman kategorilerini güncelleyebilir:

```javascript
const updateCategories = async (categoryIds) => {
  await axios.post(`/users/${userId}/categories`, {
    categoryIds: categoryIds
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  // Artık yeni kategorilerdeki işleri görebilir
};
```

---

**Değişiklik:** ✅ Uygulandı  
**Etki:** Worker'lar kategorisi olmadan iş göremez  
**Önerilen:** Frontend'de kategori seçimi zorunlu yapılmalı

