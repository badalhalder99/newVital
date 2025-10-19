const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017';

async function checkUsers() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');

    // Check main database users
    const mainDb = client.db('multi_tenant_saas');
    const usersCollection = mainDb.collection('users');

    console.log('========== MAIN DATABASE USERS ==========');
    const users = await usersCollection.find({}).toArray();
    console.log(`Total users: ${users.length}\n`);

    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Name: ${user.name || 'N/A'}`);
      console.log(`  Domain: ${user.domainName || 'N/A'}`);
      console.log(`  Tenant ID: ${user.tenant_id || 'N/A'}`);
      console.log(`  Status: ${user.status || 'N/A'}`);
      console.log('');
    });

    // Check tenant_mysass database
    console.log('\n========== TENANT MYSASS DATABASE ==========');
    const tenantDb = client.db('tenant_mysass');
    const adminUsersCollection = tenantDb.collection('admin_users');

    const adminUsers = await adminUsersCollection.find({}).toArray();
    console.log(`Total admin users: ${adminUsers.length}\n`);

    adminUsers.forEach((user, index) => {
      console.log(`Admin User ${index + 1}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Status: ${user.status || 'N/A'}`);
      console.log(`  Tenant: ${user.tenant || 'N/A'}`);
      console.log(`  Last Login: ${user.lastLogin || 'N/A'}`);
      console.log('');
    });

    // Check tenants collection
    console.log('\n========== TENANTS ==========');
    const tenantsCollection = mainDb.collection('tenants');
    const tenants = await tenantsCollection.find({}).toArray();
    console.log(`Total tenants: ${tenants.length}\n`);

    tenants.forEach((tenant, index) => {
      console.log(`Tenant ${index + 1}:`);
      console.log(`  Name: ${tenant.name}`);
      console.log(`  Subdomain: ${tenant.subdomain}`);
      console.log(`  Database: ${tenant.database_name}`);
      console.log(`  Status: ${tenant.status}`);
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkUsers();
