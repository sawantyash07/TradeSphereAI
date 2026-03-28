const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Holding = require('../models/Holding');
const Position = require('../models/Position');
const Fund = require('../models/Fund');
const { isAuthenticated } = require('../middleware/auth');

router.post('/buy', isAuthenticated, async (req, res) => {
  const { name, symbol, qty, price, type } = req.body;
  const totalAmount = qty * price;
  const userId = req.user._id;

  try {
    let fund = await Fund.findOne({ userId });
    if (!fund) {
      return res.status(404).json({ status: 'error', message: 'User funds not found' });
    }

    if (fund.availableMargin < totalAmount) {
      return res.status(400).json({ status: 'error', message: 'Insufficient Margin' });
    }

    // 1. Create Order
    const newOrder = new Order({ userId, name, symbol, qty, price, mode: 'BUY', status: 'COMPLETE' });
    await newOrder.save();

    // 2. Update/Create Holding
    let holding = await Holding.findOne({ userId, symbol });
    if (holding) {
      const newTotalQty = holding.qty + qty;
      const newAvg = ((holding.avg * holding.qty) + (price * qty)) / newTotalQty;
      holding.qty = newTotalQty;
      holding.avg = newAvg;
      holding.price = price;
      await holding.save();
    } else {
      const newHolding = new Holding({
        userId, name, symbol, qty, avg: price, price,
        net: '0', day: '0%'
      });
      await newHolding.save();
    }

    // 3. Update/Create Position (Long Term or Intraday)
    let position = await Position.findOne({ userId, symbol, product: type || 'CNC' });
    if (position) {
      const newTotalQty = position.qty + qty;
      const newAvg = ((position.avg * position.qty) + (price * qty)) / newTotalQty;
      position.qty = newTotalQty;
      position.avg = newAvg;
      position.price = price;
      await position.save();
    } else {
      const newPos = new Position({
        userId,
        product: type || 'CNC',
        name, symbol, qty, avg: price, price,
        net: '0%', day: '0%', isRealized: false
      });
      await newPos.save();
    }

    // 4. Update Funds
    fund.availableMargin -= totalAmount;
    fund.availableCash -= totalAmount;
    fund.usedMargin += totalAmount;
    await fund.save();

    res.json({ status: 'success', message: `Bought ${qty} shares of ${symbol}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/sell', isAuthenticated, async (req, res) => {
  const { name, symbol, qty, price, type } = req.body;
  const totalAmount = qty * price;
  const userId = req.user._id;

  try {
    // 1. Check if user has holding
    let holding = await Holding.findOne({ userId, symbol });
    if (!holding || holding.qty < qty) {
      return res.status(400).json({ status: 'error', message: 'Insufficient Shares in Holding' });
    }

    // 2. Create Order
    const newOrder = new Order({ userId, name, symbol, qty, price, mode: 'SELL', status: 'COMPLETE' });
    await newOrder.save();

    // 3. Update Holding
    holding.qty -= qty;
    if (holding.qty === 0) {
      await Holding.deleteOne({ _id: holding._id });
    } else {
      await holding.save();
    }

    // 4. Update Position
    let position = await Position.findOne({ userId, symbol, product: type || 'CNC' });
    if (position) {
      position.qty -= qty;
      if (position.qty === 0) {
        await Position.deleteOne({ _id: position._id });
      } else {
        await position.save();
      }
    }

    // 5. Update Funds
    let fund = await Fund.findOne({ userId });
    if (fund) {
      fund.availableMargin += totalAmount;
      fund.availableCash += totalAmount;
      fund.usedMargin -= totalAmount;
      if (fund.usedMargin < 0) fund.usedMargin = 0;
      await fund.save();
    }

    res.json({ status: 'success', message: `Sold ${qty} shares of ${symbol}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
