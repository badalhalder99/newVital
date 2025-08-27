const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB Configuration
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_NAME = 'multi_tenant_saas';

async function createTestTenant() {
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(MONGODB_NAME);
    
    // 1. Create the tenant
    const tenantData = {
      name: 'MySaaS',
      subdomain: 'mysass',
      slug: 'mysass',
      database_name: 'tenant_mysass',
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
    const hashedPassword = await bcrypt.hash('mysass123', 10);
    
    const userData = {
      username: 'mysass_admin',
      email: 'admin@mysass.com',
      password: hashedPassword,
      role: 'tenant',
      tenant_id: tenantId,
      status: 'active',
      profile: {
        first_name: 'MySaaS',
        last_name: 'Admin',
        phone: '+1234567890'
      },
      tenant: {
        name: 'MySaaS',
        subdomain: 'mysass',
        database_name: 'tenant_mysass'
      },
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const userResult = await db.collection('users').insertOne(userData);
    console.log('✅ Created tenant user:', userData.email, '- ID:', userResult.insertedId);
    
    // 3. Set up tenant database with initial data
    const tenantDb = client.db('tenant_mysass');
    
    // Create tenant settings
    const settingsData = {
      site_name: 'MySaaS Business',
      site_tagline: 'Your Premier Business Solutions Partner',
      primary_color: '#10b981',
      secondary_color: '#059669',
      contact_email: 'contact@mysass.com',
      contact_phone: '+1 (555) 123-4567',
      address: '123 Business Street, Suite 100, Business City, BC 12345',
      meta_description: 'MySaaS provides comprehensive business solutions tailored to your needs. Quality service, expert team, results-driven approach.',
      social_media: {
        facebook: 'https://facebook.com/mysass',
        twitter: 'https://twitter.com/mysass',
        linkedin: 'https://linkedin.com/company/mysass',
        instagram: 'https://instagram.com/mysass'
      },
      created_at: new Date(),
      updated_at: new Date()
    };
    
    await tenantDb.collection('tenant_settings').insertOne(settingsData);
    console.log('✅ Created tenant settings');
    
    // Create sample pages
    const pages = [
      {
        page_type: 'home',
        title: 'Welcome to MySaaS Business',
        content: `
          <h2>Your Premier Business Solutions Partner</h2>
          <p>At MySaaS Business, we provide comprehensive solutions designed to help your business grow and succeed. Our expert team combines innovation with proven strategies to deliver results that matter.</p>
          
          <h3>What Sets Us Apart</h3>
          <ul>
            <li>✓ Over 10 years of industry experience</li>
            <li>✓ Custom solutions tailored to your needs</li>
            <li>✓ 24/7 dedicated support team</li>
            <li>✓ Proven track record of success</li>
          </ul>
          
          <p>Ready to take your business to the next level? Contact us today to learn how we can help you achieve your goals.</p>
        `,
        meta_description: 'MySaaS Business - Your premier partner for comprehensive business solutions. Expert team, proven results, custom approach.',
        is_active: true,
        order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        page_type: 'about',
        title: 'About MySaaS Business',
        content: `
          <h2>Our Story</h2>
          <p>Founded in 2014, MySaaS Business has grown from a small startup to a leading provider of business solutions. Our journey began with a simple mission: to help businesses achieve their full potential through innovative technology and personalized service.</p>
          
          <h3>Our Mission</h3>
          <p>To empower businesses of all sizes with the tools, strategies, and support they need to succeed in today's competitive marketplace.</p>
          
          <h3>Our Values</h3>
          <ul>
            <li><strong>Excellence:</strong> We strive for perfection in everything we do</li>
            <li><strong>Innovation:</strong> We embrace new technologies and creative solutions</li>
            <li><strong>Integrity:</strong> We build trust through transparency and honesty</li>
            <li><strong>Partnership:</strong> We work alongside our clients as trusted advisors</li>
          </ul>
          
          <h3>Our Team</h3>
          <p>Our diverse team of experts brings together decades of experience across multiple industries. From technology specialists to business strategists, we have the expertise to handle any challenge.</p>
        `,
        meta_description: 'Learn about MySaaS Business - our story, mission, values, and expert team dedicated to your success.',
        is_active: true,
        order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        page_type: 'services',
        title: 'Our Services',
        content: `
          <h2>Comprehensive Business Solutions</h2>
          <p>We offer a full range of services designed to help your business grow and succeed in today's competitive marketplace.</p>
          
          <h3>🎯 Strategic Consulting</h3>
          <p>Our expert consultants work with you to develop comprehensive strategies that drive growth and improve efficiency.</p>
          <ul>
            <li>Business planning and strategy development</li>
            <li>Market analysis and competitive research</li>
            <li>Process optimization and improvement</li>
            <li>Digital transformation consulting</li>
          </ul>
          
          <h3>💻 Technology Solutions</h3>
          <p>Leverage cutting-edge technology to streamline operations and enhance productivity.</p>
          <ul>
            <li>Custom software development</li>
            <li>Cloud migration and management</li>
            <li>System integration and automation</li>
            <li>Data analytics and reporting</li>
          </ul>
          
          <h3>📈 Growth Acceleration</h3>
          <p>Accelerate your business growth with our proven marketing and sales strategies.</p>
          <ul>
            <li>Digital marketing and SEO</li>
            <li>Sales process optimization</li>
            <li>Customer relationship management</li>
            <li>Performance tracking and analytics</li>
          </ul>
          
          <h3>🛡️ Support & Maintenance</h3>
          <p>Keep your business running smoothly with our comprehensive support services.</p>
          <ul>
            <li>24/7 technical support</li>
            <li>System monitoring and maintenance</li>
            <li>Regular updates and improvements</li>
            <li>Training and documentation</li>
          </ul>
        `,
        meta_description: 'Explore our comprehensive business services: strategic consulting, technology solutions, growth acceleration, and 24/7 support.',
        is_active: true,
        order: 3,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await tenantDb.collection('tenant_pages').insertMany(pages);
    console.log('✅ Created sample pages');
    
    // Create sample testimonials
    const testimonials = [
      {
        name: 'Sarah Johnson',
        company: 'TechStart Inc.',
        quote: 'MySaaS Business transformed our operations completely. Their strategic approach and technical expertise helped us increase efficiency by 200% and reduce costs significantly.',
        rating: 5,
        image_url: null,
        is_active: true,
        order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Michael Chen',
        company: 'GrowthCorp',
        quote: 'Working with MySaaS Business was a game-changer for our company. Their innovative solutions and dedicated support team helped us scale from startup to industry leader.',
        rating: 5,
        image_url: null,
        is_active: true,
        order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Emily Rodriguez',
        company: 'Digital Solutions Ltd.',
        quote: 'The team at MySaaS Business delivered exactly what they promised. Professional, reliable, and results-driven. I highly recommend their services to any business looking to grow.',
        rating: 5,
        image_url: null,
        is_active: true,
        order: 3,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await tenantDb.collection('tenant_testimonials').insertMany(testimonials);
    console.log('✅ Created sample testimonials');
    
    console.log('\n🎉 Test tenant setup complete!');
    console.log('\n📋 Tenant Credentials:');
    console.log('Email: admin@mysass.com');
    console.log('Password: mysass123');
    console.log('\n🌐 Website URLs:');
    console.log('Home: http://localhost:3000/mysass');
    console.log('About: http://localhost:3000/mysass/about');
    console.log('Services: http://localhost:3000/mysass/services');
    console.log('Testimonials: http://localhost:3000/mysass/testimonials');
    console.log('Contact: http://localhost:3000/mysass/contact');
    console.log('\n💻 Dashboard URL:');
    console.log('Login: http://localhost:3000/signin');
    console.log('Dashboard: http://localhost:3000/tenant (after login)');
    
  } catch (error) {
    console.error('❌ Error creating test tenant:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('✅ MongoDB connection closed');
    }
  }
}

// Run the script
createTestTenant();