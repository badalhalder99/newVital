const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const { getMongoDb } = require('../config/database');

// Helper function to get users collection
function getUsersCollection(tenantId) {
  const db = getMongoDb(tenantId);
  return db.collection('admin_users');
}

// GET /api/admin-users - Get all admin users
router.get('/', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getUsersCollection(tenant);
    
    const users = await collection
      .find({ tenant })
      .sort({ createdAt: -1 })
      .toArray();
      
    // Remove passwords from response
    const safeUsers = users.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
      
    console.log('Admin users found:', safeUsers.length);
    res.json(safeUsers);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ error: 'Failed to fetch admin users' });
  }
});

// GET /api/admin-users/:id - Get single admin user
router.get('/:id', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getUsersCollection(tenant);
    
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const user = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove password from response
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Error fetching admin user:', error);
    res.status(500).json({ error: 'Failed to fetch admin user' });
  }
});

// POST /api/admin-users - Create new admin user
router.post('/', async (req, res) => {
  try {
    const { email, password, role = 'admin', tenant = 'mysass' } = req.body;
    const collection = getUsersCollection(tenant);
    
    // Validation
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    if (!password || !password.trim()) {
      return res.status(400).json({ error: 'Password is required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    
    // Check if user already exists
    const existingUser = await collection.findOne({ 
      email: email.trim().toLowerCase(), 
      tenant 
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password.trim(), saltRounds);

    const userData = {
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: role || 'admin',
      status: 'active',
      tenant,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    };

    const result = await collection.insertOne(userData);
    const savedUser = await collection.findOne({ _id: result.insertedId });
    
    // Remove password from response
    const { password: pwd, ...safeUser } = savedUser;
    res.status(201).json(safeUser);
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ error: 'Failed to create admin user' });
  }
});

// PUT /api/admin-users/:id - Update admin user
router.put('/:id', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const { email, password, role, status } = req.body;
    const collection = getUsersCollection(tenant);
    
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const updateData = {
      updatedAt: new Date()
    };
    
    // Update email if provided
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ error: 'Please enter a valid email address' });
      }
      
      // Check if email is already taken by another user
      const existingUser = await collection.findOne({ 
        email: email.trim().toLowerCase(), 
        tenant,
        _id: { $ne: new ObjectId(req.params.id) }
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
      
      updateData.email = email.trim().toLowerCase();
    }
    
    // Update password if provided
    if (password && password.trim()) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password.trim(), saltRounds);
    }
    
    // Update role if provided
    if (role) {
      updateData.role = role;
    }
    
    // Update status if provided
    if (status) {
      updateData.status = status;
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password from response
    const { password: pwd, ...safeUser } = result;
    res.json(safeUser);
  } catch (error) {
    console.error('Error updating admin user:', error);
    res.status(500).json({ error: 'Failed to update admin user' });
  }
});

// DELETE /api/admin-users/:id - Delete admin user
router.delete('/:id', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getUsersCollection(tenant);
    
    let result;
    const idToDelete = req.params.id;
    
    // First try with ObjectId if valid
    if (ObjectId.isValid(idToDelete) && idToDelete.length === 24) {
      result = await collection.deleteOne({ _id: new ObjectId(idToDelete) });
    } else {
      result = await collection.deleteOne({ _id: idToDelete });
    }
    
    if (!result || result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    res.status(500).json({ error: 'Failed to delete admin user' });
  }
});

// POST /api/admin-users/:id/login - Update last login
router.post('/:id/login', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getUsersCollection(tenant);
    
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { lastLogin: new Date(), updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password from response
    const { password, ...safeUser } = result;
    res.json(safeUser);
  } catch (error) {
    console.error('Error updating last login:', error);
    res.status(500).json({ error: 'Failed to update last login' });
  }
});

module.exports = router;