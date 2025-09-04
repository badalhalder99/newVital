const express = require('express');
const router = express.Router();
const multer = require('multer');
const { ObjectId } = require('mongodb');
const { getMongoDb } = require('../config/database');

// Configure multer for image uploads
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

// Helper function to get products collection
function getProductsCollection(tenantId) {
  const db = getMongoDb(tenantId);
  return db.collection('products');
}

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getProductsCollection(tenant);
    
    const products = await collection
      .find({ tenant })
      .sort({ order: 1, createdAt: 1 })
      .toArray();
      
    console.log('Products found:', products.length);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getProductsCollection(tenant);
    
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    
    const product = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products - Create new product
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, category, order = 0, status = 'Active', tenant = 'mysass' } = req.body;
    const collection = getProductsCollection(tenant);
    
    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Description is required' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ error: 'Category is required' });
    }
    
    let images = [];
    if (req.files && req.files.length > 0) {
      // Convert images to base64
      images = req.files.map(file => 
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      );
    }

    const productData = {
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      images: images,
      order: parseInt(order) || 0,
      status: status || 'Active',
      tenant,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(productData);
    const savedProduct = await collection.findOne({ _id: result.insertedId });
    
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const { name, description, category, order, status } = req.body;
    const collection = getProductsCollection(tenant);
    
    console.log('Updating product with ID:', req.params.id);
    console.log('Update data received:', { name, description, category, order, status });
    
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    
    const updateData = {
      name: name?.trim(),
      description: description?.trim(),
      category: category?.trim(),
      order: parseInt(order) || 0,
      status: status || 'Active',
      updatedAt: new Date()
    };

    // Handle image update
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => 
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      );
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    console.log('Searching for product with ObjectId:', new ObjectId(req.params.id));
    console.log('Update data to be applied:', updateData);
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    console.log('Update result:', result);

    if (!result) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getProductsCollection(tenant);
    
    console.log('Attempting to delete product with ID:', req.params.id);
    
    let result;
    const idToDelete = req.params.id;
    
    // First try with ObjectId if valid
    if (ObjectId.isValid(idToDelete) && idToDelete.length === 24) {
      console.log('Trying with ObjectId...');
      result = await collection.deleteOne({ _id: new ObjectId(idToDelete) });
    } else {
      console.log('Trying with string ID...');
      result = await collection.deleteOne({ _id: idToDelete });
    }
    
    console.log('Delete result:', result);
    
    if (!result || result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
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