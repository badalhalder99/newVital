const express = require('express');
const router = express.Router();
const { getCollection, getTenantInfo } = require('../config/database');

const tenantInfo = getTenantInfo();

// Get tenant settings
router.get('/', async (req, res) => {
  try {
    const settingsCollection = getCollection('settings');
    const settings = await settingsCollection.findOne({});
    
    console.log(`⚙️  Fetched settings for tenant: ${tenantInfo.subdomain}`);
    
    res.json({
      success: true,
      data: settings || {
        site_name: tenantInfo.subdomain,
        site_tagline: '',
        primary_color: '#10b981',
        secondary_color: '#059669',
        contact_email: '',
        contact_phone: '',
        address: '',
        social_media: {},
        meta_keywords: '',
        meta_description: ''
      }
    });
  } catch (error) {
    console.error(`❌ Error fetching settings for tenant ${tenantInfo.subdomain}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

// Update tenant settings
router.put('/', async (req, res) => {
  try {
    const settingsData = req.body;
    settingsData.updated_at = new Date();
    
    const settingsCollection = getCollection('settings');
    const existingSettings = await settingsCollection.findOne({});
    
    if (existingSettings) {
      // Update existing settings
      await settingsCollection.updateOne(
        { _id: existingSettings._id },
        { $set: settingsData }
      );
      console.log(`✅ Updated settings for tenant: ${tenantInfo.subdomain}`);
    } else {
      // Create new settings
      settingsData.created_at = new Date();
      await settingsCollection.insertOne(settingsData);
      console.log(`✅ Created settings for tenant: ${tenantInfo.subdomain}`);
    }
    
    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error(`❌ Error updating settings for tenant ${tenantInfo.subdomain}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
});

// Get public website data (for frontend display)
router.get('/public', async (req, res) => {
  try {
    const settingsCollection = getCollection('settings');
    const pagesCollection = getCollection('pages');
    
    const [settings, homePage] = await Promise.all([
      settingsCollection.findOne({}),
      pagesCollection.findOne({ page_type: 'home' })
    ]);
    
    console.log(`🌐 Fetched public data for tenant: ${tenantInfo.subdomain}`);
    
    res.json({
      success: true,
      data: {
        tenant: {
          name: tenantInfo.subdomain,
          subdomain: tenantInfo.subdomain
        },
        settings: settings || {},
        page: homePage || null
      }
    });
  } catch (error) {
    console.error(`❌ Error fetching public data for tenant ${tenantInfo.subdomain}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public data'
    });
  }
});

module.exports = router;