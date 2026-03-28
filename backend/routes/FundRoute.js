const express = require('express');
const router = express.Router();
const Fund = require('../models/Fund');
const Transaction = require('../models/Transaction');
const { isAuthenticated } = require('../middleware/auth');

// GET history of transactions
router.get('/history', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// GET user-specific funds
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    let fund = await Fund.findOne({ userId });
    
    if (!fund) {
      return res.status(404).json({ status: 'error', message: 'Funds not initialized for user' });
    }

    const totalClosing = fund.openingBalance + fund.payin - fund.payout + fund.spanPnl - fund.deliveryMargin;

    res.json({
      ...fund.toObject(),
      totalClosing
    });
  } catch (error) {
    console.error('Error fetching funds:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// POST deposit
router.post('/deposit', isAuthenticated, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

  try {
    const userId = req.user._id;
    let fund = await Fund.findOne({ userId });
    if (!fund) return res.status(404).json({ message: 'Fund record not found' });

    fund.availableMargin += amount;
    fund.availableCash += amount;
    fund.payin += amount;
    
    await fund.save();

    // Record Transaction
    const tx = new Transaction({ userId, type: 'DEPOSIT', amount });
    await tx.save();

    res.json(fund);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST withdraw
router.post('/withdraw', isAuthenticated, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

  try {
    const userId = req.user._id;
    let fund = await Fund.findOne({ userId });
    if (!fund) return res.status(404).json({ message: 'Fund record not found' });

    if (fund.availableCash < amount) {
      return res.status(400).json({ message: 'Insufficient funds for withdrawal' });
    }

    fund.availableMargin -= amount;
    fund.availableCash -= amount;
    fund.payout += amount;
    
    await fund.save();

    // Record Transaction
    const tx = new Transaction({ userId, type: 'WITHDRAWAL', amount });
    await tx.save();

    res.json(fund);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
