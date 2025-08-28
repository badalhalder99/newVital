const express = require('express');
const MySaaSContent = require('../models/MySaaSContent');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all content for current tenant
router.get('/content', authenticateToken, async (req, res) => {
  try {
    const tenantId = req.user.tenant_id?.toString();
    const content = await MySaaSContent.getAllContent(tenantId);
    
    res.json({
      success: true,
      content: content
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content'
    });
  }
});

// Get content by type
router.get('/content/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const tenantId = req.query.tenant_id || req.user?.tenant_id?.toString();
    const content = await MySaaSContent.findByType(type, tenantId);
    
    res.json({
      success: true,
      content: content
    });
  } catch (error) {
    console.error('Error fetching content by type:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content'
    });
  }
});

// Create new content
router.post('/content', authenticateToken, async (req, res) => {
  try {
    const tenantId = req.user.tenant_id?.toString();
    const contentData = {
      ...req.body,
      tenant_id: tenantId
    };
    
    const content = new MySaaSContent(contentData);
    await content.save(tenantId);
    
    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      content: content
    });
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create content'
    });
  }
});

// Update content
router.put('/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.tenant_id?.toString();
    
    const result = await MySaaSContent.updateById(id, req.body, tenantId);
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Content updated successfully'
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update content'
    });
  }
});

// Delete content
router.delete('/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.tenant_id?.toString();
    
    const result = await MySaaSContent.deleteById(id, tenantId);
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete content'
    });
  }
});

// Initialize default content for MySaaS tenant
router.post('/content/initialize', authenticateToken, async (req, res) => {
  try {
    const tenantId = req.user.tenant_id?.toString();
    
    const defaultContent = [
      {
        type: 'hero',
        title: 'Sustainable Apparel Sourcing, Seamless Global Supply',
        content: 'Your trusted partner in ethical fashion sourcing. We connect global brands with reliable, sustainable manufacturing partners, ensuring quality and responsibility throughout the supply chain.',
        meta_data: {
          subtitle: 'Harmony Sourcing',
          cta_text: 'Explore Our Services',
          cta_secondary: 'View Our Products'
        }
      },
      {
        type: 'about',
        title: 'About Harmony Sourcing',
        content: 'Founded with a vision for revolutionary sustainable fashion sourcing, Harmony Sourcing has emerged as a leading player for ethical apparel manufacturing. From concept to delivery, we provide comprehensive solutions that bridge the gap between brands and responsible manufacturers worldwide.',
        meta_data: {
          experience_years: '20+',
          focus_area: 'Sustainable Sourcing'
        }
      },
      {
        type: 'service',
        title: 'Sustainability at our core',
        content: 'Environmental responsibility in every sourcing decision, from materials to manufacturing partners.',
        meta_data: {
          icon: '🌱',
          category: 'sustainability'
        }
      },
      {
        type: 'service',
        title: 'Expertise across all apparel categories',
        content: 'From knitwear to accessories, we handle every aspect of your supply chain with specialist knowledge.',
        meta_data: {
          icon: '👥',
          category: 'expertise'
        }
      },
      {
        type: 'testimonial',
        title: 'Outstanding Partnership',
        content: 'Harmony Sourcing has been our most reliable partner — delivering consistent quality and on-time shipments.',
        meta_data: {
          author: 'Apparel Supplier Expert',
          rating: 5,
          company: 'Fashion Brand'
        }
      }
    ];
    
    for (const contentItem of defaultContent) {
      const content = new MySaaSContent({
        ...contentItem,
        tenant_id: tenantId
      });
      await content.save(tenantId);
    }
    
    res.json({
      success: true,
      message: 'Default content initialized successfully',
      count: defaultContent.length
    });
  } catch (error) {
    console.error('Error initializing content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize content'
    });
  }
});

module.exports = router;