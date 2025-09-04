const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const { initializeDatabase, closeDatabaseConnections } = require('./config/database');
const { tenantIdentificationMiddleware, tenantIsolation } = require('./middleware/tenant');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const tenantRoutes = require('./routes/tenants');
const subscriptionRoutes = require('./routes/subscriptions');
const analyticsRoutes = require('./routes/analytics');
const heatmapRoutes = require('./routes/heatmap');
const tenantWebsiteRoutes = require('./routes/tenantWebsite');
const mysassRoutes = require('./routes/mysass');
const teamMembersRoutes = require('./routes/teamMembers');
const productCategoriesRoutes = require('./routes/productCategories');
const productsRoutes = require('./routes/products');
const clientsRoutes = require('./routes/clients');
const certificatesRoutes = require('./routes/certificates');
const testimonialsRoutes = require('./routes/testimonials');
const adminUsersRoutes = require('./routes/admin-users');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware - Allow all localhost ports and subdomains for development
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:3002', 
    'http://localhost:3003', 
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:3006',
    // Allow subdomains
    /^http:\/\/([^.]+)\.localhost:3000$/,
    /^http:\/\/([^.]+)\.localhost:3001$/,
    /^http:\/\/([^.]+)\.localhost:3002$/,
    /^http:\/\/([^.]+)\.localhost:3003$/,
    /^http:\/\/([^.]+)\.localhost:3004$/,
    /^http:\/\/([^.]+)\.localhost:3005$/,
    /^http:\/\/([^.]+)\.localhost:3006$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Tenant-Subdomain'],
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Multi-tenant middleware
app.use(tenantIdentificationMiddleware);
app.use(tenantIsolation());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/heatmap', heatmapRoutes);
app.use('/api/tenant-website', tenantWebsiteRoutes);
app.use('/api/mysass', mysassRoutes);
app.use('/api/team-members', teamMembersRoutes);
app.use('/api/product-categories', productCategoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/admin-users', adminUsersRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Initialize databases and start server
async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Multi-tenant SaaS with MongoDB support`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server...');
  await closeDatabaseConnections();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down server...');
  await closeDatabaseConnections();
  process.exit(0);
});

// Start the server
startServer();

