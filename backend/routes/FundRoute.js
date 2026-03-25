const express = require('express');
const router = express.Router();
const Fund = require('../models/Fund');

// GET funds
router.get('/', async (req, res) => {
  try {
    let fund = await Fund.findOne({});
    
    // Seed initial fund data if not exists
    if (!fund) {
      fund = new Fund();
      await fund.save();
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
router.post('/deposit', async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

  try {
    let fund = await Fund.findOne({});
    if (!fund) fund = new Fund();

    fund.availableMargin += amount;
    fund.availableCash += amount;
    fund.payin += amount;
    
    await fund.save();
    res.json(fund);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST withdraw
router.post('/withdraw', async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

  try {
    let fund = await Fund.findOne({});
    if (!fund) fund = new Fund();

    if (fund.availableCash < amount) {
      return res.status(400).json({ message: 'Insufficient funds for withdrawal' });
    }

    fund.availableMargin -= amount;
    fund.availableCash -= amount;
    fund.payout += amount;
    
    await fund.save();
    res.json(fund);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
