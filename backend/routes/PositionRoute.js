const express = require('express');
const router = express.Router();
const Position = require('../models/Position');
const { isAuthenticated } = require('../middleware/auth');

// GET user-specific positions
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    let positions = await Position.find({ userId });
    
    if (positions.length > 0 && !positions[0].symbol) {
        await Position.deleteMany({ userId });
        positions = [];
    }

    res.json(positions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// POST to add new position
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const newPosition = new Position({
        ...req.body,
        userId: req.user._id
    });
    await newPosition.save();
    res.json({ status: 'success', data: newPosition });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to add position' });
  }
});

module.exports = router;
