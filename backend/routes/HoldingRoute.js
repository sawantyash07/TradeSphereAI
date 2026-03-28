const express = require('express');
const router = express.Router();
const Holding = require('../models/Holding');
const { isAuthenticated } = require('../middleware/auth');

// GET user-specific holdings
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    let holdings = await Holding.find({ userId });
    
    // Clear legacy data if it lacks symbol field
    if (holdings.length > 0 && !holdings[0].symbol) {
        await Holding.deleteMany({ userId });
        holdings = [];
    }
    
    res.json(holdings);
  } catch (error) {
    console.error('Error fetching holdings:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// POST to add new holding
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const newHolding = new Holding({
        ...req.body,
        userId: req.user._id
    });
    await newHolding.save();
    res.json({ status: 'success', data: newHolding });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to add holding' });
  }
});

module.exports = router;
