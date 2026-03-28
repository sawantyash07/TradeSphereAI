const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  mode: { type: String, required: true, enum: ['BUY', 'SELL'] },
  status: { type: String, default: 'COMPLETE', enum: ['PENDING', 'COMPLETE', 'CANCELLED'] }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
