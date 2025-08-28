const express = require('express');
const passport = require('../config/passport');
const User = require('../models/User');
const { generateToken, authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Helper function to get port offset
function getPortOffset(subdomain) {
  let hash = 0;
  for (let i = 0; i < subdomain.length; i++) {
    const char = subdomain.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % 100;
}

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, storeName, domainName, summary, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and password are required' 
      });
    }

    // For tenant registration, require store name and domain name
    if (role === 'tenant' && (!storeName || !domainName)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Store name and domain name are required for tenant registration' 
      });
    }

    // Check for existing user in main database
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    const hashedPassword = await User.hashPassword(password);

    // Generate tenant_id for tenant users
    let tenant_id = 1; // Default for regular users
    let tenantRecord = null;
    
    if (role === 'tenant') {
      // Create a proper tenant record first
      const Tenant = require('../models/Tenant');
      
      // Generate subdomain from domain name (remove spaces and make lowercase)
      const subdomain = domainName.replace(/\s+/g, '').toLowerCase();
      
      // Check if subdomain already exists
      const existingTenant = await Tenant.findBySubdomain(subdomain);
      if (existingTenant) {
        return res.status(400).json({ 
          success: false, 
          message: 'Domain name already taken. Please choose a different domain name.' 
        });
      }
      
      // Create new tenant
      tenantRecord = new Tenant({
        name: storeName,
        subdomain: subdomain,
        database_name: `tenant_${subdomain}`,
        status: 'active',
        settings: {
          max_users: 100,
          features: ['website', 'analytics']
        },
        created_at: new Date(),
        updated_at: new Date()
      });
      
      const savedTenant = await tenantRecord.save();
      tenant_id = savedTenant.insertedId;
      
      // Initialize tenant database by creating a settings collection
      try {
        const { getMongoDb } = require('../config/database');
        const tenantDb = getMongoDb(tenantRecord.database_name);
        
        // Create initial settings collection to ensure database exists
        const settingsCollection = tenantDb.collection('settings');
        await settingsCollection.insertOne({
          site_name: tenantRecord.name,
          site_tagline: '',
          primary_color: '#10b981',
          secondary_color: '#059669',
          contact_email: '',
          contact_phone: '',
          address: '',
          social_media: {},
          meta_keywords: '',
          meta_description: '',
          created_at: new Date(),
          updated_at: new Date()
        });
        
        console.log(`✅ Initialized database: ${tenantRecord.database_name}`);
      } catch (dbError) {
        console.error(`❌ Failed to initialize tenant database: ${tenantRecord.database_name}`, dbError);
        // Don't fail registration if database initialization fails
      }
    }

    const newUser = new User({
      tenant_id,
      name,
      email,
      password: hashedPassword,
      storeName: storeName || null,
      domainName: domainName || null,
      summary: summary || null,
      role: role || 'user',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    // Add tenant information for tenant users
    if (tenantRecord) {
      newUser.tenant = {
        name: tenantRecord.name,
        subdomain: tenantRecord.subdomain,
        database_name: tenantRecord.database_name
      };
    }

    // Save to main database for authentication (MongoDB only)
    const savedUser = await newUser.save(); // Use main database (no tenantId)
    const userId = savedUser.insertedId;
    
    const token = generateToken(userId);

    // Prepare user response without password
    const userResponse = {
      _id: userId,
      tenant_id: newUser.tenant_id,
      name: newUser.name,
      email: newUser.email,
      storeName: newUser.storeName,
      domainName: newUser.domainName,
      summary: newUser.summary,
      role: newUser.role,
      status: newUser.status,
      created_at: newUser.created_at
    };

    // Auto-generate tenant site if this is a tenant registration
    if (role === 'tenant' && tenantRecord) {
      try {
        const TenantSiteGenerator = require('../../scripts/generateTenantSite');
        const generator = new TenantSiteGenerator(require('path').join(__dirname, '..', '..'));
        
        // Generate site in background (don't wait)
        generator.generateSite({
          subdomain: tenantRecord.subdomain,
          name: tenantRecord.name,
          database_name: tenantRecord.database_name
        }).then(() => {
          console.log(`✅ Auto-generated site for tenant: ${tenantRecord.subdomain}`);
        }).catch(error => {
          console.error(`❌ Failed to auto-generate site for tenant: ${tenantRecord.subdomain}`, error);
        });
      } catch (error) {
        console.error('Site generator not available:', error);
      }
    }


    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse,
      token,
      redirect: role === 'tenant' && tenantRecord ? {
        type: 'tenant_site',
        subdomain: tenantRecord.subdomain,
        url: `http://localhost:${3040 + getPortOffset(tenantRecord.subdomain)}`
      } : null
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Login user
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: info.message || 'Invalid credentials' 
      });
    }

    const token = generateToken(user._id);
    const userResponse = { ...user };
    delete userResponse.password;

    // Check if user is a tenant and redirect to their site
    let redirectInfo = null;
    if (user.role === 'tenant') {
      let subdomain = null;
      
      // Check different sources for subdomain
      if (user.domainName) {
        subdomain = user.domainName.replace(/\s+/g, '').toLowerCase();
      } else if (user.tenant && user.tenant.subdomain) {
        subdomain = user.tenant.subdomain;
      }
      
      if (subdomain) {
        redirectInfo = {
          type: 'tenant_site',
          subdomain: subdomain,
          url: `http://localhost:${3040 + getPortOffset(subdomain)}`
        };
      }
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token,
      redirect: redirectInfo
    });
  })(req, res, next);
});

// Google OAuth login
router.get('/google', (req, res, next) => {
  // Store signup parameter in session if present
  if (req.query.signup) {
    req.session.googleSignupType = req.query.signup;
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const userId = req.user._id || req.user.id;
    const token = generateToken(userId);
    
    // Prepare user data for frontend
    const userData = {
      _id: userId,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      role: req.user.role || 'user',
      tenant_id: req.user.tenant_id || 1
    };
    
    // Encode user data for URL
    const encodedUser = encodeURIComponent(JSON.stringify(userData));
    
    // Redirect to frontend with token and user data
    res.redirect(`http://localhost:3000/auth/success?token=${token}&user=${encodedUser}`);
  }
);

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  const userResponse = { ...req.user };
  delete userResponse.password;
  
  res.json({
    success: true,
    user: userResponse
  });
});

// Admin login - bypasses tenant restrictions
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user in main database without tenant restriction
    const user = await User.findByEmail(email);
    if (!user || user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }
    
    // Verify password
    const isValidPassword = await User.comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Update last login
    await User.updateById(user._id, { last_login: new Date() });
    
    // Prepare user response without password
    const userResponse = { ...user };
    delete userResponse.password;
    
    res.json({
      success: true,
      message: 'Admin login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error logging out' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  });
});

module.exports = router;