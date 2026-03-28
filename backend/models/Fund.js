const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  availableMargin: { type: Number, default: 450000.00 },
  usedMargin: { type: Number, default: 120500.00 },
  availableCash: { type: Number, default: 329500.00 },
  openingBalance: { type: Number, default: 450000.00 },
  payin: { type: Number, default: 0.00 },
  payout: { type: Number, default: 0.00 },
  spanPnl: { type: Number, default: 5142.50 },
  deliveryMargin: { type: Number, default: 120500.00 }
}, { timestamps: true });

module.exports = mongoose.model('Fund', fundSchema);
