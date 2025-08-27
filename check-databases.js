const { MongoClient } = require('mongodb');

async function listDatabases() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const admin = client.db().admin();
    const result = await admin.listDatabases();
    
    console.log('\n📁 Existing Databases:');
    result.databases.forEach(db => {
      console.log(`- ${db.name} (${db.sizeOnDisk} bytes)`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

listDatabases();