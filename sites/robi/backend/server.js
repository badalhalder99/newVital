const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3108;

// Tenant-specific CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3128', // Tenant frontend
    'http://localhost:3004' // Main frontend (for development)
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tenant-specific routes
const authRoutes = require('./routes/auth');
const tenantPageRoutes = require('./routes/tenantPages');
const tenantSettingsRoutes = require('./routes/tenantSettings');

app.use('/api/auth', authRoutes);
app.use('/api/pages', tenantPageRoutes);
app.use('/api/settings', tenantSettingsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    tenant: 'robi',
    database: 'tenant_robi',
    timestamp: new Date().toISOString()
  });
});

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Tenant "robi" backend running on http://localhost:${PORT}`);
      console.log(`📊 Database: tenant_robi`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();