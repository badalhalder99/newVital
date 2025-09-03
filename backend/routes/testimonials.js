const express = require('express');
const router = express.Router();
const multer = require('multer');
const { ObjectId } = require('mongodb');
const { getMongoDb } = require('../config/database');

// Configure multer for profile image uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Helper function to get testimonials collection
function getTestimonialsCollection(tenantId) {
  const db = getMongoDb(tenantId);
  return db.collection('testimonials');
}

// GET /api/testimonials - Get all testimonials
router.get('/', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getTestimonialsCollection(tenant);
    
    const testimonials = await collection
      .find({ tenant })
      .sort({ order: 1, createdAt: 1 })
      .toArray();
      
    console.log('Testimonials found:', testimonials.length);
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// GET /api/testimonials/:id - Get single testimonial
router.get('/:id', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getTestimonialsCollection(tenant);
    
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid testimonial ID' });
    }
    
    const testimonial = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ error: 'Failed to fetch testimonial' });
  }
});

// POST /api/testimonials - Create new testimonial
router.post('/', upload.single('profileImage'), async (req, res) => {
  try {
    const { name, company, quote, rating = 5, order = 0, tenant = 'mysass' } = req.body;
    const collection = getTestimonialsCollection(tenant);
    
    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    if (!company || !company.trim()) {
      return res.status(400).json({ error: 'Company is required' });
    }
    
    if (!quote || !quote.trim()) {
      return res.status(400).json({ error: 'Quote is required' });
    }
    
    let profileImageData = null;
    if (req.file) {
      // Convert image to base64
      profileImageData = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const testimonialData = {
      name: name.trim(),
      company: company.trim(),
      quote: quote.trim(),
      rating: parseInt(rating) || 5,
      profileImage: profileImageData,
      order: parseInt(order) || 0,
      tenant,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(testimonialData);
    const savedTestimonial = await collection.findOne({ _id: result.insertedId });
    
    res.status(201).json(savedTestimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

// PUT /api/testimonials/:id - Update testimonial
router.put('/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const { name, company, quote, rating, order } = req.body;
    const collection = getTestimonialsCollection(tenant);
    
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid testimonial ID' });
    }
    
    const updateData = {
      name: name?.trim(),
      company: company?.trim(),
      quote: quote?.trim(),
      rating: parseInt(rating) || 5,
      order: parseInt(order) || 0,
      updatedAt: new Date()
    };

    // Handle profile image update
    if (req.file) {
      updateData.profileImage = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

// DELETE /api/testimonials/:id - Delete testimonial
router.delete('/:id', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getTestimonialsCollection(tenant);
    
    let result;
    const idToDelete = req.params.id;
    
    // First try with ObjectId if valid
    if (ObjectId.isValid(idToDelete) && idToDelete.length === 24) {
      result = await collection.deleteOne({ _id: new ObjectId(idToDelete) });
    } else {
      result = await collection.deleteOne({ _id: idToDelete });
    }
    
    if (!result || result.deletedCount === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum 5MB allowed.' });
    }
  }
  next(error);
});

module.exports = router;