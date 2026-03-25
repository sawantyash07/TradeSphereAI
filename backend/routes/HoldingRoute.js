const express = require('express');
const router = express.Router();
const Holding = require('../models/Holding');

// GET all holdings
router.get('/', async (req, res) => {
  try {
    let holdings = await Holding.find({});
    
    // Clear data if it lacks symbol field
    if (holdings.length > 0 && !holdings[0].symbol) {
        await Holding.deleteMany({});
        holdings = [];
    }
    
    // If empty, insert dummy data automatically
    if (holdings.length === 0) {
      const dummyData = [
        { name: 'Infosys Ltd', symbol: 'INFY', qty: 50, avg: 1400.00, price: 1420.90, net: '+20.90', day: '+1.49%' },
        { name: 'Tesla Inc', symbol: 'TSLA', qty: 10, avg: 170.00, price: 175.50, net: '+15.50', day: '+0.5%' },
        { name: 'Apple Inc', symbol: 'AAPL', qty: 200, avg: 400.00, price: 415.20, net: '+15.20', day: '+1.1%' },
        { name: 'Microsoft Corp', symbol: 'MSFT', qty: 25, avg: 1600.00, price: 1560.20, net: '-39.80', day: '-0.3%' },
        { name: 'Amazon.com Inc', symbol: 'AMZN', qty: 10, avg: 2400.00, price: 2450.00, net: '+50.00', day: '+2.1%' }
      ];
      await Holding.insertMany(dummyData);
      holdings = await Holding.find({});
    }

    res.json(holdings);
  } catch (error) {
    console.error('Error fetching holdings:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// POST to add new holding
router.post('/', async (req, res) => {
  try {
    const newHolding = new Holding(req.body);
    await newHolding.save();
    res.json({ status: 'success', data: newHolding });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to add holding' });
  }
});

module.exports = router;
