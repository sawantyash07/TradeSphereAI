const express = require('express');
const router = express.Router();
const Position = require('../models/Position');

// GET all positions
router.get('/', async (req, res) => {
  try {
    let positions = await Position.find({});
    
    if (positions.length > 0 && !positions[0].symbol) {
        await Position.deleteMany({});
        positions = [];
    }

    // If empty, insert dummy data automatically
    if (positions.length === 0) {
      const dummyData = [
        { product: 'MIS', name: 'Nvidia Corp', symbol: 'NVDA', qty: 50, avg: 150.5, price: 180.2, net: '+20%', day: '+20%', isRealized: false },
        { product: 'MIS', name: 'Google Alpha', symbol: 'GOOGL', qty: 15, avg: 220.0, price: 195.5, net: '-10%', day: '-10%', isRealized: false }
      ];
      await Position.insertMany(dummyData);
      positions = await Position.find({});
    }

    res.json(positions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// POST to add new position
router.post('/', async (req, res) => {
  try {
    const newPosition = new Position(req.body);
    await newPosition.save();
    res.json({ status: 'success', data: newPosition });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to add position' });
  }
});

module.exports = router;
