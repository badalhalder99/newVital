const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017';
const NEW_PASSWORD = 'tenant1234';

async function resetPasswords() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    // Hash the new password
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
    console.log('✅ Password hashed\n');

    // ========== RESET MAIN DATABASE ADMIN PASSWORD ==========
    console.log('========== RESETTING ADMIN PANEL PASSWORD ==========');
    const mainDb = client.db('multi_tenant_saas');
    const usersCollection = mainDb.collection('users');

    // Reset admin@vital.com password
    const adminResult = await usersCollection.updateOne(
      { email: 'admin@vital.com', role: 'admin' },
      { $set: { password: hashedPassword, updated_at: new Date() } }
    );

    if (adminResult.matchedCount > 0) {
      console.log('✅ Admin panel password reset successfully');
      console.log('   Email: admin@vital.com');
      console.log('   Password: tenant1234');
      console.log('   Login URL: http://localhost:3000/signin\n');
    } else {
      console.log('⚠️  Admin user not found in main database\n');
    }

    // ========== RESET ALL TENANT PASSWORDS ==========
    console.log('========== RESETTING TENANT USER PASSWORDS ==========');

    // Reset all tenant users in main database
    const tenantUsersResult = await usersCollection.updateMany(
      { role: 'tenant' },
      { $set: { password: hashedPassword, updated_at: new Date() } }
    );

    console.log(`✅ Reset ${tenantUsersResult.modifiedCount} tenant user passwords in main database\n`);

    // List all tenants
    const tenants = await usersCollection.find({ role: 'tenant' }).toArray();
    console.log('Tenant login credentials (for main admin panel):');
    tenants.forEach(tenant => {
      console.log(`   - ${tenant.email} / tenant1234 (Domain: ${tenant.domainName})`);
    });

    // ========== RESET TENANT DASHBOARD ADMIN PASSWORDS ==========
    console.log('\n========== RESETTING TENANT DASHBOARD PASSWORDS ==========');

    // Reset mysass tenant dashboard admin
    const tenantMysassDb = client.db('tenant_mysass');
    const adminUsersCollection = tenantMysassDb.collection('admin_users');

    const mysassResult = await adminUsersCollection.updateMany(
      {},
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    if (mysassResult.modifiedCount > 0) {
      console.log('✅ MySaaS tenant dashboard password reset successfully');
      console.log('   Email: admin@admin.com');
      console.log('   Password: tenant1234');
      console.log('   Backend: http://localhost:3054');
      console.log('   Frontend: http://localhost:3074\n');
    } else {
      console.log('⚠️  No admin users found in tenant_mysass database\n');
    }

    // Check and reset other tenant databases
    const tenantDatabases = ['tenant_apple', 'tenant_robi', 'tenant_webstore', 'tenant_newteststore123', 'tenant_themetest123'];

    for (const dbName of tenantDatabases) {
      try {
        const tenantDb = client.db(dbName);
        const tenantAdminCollection = tenantDb.collection('admin_users');

        const count = await tenantAdminCollection.countDocuments();
        if (count > 0) {
          const result = await tenantAdminCollection.updateMany(
            {},
            { $set: { password: hashedPassword, updatedAt: new Date() } }
          );
          console.log(`✅ Reset ${result.modifiedCount} admin passwords in ${dbName}`);
        }
      } catch (error) {
        console.log(`⚠️  No admin_users collection in ${dbName}`);
      }
    }

    console.log('\n========== PASSWORD RESET COMPLETE ==========');
    console.log('All passwords have been reset to: tenant1234\n');

  } catch (error) {
    console.error('❌ Error resetting passwords:', error);
  } finally {
    await client.close();
    console.log('✅ Database connection closed');
  }
}

resetPasswords();
