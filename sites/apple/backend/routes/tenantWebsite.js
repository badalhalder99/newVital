const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const TenantPage = require('../models/TenantPage');
const TenantSettings = require('../models/TenantSettings');
const TenantTestimonial = require('../models/TenantTestimonial');

// Get tenant website data (public route)
router.get('/:tenantName', async (req, res) => {
  try {
    const { tenantName } = req.params;
    
    // Find tenant by subdomain or name
    const tenant = await Tenant.findBySubdomain(tenantName);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    // Get tenant settings
    const settings = await TenantSettings.findOne(tenant.subdomain);
    
    // Get home page content
    const homePage = await TenantPage.findByPageType(tenant.subdomain, 'home');

    // Get testimonials
    const testimonials = await TenantTestimonial.findAll(tenant.subdomain, { limit: 10 });

    res.json({
      success: true,
      data: {
        tenant: {
          name: tenant.name,
          subdomain: tenant.subdomain
        },
        settings: settings ? TenantSettings.fromDocument(settings) : null,
        page: homePage ? TenantPage.fromDocument(homePage) : null,
        testimonials: testimonials.map(t => TenantTestimonial.fromDocument(t))
      }
    });
  } catch (error) {
    console.error('Error getting tenant website:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get specific page data
router.get('/:tenantName/:pageType', async (req, res) => {
  try {
    const { tenantName, pageType } = req.params;
    
    // Find tenant by subdomain or name
    const tenant = await Tenant.findBySubdomain(tenantName);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    // Get tenant settings
    const settings = await TenantSettings.findOne(tenant.subdomain);
    
    // Get specific page content
    const page = await TenantPage.findByPageType(tenant.subdomain, pageType);

    // For testimonial page, also get testimonials
    let testimonials = [];
    if (pageType === 'testimonials') {
      testimonials = await TenantTestimonial.findAll(tenant.subdomain);
    }

    res.json({
      success: true,
      data: {
        tenant: {
          name: tenant.name,
          subdomain: tenant.subdomain
        },
        settings: settings ? TenantSettings.fromDocument(settings) : null,
        page: page ? TenantPage.fromDocument(page) : null,
        testimonials: testimonials.map(t => TenantTestimonial.fromDocument(t))
      }
    });
  } catch (error) {
    console.error('Error getting tenant page:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Dashboard routes for managing pages (protected)
const { authenticateToken } = require('../middleware/auth');

// Get all pages for dashboard
router.get('/:tenantName/dashboard/pages', authenticateToken, async (req, res) => {
  try {
    const { tenantName } = req.params;
    
    // Verify user has access to this tenant
    const tenant = await Tenant.findBySubdomain(tenantName);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    // Check if user is authorized for this tenant
    console.log('Authorization check - User tenant_id:', req.user.tenant_id, 'Tenant _id:', tenant._id.toString());
    const userTenantId = req.user.tenant_id.toString();
    const tenantId = tenant._id.toString();
    console.log('Comparing strings - User tenant_id:', userTenantId, 'Tenant _id:', tenantId);
    if (userTenantId !== tenantId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied - User not authorized for this tenant'
      });
    }

    const pages = await TenantPage.findAll(tenant.subdomain);
    
    res.json({
      success: true,
      data: pages.map(p => TenantPage.fromDocument(p))
    });
  } catch (error) {
    console.error('Error getting pages:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update page content
router.put('/:tenantName/dashboard/pages/:pageType', authenticateToken, async (req, res) => {
  try {
    const { tenantName, pageType } = req.params;
    const { title, content, meta_description } = req.body;
    
    // Verify user has access to this tenant
    const tenant = await Tenant.findBySubdomain(tenantName);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    // Check if user is authorized for this tenant
    console.log('Authorization check - User tenant_id:', req.user.tenant_id, 'Tenant _id:', tenant._id.toString());
    const userTenantId = req.user.tenant_id.toString();
    const tenantId = tenant._id.toString();
    console.log('Comparing strings - User tenant_id:', userTenantId, 'Tenant _id:', tenantId);
    if (userTenantId !== tenantId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied - User not authorized for this tenant'
      });
    }

    // Find existing page or create new one
    let page = await TenantPage.findByPageType(tenant.subdomain, pageType);
    
    if (page) {
      // Update existing page
      const tenantPage = TenantPage.fromDocument(page);
      await tenantPage.update(tenant.subdomain, {
        title,
        content,
        meta_description
      });
    } else {
      // Create new page
      const newPage = new TenantPage({
        page_type: pageType,
        title,
        content,
        meta_description
      });
      await newPage.save(tenant.subdomain);
    }

    res.json({
      success: true,
      message: 'Page updated successfully'
    });
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update tenant settings
router.put('/:tenantName/dashboard/settings', authenticateToken, async (req, res) => {
  try {
    const { tenantName } = req.params;
    const settingsData = req.body;
    
    // Verify user has access to this tenant
    const tenant = await Tenant.findBySubdomain(tenantName);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    // Check if user is authorized for this tenant
    console.log('Authorization check - User tenant_id:', req.user.tenant_id, 'Tenant _id:', tenant._id.toString());
    const userTenantId = req.user.tenant_id.toString();
    const tenantId = tenant._id.toString();
    console.log('Comparing strings - User tenant_id:', userTenantId, 'Tenant _id:', tenantId);
    if (userTenantId !== tenantId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied - User not authorized for this tenant'
      });
    }

    // Find existing settings or create new ones
    let settings = await TenantSettings.findOne(tenant.subdomain);
    
    if (settings) {
      // Update existing settings
      const tenantSettings = TenantSettings.fromDocument(settings);
      await tenantSettings.update(tenant.subdomain, settingsData);
    } else {
      // Create new settings
      const newSettings = new TenantSettings(settingsData);
      await newSettings.save(tenant.subdomain);
    }

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;