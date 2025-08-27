const express = require('express');
const router = express.Router();
const { getCollection, getTenantInfo } = require('../config/database');
const { ObjectId } = require('mongodb');

const tenantInfo = getTenantInfo();

// Get all pages for this tenant
router.get('/', async (req, res) => {
  try {
    const pagesCollection = getCollection('pages');
    const pages = await pagesCollection.find({}).toArray();
    
    console.log(`📄 Fetched ${pages.length} pages for tenant: ${tenantInfo.subdomain}`);
    
    res.json({
      success: true,
      data: pages.map(page => ({
        _id: page._id,
        page_type: page.page_type,
        title: page.title,
        content: page.content,
        meta_description: page.meta_description,
        created_at: page.created_at,
        updated_at: page.updated_at
      }))
    });
  } catch (error) {
    console.error(`❌ Error fetching pages for tenant ${tenantInfo.subdomain}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pages'
    });
  }
});

// Get specific page by type
router.get('/:pageType', async (req, res) => {
  try {
    const { pageType } = req.params;
    const pagesCollection = getCollection('pages');
    const page = await pagesCollection.findOne({ page_type: pageType });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }
    
    console.log(`📄 Fetched page '${pageType}' for tenant: ${tenantInfo.subdomain}`);
    
    res.json({
      success: true,
      data: {
        _id: page._id,
        page_type: page.page_type,
        title: page.title,
        content: page.content,
        meta_description: page.meta_description,
        created_at: page.created_at,
        updated_at: page.updated_at
      }
    });
  } catch (error) {
    console.error(`❌ Error fetching page for tenant ${tenantInfo.subdomain}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch page'
    });
  }
});

// Create or update page
router.post('/:pageType', async (req, res) => {
  try {
    const { pageType } = req.params;
    const { title, content, meta_description } = req.body;
    
    const pagesCollection = getCollection('pages');
    const existingPage = await pagesCollection.findOne({ page_type: pageType });
    
    const pageData = {
      page_type: pageType,
      title,
      content,
      meta_description,
      updated_at: new Date()
    };
    
    if (existingPage) {
      // Update existing page
      await pagesCollection.updateOne(
        { page_type: pageType },
        { $set: pageData }
      );
      console.log(`✅ Updated page '${pageType}' for tenant: ${tenantInfo.subdomain}`);
    } else {
      // Create new page
      pageData.created_at = new Date();
      await pagesCollection.insertOne(pageData);
      console.log(`✅ Created page '${pageType}' for tenant: ${tenantInfo.subdomain}`);
    }
    
    res.json({
      success: true,
      message: 'Page saved successfully'
    });
  } catch (error) {
    console.error(`❌ Error saving page for tenant ${tenantInfo.subdomain}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to save page'
    });
  }
});

// Update page
router.put('/:pageType', async (req, res) => {
  try {
    const { pageType } = req.params;
    const { title, content, meta_description } = req.body;
    
    const pagesCollection = getCollection('pages');
    const existingPage = await pagesCollection.findOne({ page_type: pageType });
    
    const pageData = {
      page_type: pageType,
      title,
      content,
      meta_description,
      updated_at: new Date()
    };
    
    if (existingPage) {
      // Update existing page
      await pagesCollection.updateOne(
        { page_type: pageType },
        { $set: pageData }
      );
      console.log(`✅ Updated page '${pageType}' for tenant: ${tenantInfo.subdomain}`);
    } else {
      // Create new page
      pageData.created_at = new Date();
      await pagesCollection.insertOne(pageData);
      console.log(`✅ Created page '${pageType}' for tenant: ${tenantInfo.subdomain}`);
    }
    
    res.json({
      success: true,
      message: 'Page updated successfully'
    });
  } catch (error) {
    console.error(`❌ Error updating page for tenant ${tenantInfo.subdomain}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to update page'
    });
  }
});

// Delete page
router.delete('/:pageType', async (req, res) => {
  try {
    const { pageType } = req.params;
    const pagesCollection = getCollection('pages');
    
    const result = await pagesCollection.deleteOne({ page_type: pageType });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }
    
    console.log(`✅ Deleted page '${pageType}' for tenant: ${tenantInfo.subdomain}`);
    
    res.json({
      success: true,
      message: 'Page deleted successfully'
    });
  } catch (error) {
    console.error(`❌ Error deleting page for tenant ${tenantInfo.subdomain}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete page'
    });
  }
});

module.exports = router;