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

// Helper function to get team members collection
function getTeamMembersCollection(tenantId) {
  const db = getMongoDb(tenantId);
  return db.collection('teammembers');
}

// GET /api/team-members - Get all team members
router.get('/', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getTeamMembersCollection(tenant);
    
    const teamMembers = await collection
      .find({ tenant })
      .sort({ order: 1, createdAt: 1 })
      .toArray();
      
    console.log('Team members found:', teamMembers.length);
    teamMembers.forEach((member, index) => {
      console.log(`Member ${index}: ID = ${member._id} (type: ${typeof member._id})`);
    });
      
    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// GET /api/team-members/:id - Get single team member
router.get('/:id', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getTeamMembersCollection(tenant);
    
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid team member ID' });
    }
    
    const teamMember = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (!teamMember) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.json(teamMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ error: 'Failed to fetch team member' });
  }
});

// POST /api/team-members - Create new team member
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, position, description, order = 0, status = 'Active', tenant = 'mysass' } = req.body;
    const collection = getTeamMembersCollection(tenant);
    
    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!position || !position.trim()) {
      return res.status(400).json({ error: 'Position is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Description is required' });
    }
    
    let imageData = null;
    if (req.file) {
      // Convert image to base64
      imageData = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const teamMemberData = {
      name: name.trim(),
      position: position.trim(),
      description: description.trim(),
      image: imageData,
      order: parseInt(order) || 0,
      status: status || 'Active',
      tenant,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(teamMemberData);
    const savedTeamMember = await collection.findOne({ _id: result.insertedId });
    
    res.status(201).json(savedTeamMember);
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

// PUT /api/team-members/:id - Update team member
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const { name, position, description, order, status } = req.body;
    const collection = getTeamMembersCollection(tenant);
    
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid team member ID' });
    }
    
    const updateData = {
      name: name?.trim(),
      position: position?.trim(),
      description: description?.trim(),
      order: parseInt(order) || 0,
      status: status || 'Active',
      updatedAt: new Date()
    };

    // Handle image update
    if (req.file) {
      updateData.image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
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
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

// DELETE /api/team-members/:id - Delete team member
router.delete('/:id', async (req, res) => {
  try {
    const { tenant = 'mysass' } = req.query;
    const collection = getTeamMembersCollection(tenant);
    
    console.log('Attempting to delete team member with ID:', req.params.id);
    console.log('ObjectId.isValid check:', ObjectId.isValid(req.params.id));
    
    // Try multiple approaches for different ID formats
    let result;
    const idToDelete = req.params.id;
    
    // First try with ObjectId if valid
    if (ObjectId.isValid(idToDelete) && idToDelete.length === 24) {
      console.log('Trying with ObjectId...');
      result = await collection.deleteOne({ _id: new ObjectId(idToDelete) });
    } else {
      console.log('Trying with string ID...');
      // Try as string ID
      result = await collection.deleteOne({ _id: idToDelete });
    }
    
    console.log('Delete result:', result);
    
    if (!result || result.deletedCount === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
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