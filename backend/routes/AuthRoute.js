const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Register
router.post('/signup', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('mobile').isLength({ min: 10 }).withMessage('Mobile must be 10 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { firstName, lastName, email, mobile, password } = req.body;
  console.log('Signup Attempt:', { firstName, lastName, email, mobile });
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ firstName, lastName, email, mobile, password: hashedPassword });
    const savedUser = await user.save();

    // Create initial funds for new user
    const Fund = require('../models/Fund');
    const newUserFund = new Fund({
        userId: savedUser._id,
        availableMargin: 1000000.00,
        availableCash: 1000000.00,
        openingBalance: 1000000.00,
        usedMargin: 0,
        payin: 0,
        payout: 0,
        spanPnl: 0,
        deliveryMargin: 0
    });
    await newUserFund.save();

    res.status(201).json({ status: 'success', message: 'Signed up successfully!' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message || 'Login failed' });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({
        status: 'success',
        user: { 
          id: user._id, 
          username: `${user.firstName} ${user.lastName}`, 
          email: user.email 
        }
      });
    });
  })(req, res, next);
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.json({ status: 'success', message: 'Logged out' });
  });
});

module.exports = router;
