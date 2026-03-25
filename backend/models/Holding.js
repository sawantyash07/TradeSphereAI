const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  qty: { type: Number, required: true },
  avg: { type: Number, required: true },
  price: { type: Number, required: true },
  net: { type: String, required: true },
  day: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Holding', holdingSchema);
