const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  product: { type: String, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  qty: { type: Number, required: true },
  avg: { type: Number, required: true },
  price: { type: Number, required: true },
  net: { type: String, required: true },
  day: { type: String, required: true },
  isRealized: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Position', positionSchema);
