const axios = require('axios');

async function createTestUsers() {
  try {
    console.log('Test kullanıcıları oluşturuluyor...');

    // Test kullanıcısı 1
    const user1 = await axios.post('http://localhost:3000/auth/register', {
      firstName: 'Test',
      lastName: 'User 1',
      email: 'testuser1@example.com',
      phone: '+905551234567',
      password: 'password123',
      userType: 'job_seeker'
    });
    console.log('Kullanıcı 1 oluşturuldu:', user1.data.user.id);

    // Test kullanıcısı 2
    const user2 = await axios.post('http://localhost:3000/auth/register', {
      firstName: 'Test',
      lastName: 'User 2',
      email: 'testuser2@example.com',
      phone: '+905559876543',
      password: 'password123',
      userType: 'employer'
    });
    console.log('Kullanıcı 2 oluşturuldu:', user2.data.user.id);

    console.log('Test kullanıcıları başarıyla oluşturuldu!');
  } catch (error) {
    console.error('Hata:', error.response?.data || error.message);
  }
}

createTestUsers(); 