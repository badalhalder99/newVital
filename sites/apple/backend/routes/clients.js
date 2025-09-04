const express = require('express');
const router = express.Router();
const multer = require('multer');
const { ObjectId } = require('mongodb');
const { getMongoDb } = require('../config/database');

// Configure multer for logo uploads
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

// Helper function to get clients collection
function getClientsCollection(tenantId) {
  const db = getMongoDb(tenantId);
  return db.collection('clients');
}

// GET /api/clients - Get all clients
router.get('/', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getClientsCollection(tenant);
    
    const clients = await collection
      .find({ tenant })
      .sort({ order: 1, createdAt: 1 })
      .toArray();
      
    console.log('Clients found:', clients.length);
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// GET /api/clients/:id - Get single client
router.get('/:id', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getClientsCollection(tenant);
    
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid client ID' });
    }
    
    const client = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// POST /api/clients - Create new client
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const { name, order = 0, status = 'Active', tenant = 'mysass' } = req.body;
    const collection = getClientsCollection(tenant);
    
    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    let logoData = null;
    if (req.file) {
      // Convert logo to base64
      logoData = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const clientData = {
      name: name.trim(),
      logo: logoData,
      order: parseInt(order) || 0,
      status: status || 'Active',
      tenant,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(clientData);
    const savedClient = await collection.findOne({ _id: result.insertedId });
    
    res.status(201).json(savedClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// PUT /api/clients/:id - Update client
router.put('/:id', upload.single('logo'), async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const { name, order, status } = req.body;
    const collection = getClientsCollection(tenant);
    
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid client ID' });
    }
    
    const updateData = {
      name: name?.trim(),
      order: parseInt(order) || 0,
      status: status || 'Active',
      updatedAt: new Date()
    };

    // Handle logo update
    if (req.file) {
      updateData.logo = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
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
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// DELETE /api/clients/:id - Delete client
router.delete('/:id', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getClientsCollection(tenant);
    
    let result;
    const idToDelete = req.params.id;
    
    // First try with ObjectId if valid
    if (ObjectId.isValid(idToDelete) && idToDelete.length === 24) {
      result = await collection.deleteOne({ _id: new ObjectId(idToDelete) });
    } else {
      result = await collection.deleteOne({ _id: idToDelete });
    }
    
    if (!result || result.deletedCount === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
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