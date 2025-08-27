const { MongoClient } = require('mongodb');
require('dotenv').config();

// Tenant-specific MongoDB Configuration
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DATABASE_NAME = process.env.DATABASE_NAME || 'tenant_mysass';
const TENANT_SUBDOMAIN = process.env.TENANT_SUBDOMAIN || 'mysass';

let mongoClient;
let mongoDb;

// MongoDB Connection for this specific tenant
async function connectToMongoDB() {
  try {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    console.log(`🔗 Connected to MongoDB for tenant: ${TENANT_SUBDOMAIN}`);
    mongoDb = mongoClient.db(DATABASE_NAME);
    console.log(`📊 Using database: ${DATABASE_NAME}`);
    return mongoDb;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB for tenant ${TENANT_SUBDOMAIN}:`, error);
    throw error;
  }
}

// Get MongoDB instance (always returns tenant-specific database)
function getMongoDb() {
  if (!mongoClient) {
    throw new Error('MongoDB not initialized. Call connectToMongoDB first.');
  }
  return mongoDb;
}

// Initialize database
async function initializeDatabase() {
  try {
    await connectToMongoDB();
    console.log(`✅ Database connected successfully for tenant: ${TENANT_SUBDOMAIN}`);
  } catch (error) {
    console.error(`❌ Failed to initialize database for tenant ${TENANT_SUBDOMAIN}:`, error);
    throw error;
  }
}

// Close database connections
async function closeDatabaseConnections() {
  try {
    if (mongoClient) {
      await mongoClient.close();
      console.log(`🔒 MongoDB connection closed for tenant: ${TENANT_SUBDOMAIN}`);
    }
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
}

// Get collection (always from tenant-specific database)
function getCollection(collectionName) {
  const db = getMongoDb();
  return db.collection(collectionName);
}

// Tenant-specific helper functions
function getTenantInfo() {
  return {
    subdomain: TENANT_SUBDOMAIN,
    database: DATABASE_NAME,
    uri: MONGODB_URI
  };
}

module.exports = {
  connectToMongoDB,
  initializeDatabase,
  getMongoDb,
  closeDatabaseConnections,
  getCollection,
  getTenantInfo,
  // Legacy support
  getDB: () => getMongoDb()
};