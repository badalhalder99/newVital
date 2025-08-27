const axios = require('axios');

async function testRegistration() {
  try {
    console.log('🧪 Testing tenant registration...');
    
    const registrationData = {
      name: 'Test Store Owner',
      email: 'teststore@example.com',
      password: 'test123456',
      storeName: 'Web Store',
      domainName: 'webstore',
      summary: 'A test web store for database creation testing',
      role: 'tenant'
    };

    const response = await axios.post('http://localhost:3011/api/auth/register', registrationData);
    
    console.log('✅ Registration successful:', {
      success: response.data.success,
      message: response.data.message,
      user: response.data.user?.name,
      tenant_id: response.data.user?.tenant_id,
      redirect: response.data.redirect
    });
    
    // Wait a moment for database creation
    console.log('⏳ Waiting for database initialization...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
  } catch (error) {
    console.error('❌ Registration failed:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
  }
}

testRegistration();