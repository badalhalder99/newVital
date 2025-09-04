const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB Configuration
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_NAME = 'multi_tenant_saas';

async function createWebstoreTenant() {
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(MONGODB_NAME);
    
    // Check if tenant already exists
    const existingTenant = await db.collection('tenants').findOne({ subdomain: 'webstore' });
    if (existingTenant) {
      console.log('✅ Webstore tenant already exists');
      return;
    }
    
    // 1. Create the tenant
    const tenantData = {
      name: 'Webstore',
      subdomain: 'webstore',
      slug: 'webstore',
      database_name: 'tenant_webstore',
      status: 'active',
      settings: {
        max_users: 100,
        features: ['website', 'analytics']
      },
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const tenantResult = await db.collection('tenants').insertOne(tenantData);
    const tenantId = tenantResult.insertedId;
    console.log('✅ Created tenant:', tenantData.name, '- ID:', tenantId);
    
    // 2. Create the tenant user
    const hashedPassword = await bcrypt.hash('webstore123', 10);
    
    const userData = {
      username: 'webstore_admin',
      email: 'admin@webstore.com',
      password: hashedPassword,
      role: 'tenant',
      tenant_id: tenantId,
      status: 'active',
      profile: {
        first_name: 'Webstore',
        last_name: 'Admin'
      },
      tenant: {
        id: tenantId,
        name: 'Webstore',
        subdomain: 'webstore'
      },
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const userResult = await db.collection('users').insertOne(userData);
    console.log('✅ Created tenant user:', userData.email, '- ID:', userResult.insertedId);
    
    // 3. Create tenant-specific database and basic settings
    const tenantDb = client.db(tenantData.database_name);
    
    // Create tenant settings
    const settings = {
      tenant_id: tenantId,
      site_name: 'Webstore',
      site_description: 'Your online webstore for all your needs',
      primary_color: '#3B82F6',
      secondary_color: '#1E40AF',
      contact_email: 'contact@webstore.com',
      contact_phone: '+1-555-0123',
      address: '123 Commerce Street, Business City, BC 12345',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    await tenantDb.collection('settings').insertOne(settings);
    console.log('✅ Created tenant settings');
    
    // Create a home page
    const homePage = {
      tenant_id: tenantId,
      page_type: 'home',
      title: 'Welcome to Webstore',
      content: 'Your one-stop shop for quality products and exceptional service.',
      meta_description: 'Discover amazing products at Webstore - your trusted online shopping destination.',
      is_published: true,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    await tenantDb.collection('pages').insertOne(homePage);
    console.log('✅ Created home page');
    
    console.log('\n🎉 Webstore tenant created successfully!');
    console.log('\n📝 Tenant Details:');
    console.log('Name: Webstore');
    console.log('Subdomain: webstore');
    console.log('Email: admin@webstore.com');
    console.log('Password: webstore123');
    console.log('\n🌐 Website URLs:');
    console.log('Home: http://webstore.localhost:3001');
    console.log('About: http://webstore.localhost:3001/about');
    console.log('Services: http://webstore.localhost:3001/services');
    console.log('\n💻 Dashboard URL:');
    console.log('Login: http://localhost:3001/signin');
    console.log('Dashboard: http://localhost:3001/tenant (after login)');
    
  } catch (error) {
    console.error('❌ Error creating tenant:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run the script
createWebstoreTenant();