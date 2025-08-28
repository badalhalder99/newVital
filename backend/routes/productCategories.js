const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getMongoDb } = require('../config/database');

// Helper function to get product categories collection
function getProductCategoriesCollection(tenantId) {
  const db = getMongoDb(tenantId);
  return db.collection('productcategories');
}

// GET /api/product-categories - Get all product categories
router.get('/', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getProductCategoriesCollection(tenant);
    
    const categories = await collection
      .find({ tenant })
      .sort({ order: 1, createdAt: 1 })
      .toArray();
      
    res.json(categories);
  } catch (error) {
    console.error('Error fetching product categories:', error);
    res.status(500).json({ error: 'Failed to fetch product categories' });
  }
});

// GET /api/product-categories/:id - Get single product category
router.get('/:id', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getProductCategoriesCollection(tenant);
    
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
    
    const category = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (!category) {
      return res.status(404).json({ error: 'Product category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error fetching product category:', error);
    res.status(500).json({ error: 'Failed to fetch product category' });
  }
});

// POST /api/product-categories - Create new product category
router.post('/', async (req, res) => {
  try {
    const { name, description, icon, order = 0, status = 'Active', tenant = 'mysass' } = req.body;
    const collection = getProductCategoriesCollection(tenant);
    
    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const categoryData = {
      name: name.trim(),
      description: description.trim(),
      icon: icon || '📦',
      order: parseInt(order) || 0,
      status: status || 'Active',
      tenant,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(categoryData);
    const savedCategory = await collection.findOne({ _id: result.insertedId });
    
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating product category:', error);
    res.status(500).json({ error: 'Failed to create product category' });
  }
});

// PUT /api/product-categories/:id - Update product category
router.put('/:id', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const { name, description, icon, order, status } = req.body;
    const collection = getProductCategoriesCollection(tenant);
    
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
    
    const updateData = {
      name: name?.trim(),
      description: description?.trim(),
      icon: icon || '📦',
      order: parseInt(order) || 0,
      status: status || 'Active',
      updatedAt: new Date()
    };

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
      return res.status(404).json({ error: 'Product category not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error updating product category:', error);
    res.status(500).json({ error: 'Failed to update product category' });
  }
});

// DELETE /api/product-categories/:id - Delete product category
router.delete('/:id', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getProductCategoriesCollection(tenant);
    
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
    
    const result = await collection.findOneAndDelete({ _id: new ObjectId(req.params.id) });
    if (!result) {
      return res.status(404).json({ error: 'Product category not found' });
    }
    res.json({ message: 'Product category deleted successfully' });
  } catch (error) {
    console.error('Error deleting product category:', error);
    res.status(500).json({ error: 'Failed to delete product category' });
  }
});

module.exports = router;