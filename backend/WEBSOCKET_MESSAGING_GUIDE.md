# 💬 WebSocket Mesajlaşma Sistemi - Kapsamlı Kılavuz

## 🎯 Genel Bakış

**WebSocket URL:** `ws://localhost:3000` (Production: `wss://your-domain.com`)  
**Protocol:** Socket.IO  
**Transport:** WebSocket + Polling (fallback)  
**Authentication:** JWT Bearer Token

---

## 🔌 1. BAĞLANTI KURMA (Connection)

### React Native (socket.io-client)

#### Kurulum
```bash
npm install socket.io-client
```

#### Bağlantı Kodu
```javascript
import io from 'socket.io-client';

// JWT token'ı al (login'den dönen)
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// Socket bağlantısı kur
const socket = io('http://localhost:3000', {
  auth: {
    token: `Bearer ${token}`  // ⚠️ "Bearer " prefix ekle
  },
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

// Bağlantı event'leri
socket.on('connect', () => {
  console.log('✅ WebSocket bağlandı:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('❌ WebSocket bağlantısı kesildi:', reason);
});

socket.on('connect_error', (error) => {
  console.error('🔴 Bağlantı hatası:', error.message);
});
```

#### Alternatif Token Gönderme Yöntemleri

**Yöntem 1: auth.token (ÖNERİLEN)**
```javascript
const socket = io('http://localhost:3000', {
  auth: { token: `Bearer ${token}` }
});
```

**Yöntem 2: headers.authorization**
```javascript
const socket = io('http://localhost:3000', {
  extraHeaders: {
    authorization: `Bearer ${token}`
  }
});
```

**Yöntem 3: query.token**
```javascript
const socket = io('http://localhost:3000', {
  query: { token: `Bearer ${token}` }
});
```

---

## 💬 2. MESAJ GÖNDERME (send_message)

### Event: `send_message`

#### Request Format
```javascript
socket.emit('send_message', {
  receiverId: 'receiver-user-uuid',  // ZORUNLU
  content: 'Merhaba! Nasılsınız?',   // ZORUNLU
  type: 'TEXT'                        // OPSIYONEL (TEXT, IMAGE, LOCATION)
});
```

#### Response Event'leri

**1. message_sent (Gönderene)**
```javascript
socket.on('message_sent', (data) => {
  console.log('✅ Mesaj gönderildi:', data);
  // {
  //   id: 'message-uuid',
  //   content: 'Merhaba! Nasılsınız?',
  //   receiverId: 'receiver-user-uuid'
  // }
});
```

**2. new_message (Alıcıya)**
```javascript
socket.on('new_message', (data) => {
  console.log('📨 Yeni mesaj alındı:', data);
  // {
  //   id: 'message-uuid',
  //   senderId: 'sender-user-uuid',
  //   content: 'Merhaba! Nasılsınız?',
  //   type: 'TEXT',
  //   createdAt: '2025-01-08T12:00:00.000Z',
  //   isAiResponse: false
  // }
  
  // Mesajı UI'a ekle
  addMessageToChat(data);
});
```

**3. message_error (Hata durumunda)**
```javascript
socket.on('message_error', (data) => {
  console.error('❌ Mesaj hatası:', data.error);
  // Örnek: "Alıcı ID bulunamadı"
  // Örnek: "Alıcı bağlı değil. Mesaj kaydedildi ama iletilemedi."
});
```

### Mesaj Tipleri

| Type | Açıklama | content Örneği |
|------|----------|----------------|
| `TEXT` | Normal text mesaj | "Merhaba!" |
| `IMAGE` | Resim URL'i | "http://example.com/image.jpg" |
| `LOCATION` | Konum bilgisi | "40.7128,-74.0060" veya adres |

---

## 🎨 3. REACT NATIVE ÖRNEK COMPONENT

### Chat Screen

```javascript
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import io from 'socket.io-client';

const ChatScreen = ({ route, navigation }) => {
  const { receiverId, receiverName, token } = route.params;
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Socket bağlantısı kur
    socketRef.current = io('http://localhost:3000', {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    // Bağlantı event'leri
    socket.on('connect', () => {
      console.log('✅ Bağlandı');
      
      // Konuşma odasına katıl
      socket.emit('join_conversation', { otherUserId: receiverId });
    });

    // Mesaj gönderildi
    socket.on('message_sent', (data) => {
      console.log('✅ Mesaj gönderildi:', data);
      // UI'da optimistic update yapılmışsa güncelle
    });

    // Yeni mesaj alındı
    socket.on('new_message', (data) => {
      console.log('📨 Yeni mesaj:', data);
      setMessages(prev => [...prev, {
        id: data.id,
        senderId: data.senderId,
        content: data.content,
        type: data.type,
        createdAt: data.createdAt,
        isAiResponse: data.isAiResponse,
        isMine: false,
      }]);
    });

    // Karşı taraf yazıyor
    socket.on('user_typing', (data) => {
      if (data.userId === receiverId) {
        setIsTyping(data.isTyping);
      }
    });

    // Mesaj okundu
    socket.on('messages_read', (data) => {
      console.log('✅ Mesajlar okundu:', data);
      // Mesajları "okundu" olarak işaretle
    });

    // Hata
    socket.on('message_error', (data) => {
      console.error('❌ Hata:', data.error);
      alert(data.error);
    });

    // Cleanup
    return () => {
      socket.emit('leave_conversation', { otherUserId: receiverId });
      socket.disconnect();
    };
  }, [receiverId, token]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const socket = socketRef.current;
    
    // Mesajı gönder
    socket.emit('send_message', {
      receiverId: receiverId,
      content: inputText.trim(),
      type: 'TEXT',
    });

    // Optimistic update (UI'da hemen göster)
    const tempMessage = {
      id: 'temp-' + Date.now(),
      content: inputText.trim(),
      senderId: 'me',
      isMine: true,
      createdAt: new Date().toISOString(),
      type: 'TEXT',
    };
    setMessages(prev => [...prev, tempMessage]);

    setInputText('');
  };

  const handleTyping = (typing) => {
    const socket = socketRef.current;
    socket.emit('typing', {
      receiverId: receiverId,
      isTyping: typing,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={{ padding: 15, backgroundColor: '#007AFF' }}>
        <Text style={{ color: 'white', fontSize: 18 }}>{receiverName}</Text>
        {isTyping && (
          <Text style={{ color: '#ddd', fontSize: 12 }}>yazıyor...</Text>
        )}
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{
            alignSelf: item.isMine ? 'flex-end' : 'flex-start',
            backgroundColor: item.isMine ? '#007AFF' : '#E5E5EA',
            padding: 10,
            margin: 5,
            borderRadius: 15,
            maxWidth: '70%',
          }}>
            <Text style={{ color: item.isMine ? 'white' : 'black' }}>
              {item.content}
            </Text>
            {item.isAiResponse && (
              <Text style={{ fontSize: 10, color: '#999', marginTop: 5 }}>
                🤖 AI Yanıtı
              </Text>
            )}
          </View>
        )}
      />

      {/* Input */}
      <View style={{ flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ddd' }}>
        <TextInput
          style={{ 
            flex: 1, 
            borderWidth: 1, 
            borderColor: '#ddd', 
            borderRadius: 20, 
            paddingHorizontal: 15,
            paddingVertical: 8,
          }}
          placeholder="Mesaj yazın..."
          value={inputText}
          onChangeText={(text) => {
            setInputText(text);
            handleTyping(text.length > 0);
          }}
          onBlur={() => handleTyping(false)}
        />
        <TouchableOpacity 
          onPress={sendMessage}
          style={{ 
            backgroundColor: '#007AFF', 
            borderRadius: 20, 
            paddingHorizontal: 20,
            paddingVertical: 8,
            marginLeft: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white' }}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
```

---

## 📡 4. TÜM WEBSOCKET EVENT'LERİ

### 4.1 send_message (Mesaj Gönder)

**Emit:**
```javascript
socket.emit('send_message', {
  receiverId: 'user-uuid',
  content: 'Mesaj içeriği',
  type: 'TEXT'  // TEXT, IMAGE, LOCATION
});
```

**Listen:**
- `message_sent` - Gönderim başarılı
- `new_message` - Yeni mesaj alındı
- `message_error` - Hata oluştu

---

### 4.2 join_conversation (Konuşmaya Katıl)

**Emit:**
```javascript
socket.emit('join_conversation', {
  otherUserId: 'other-user-uuid'
});
```

**Ne Yapar:**
- Özel konuşma odasına katılır
- Oda adı: `conversation_{userId1}_{userId2}` (sıralı)

---

### 4.3 leave_conversation (Konuşmadan Ayrıl)

**Emit:**
```javascript
socket.emit('leave_conversation', {
  otherUserId: 'other-user-uuid'
});
```

**Ne Zaman:**
- Chat ekranından çıkarken
- Component unmount olurken

---

### 4.4 typing (Yazıyor Göstergesi)

**Emit:**
```javascript
// Yazmaya başladığında
socket.emit('typing', {
  receiverId: 'user-uuid',
  isTyping: true
});

// Yazmayı bıraktığında
socket.emit('typing', {
  receiverId: 'user-uuid',
  isTyping: false
});
```

**Listen:**
```javascript
socket.on('user_typing', (data) => {
  console.log(`${data.userId} yazıyor: ${data.isTyping}`);
  // UI'da "yazıyor..." göster/gizle
});
```

---

### 4.5 read_messages (Mesajları Okundu İşaretle)

**Emit:**
```javascript
// Tüm konuşmayı okundu işaretle
socket.emit('read_messages', {
  senderId: 'sender-user-uuid'
});
```

**Listen:**
```javascript
socket.on('messages_read', (data) => {
  console.log('✅ Mesajlar okundu:', data);
  // {
  //   readerId: 'reader-user-uuid',
  //   timestamp: '2025-01-08T12:00:00.000Z'
  // }
});
```

---

### 4.6 mark_message_read (Tek Mesajı Okundu İşaretle)

**Emit:**
```javascript
socket.emit('mark_message_read', {
  messageId: 'message-uuid'
});
```

**Listen:**
```javascript
socket.on('message_read', (data) => {
  console.log('✅ Mesaj okundu:', data);
  // {
  //   messageId: 'message-uuid',
  //   readerId: 'reader-user-uuid',
  //   timestamp: '2025-01-08T12:00:00.000Z'
  // }
});
```

---

### 4.7 get_online_users (Online Kullanıcıları Listele)

**Emit:**
```javascript
socket.emit('get_online_users');
```

**Listen:**
```javascript
socket.on('online_users_list', (data) => {
  console.log('Online kullanıcılar:', data.users);
  // [
  //   {
  //     id: 'user-uuid',
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     isOnline: true,
  //     lastSeen: '2025-01-08T12:00:00.000Z',
  //     userType: 'worker'
  //   }
  // ]
});
```

---

### 4.8 subscribe_user_status (Kullanıcı Durumunu Takip Et)

**Emit:**
```javascript
// Belirli kullanıcının durumunu takip et
socket.emit('subscribe_user_status', {
  userId: 'user-uuid'
});
```

**Listen:**
```javascript
socket.on('user_status_update', (data) => {
  console.log('👤 Kullanıcı durumu güncellendi:', data);
  // {
  //   userId: 'user-uuid',
  //   isOnline: true,
  //   lastSeen: '2025-01-08T12:00:00.000Z',
  //   firstName: 'John',
  //   lastName: 'Doe'
  // }
  
  // UI'da online/offline göster
  if (data.isOnline) {
    setUserStatus('🟢 Online');
  } else {
    setUserStatus(`🔴 Son görülme: ${formatDate(data.lastSeen)}`);
  }
});
```

---

## 🎨 5. KAPSAMLI REACT NATIVE HOOK

### useSocket.js

```javascript
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = (token) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!token) return;

    // Socket oluştur
    const socket = io('http://localhost:3000', {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Socket connected');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('🔴 Connection error:', error.message);
      setConnected(false);
    });

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Mesaj gönder
  const sendMessage = (receiverId, content, type = 'TEXT') => {
    if (!socketRef.current) return;
    
    socketRef.current.emit('send_message', {
      receiverId,
      content,
      type,
    });
  };

  // Yazıyor durumu gönder
  const sendTyping = (receiverId, isTyping) => {
    if (!socketRef.current) return;
    
    socketRef.current.emit('typing', {
      receiverId,
      isTyping,
    });
  };

  // Mesajları okundu işaretle
  const markAsRead = (senderId) => {
    if (!socketRef.current) return;
    
    socketRef.current.emit('read_messages', {
      senderId,
    });
  };

  // Konuşmaya katıl
  const joinConversation = (otherUserId) => {
    if (!socketRef.current) return;
    
    socketRef.current.emit('join_conversation', {
      otherUserId,
    });
  };

  // Konuşmadan ayrıl
  const leaveConversation = (otherUserId) => {
    if (!socketRef.current) return;
    
    socketRef.current.emit('leave_conversation', {
      otherUserId,
    });
  };

  // Online kullanıcıları al
  const getOnlineUsers = () => {
    if (!socketRef.current) return;
    
    socketRef.current.emit('get_online_users');
  };

  // Kullanıcı durumunu takip et
  const subscribeUserStatus = (userId) => {
    if (!socketRef.current) return;
    
    socketRef.current.emit('subscribe_user_status', {
      userId,
    });
  };

  // Event listener ekle
  const on = (event, callback) => {
    if (!socketRef.current) return;
    socketRef.current.on(event, callback);
  };

  // Event listener kaldır
  const off = (event, callback) => {
    if (!socketRef.current) return;
    socketRef.current.off(event, callback);
  };

  return {
    socket: socketRef.current,
    connected,
    sendMessage,
    sendTyping,
    markAsRead,
    joinConversation,
    leaveConversation,
    getOnlineUsers,
    subscribeUserStatus,
    on,
    off,
  };
};

// Kullanım
const ChatComponent = () => {
  const { 
    connected, 
    sendMessage, 
    sendTyping, 
    joinConversation,
    on, 
    off 
  } = useSocket(token);

  useEffect(() => {
    // Konuşmaya katıl
    joinConversation(receiverId);

    // Event listener'lar
    const handleNewMessage = (data) => {
      setMessages(prev => [...prev, data]);
    };

    const handleTyping = (data) => {
      setIsTyping(data.isTyping);
    };

    on('new_message', handleNewMessage);
    on('user_typing', handleTyping);

    return () => {
      off('new_message', handleNewMessage);
      off('user_typing', handleTyping);
    };
  }, [receiverId]);

  return (
    <View>
      {connected ? (
        <Text>🟢 Bağlı</Text>
      ) : (
        <Text>🔴 Bağlantı kuruluyor...</Text>
      )}
      {/* ... */}
    </View>
  );
};
```

---

## 🔍 6. HATA AYIKLAMA (Debug)

### Backend Log'ları

**Bağlantı:**
```
🔍 === SOCKET CONNECTION DEBUG ===
Client ID: abc123
Extracted token: Present
✅ User found: John Doe
✅ Connection successful for user: user-uuid
Connected users count: 5
```

**Mesaj Gönderme:**
```
=== MESAJ GÖNDERME DEBUG ===
Gönderici ID: sender-uuid
Alıcı ID: receiver-uuid
Mesaj içeriği: Merhaba!
Bağlı kullanıcılar: ['user1-uuid', 'user2-uuid']
Alıcı bağlı mı: true
Mesaj veritabanına kaydedildi: message-uuid
```

### Frontend Debug

```javascript
// Tüm event'leri dinle (development)
socket.onAny((event, ...args) => {
  console.log(`📡 Socket Event: ${event}`, args);
});

// Connection durumu
socket.on('connect', () => console.log('✅ Connected:', socket.id));
socket.on('disconnect', (reason) => console.log('❌ Disconnected:', reason));
socket.on('connect_error', (error) => console.error('🔴 Error:', error));
```

---

## 🤖 7. AI OTOMATIK YANIT

**Ne Zaman Çalışır?**
- Alıcı **offline** ise
- Mesaj gönderildikten sonra otomatik

**Nasıl Çalışır?**
1. Mesaj gönderilir
2. Alıcı offline kontrolü yapılır
3. Offline ise AI yanıt oluşturur
4. AI yanıtı mesaj olarak kaydedilir
5. Gönderene `new_message` event'i ile döner

**Tespit:**
```javascript
socket.on('new_message', (data) => {
  if (data.isAiResponse) {
    console.log('🤖 Bu bir AI yanıtı');
    // UI'da farklı göster (örn: robot ikonu)
  }
});
```

---

## 🧪 8. TEST SENARYOLARI

### Senaryo 1: Basit Mesaj Gönderme

```javascript
// 1. Bağlan
const socket = io('http://localhost:3000', {
  auth: { token: `Bearer ${token}` }
});

// 2. Bağlantıyı bekle
socket.on('connect', () => {
  // 3. Mesaj gönder
  socket.emit('send_message', {
    receiverId: 'receiver-uuid',
    content: 'Test mesajı',
  });
});

// 4. Yanıtı dinle
socket.on('message_sent', (data) => {
  console.log('✅ Gönderildi:', data.id);
});
```

### Senaryo 2: Real-time Chat

```javascript
// Her iki kullanıcı da bağlı

// User A gönderir
socketA.emit('send_message', {
  receiverId: 'user-b-uuid',
  content: 'Merhaba User B!'
});

// User B alır
socketB.on('new_message', (data) => {
  console.log('User A dedi:', data.content);
});

// User B yanıt verir
socketB.emit('send_message', {
  receiverId: 'user-a-uuid',
  content: 'Merhaba User A!'
});
```

### Senaryo 3: Offline Mesajlaşma + AI

```javascript
// User A online, User B offline

// User A mesaj gönderir
socketA.emit('send_message', {
  receiverId: 'user-b-uuid',
  content: 'Merhaba!'
});

// User A AI yanıtı alır
socketA.on('new_message', (data) => {
  if (data.isAiResponse) {
    console.log('🤖 AI yanıtı:', data.content);
  }
});

// User B daha sonra login olduğunda
// REST API ile mesajları çeker
GET /messages/conversation/user-a-uuid
```

---

## 📊 9. WEBSOCKET + REST API KARŞILAŞTIRMASI

| İşlem | WebSocket | REST API | Önerilen |
|-------|-----------|----------|----------|
| **Mesaj Gönder** | `socket.emit('send_message')` | `POST /messages` | WebSocket |
| **Mesaj Al** | `socket.on('new_message')` | `GET /messages/conversation/:userId` | WebSocket (real-time) |
| **Geçmiş Mesajlar** | ❌ Yok | `GET /messages/conversation/:userId` | REST API |
| **Okundu İşaretle** | `socket.emit('read_messages')` | `PUT /messages/:id/read` | WebSocket |
| **Online Durum** | `socket.on('user_status_update')` | `GET /users/user-status/:userId` | WebSocket |

---

## 🎯 10. BEST PRACTICES

### ✅ Yapılması Gerekenler

1. **Connection Retry:**
```javascript
const socket = io(url, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
```

2. **Error Handling:**
```javascript
socket.on('message_error', (data) => {
  // Kullanıcıya göster
  showNotification(data.error);
});
```

3. **Optimistic Updates:**
```javascript
// Mesajı hemen UI'da göster
setMessages(prev => [...prev, tempMessage]);

// Sonra backend'den confirmation bekle
socket.on('message_sent', (data) => {
  updateTempMessage(data);
});
```

4. **Cleanup:**
```javascript
useEffect(() => {
  // Socket setup...
  
  return () => {
    socket.disconnect();
  };
}, []);
```

### ❌ Yapılmaması Gerekenler

1. ❌ Her render'da yeni socket oluşturma
2. ❌ Event listener cleanup yapmama
3. ❌ Token olmadan bağlanmaya çalışma
4. ❌ Disconnect event'ini handle etmeme
5. ❌ Error event'lerini ignore etme

---

## 🚀 11. PRODUCTION HAZIRLIK

### Environment Variables

```javascript
const SOCKET_URL = __DEV__ 
  ? 'http://localhost:3000' 
  : 'https://api.your-domain.com';

const socket = io(SOCKET_URL, {
  auth: { token: `Bearer ${token}` }
});
```

### Reconnection Stratejisi

```javascript
const socket = io(url, {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

socket.on('reconnect', (attemptNumber) => {
  console.log('🔄 Yeniden bağlandı:', attemptNumber);
  // Eksik mesajları çek
  fetchMissedMessages();
});
```

---

## 📝 12. ÖZET - HIZLI BAŞLANGIÇ

### Minimum Kod (Copy-Paste Ready)

```javascript
import io from 'socket.io-client';

// 1. BAĞLAN
const socket = io('http://localhost:3000', {
  auth: { token: `Bearer ${YOUR_JWT_TOKEN}` }
});

// 2. EVENT LISTENER'LAR
socket.on('connect', () => console.log('✅ Bağlandı'));
socket.on('new_message', (data) => console.log('📨 Mesaj:', data));
socket.on('message_sent', (data) => console.log('✅ Gönderildi'));
socket.on('message_error', (data) => console.error('❌ Hata:', data.error));

// 3. MESAJ GÖNDER
socket.emit('send_message', {
  receiverId: 'RECEIVER_USER_UUID',
  content: 'Merhaba!',
  type: 'TEXT'
});

// 4. CLEANUP
// Component unmount'ta
socket.disconnect();
```

---

## 🎯 ENDPOINT ÖZET

| Event | Yön | Data | Açıklama |
|-------|-----|------|----------|
| `send_message` | ➡️ Emit | `{receiverId, content, type?}` | Mesaj gönder |
| `message_sent` | ⬅️ Listen | `{id, content, receiverId}` | Gönderim başarılı |
| `new_message` | ⬅️ Listen | `{id, senderId, content, type, createdAt, isAiResponse?}` | Yeni mesaj |
| `message_error` | ⬅️ Listen | `{error}` | Hata |
| `typing` | ➡️ Emit | `{receiverId, isTyping}` | Yazıyor durumu |
| `user_typing` | ⬅️ Listen | `{userId, isTyping}` | Karşı taraf yazıyor |
| `join_conversation` | ➡️ Emit | `{otherUserId}` | Konuşmaya katıl |
| `read_messages` | ➡️ Emit | `{senderId}` | Okundu işaretle |
| `messages_read` | ⬅️ Listen | `{readerId, timestamp}` | Okundu bildirimi |
| `get_online_users` | ➡️ Emit | `{}` | Online listesi |
| `online_users_list` | ⬅️ Listen | `{users: [...]}` | Online kullanıcılar |
| `subscribe_user_status` | ➡️ Emit | `{userId}` | Durum takibi |
| `user_status_update` | ⬅️ Listen | `{userId, isOnline, lastSeen}` | Durum güncellendi |

**Not:** ➡️ = emit (gönder), ⬅️ = on (dinle)

---

**WebSocket URL:** `ws://localhost:3000`  
**Test Page:** `http://localhost:3000/public/chat-test.html`  
**Durum:** ✅ Çalışır Durumda

