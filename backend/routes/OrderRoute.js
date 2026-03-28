const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { isAuthenticated } = require('../middleware/auth');

// GET user orders
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    let orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
    if (orders.length > 0 && !orders[0].symbol) {
        await Order.deleteMany({ userId });
        orders = [];
    }

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// POST to add new order
router.post('/new', isAuthenticated, async (req, res) => {
  try {
    const { name, symbol, qty, price, mode } = req.body;
    
    if (!name || !symbol || !qty || !price || !mode) {
      return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }

    const newOrder = new Order({
      userId: req.user._id,
      name,
      symbol,
      qty: Number(qty),
      price: Number(price),
      mode,
      status: 'COMPLETE'
    });
    
    await newOrder.save();
    res.status(201).json({ status: 'success', data: newOrder });
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ status: 'error', message: 'Failed to add order' });
  }
});

module.exports = router;
