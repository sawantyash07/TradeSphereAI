const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET all orders
router.get('/', async (req, res) => {
  try {
    let orders = await Order.find({}).sort({ createdAt: -1 });
    
    if (orders.length > 0 && !orders[0].symbol) {
        await Order.deleteMany({});
        orders = [];
    }

    // Insert dummy data if empty
    if (orders.length === 0) {
      const dummyData = [
        { name: 'Reliance Ind', symbol: 'RELIANCE.NS', qty: 10, price: 2850.50, mode: 'BUY', status: 'COMPLETE' },
        { name: 'Tata Consultancy', symbol: 'TCS.NS', qty: 25, price: 3845.00, mode: 'SELL', status: 'COMPLETE' },
        { name: 'Apple Inc', symbol: 'AAPL', qty: 15, price: 215.00, mode: 'BUY', status: 'PENDING' }
      ];
      await Order.insertMany(dummyData);
      orders = await Order.find({}).sort({ createdAt: -1 });
    }

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// POST to add new order
router.post('/new', async (req, res) => {
  try {
    const { name, symbol, qty, price, mode } = req.body;
    
    // Validation
    if (!name || !symbol || !qty || !price || !mode) {
      return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }

    const newOrder = new Order({
      name,
      symbol,
      qty: Number(qty),
      price: Number(price),
      mode,
      status: 'COMPLETE' // Default to complete for demo
    });
    
    await newOrder.save();
    res.status(201).json({ status: 'success', data: newOrder });
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ status: 'error', message: 'Failed to add order' });
  }
});

module.exports = router;
