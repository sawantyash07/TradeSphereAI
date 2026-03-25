const mongoose = require('mongoose');
const Holding = require('./models/Holding');
const Position = require('./models/Position');
const Order = require('./models/Order');

async function resetAndSeed() {
  try {
    await mongoose.connect('mongodb+srv://Yash:Yash%402026@tradesphereai.znon3io.mongodb.net/TradeSphereAI?retryWrites=true&w=majority&appName=TradeSphereAI');
    console.log('Connected to MongoDB for seeding');

    await Holding.deleteMany({});
    await Position.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing data');

    const holdings = [
      { name: 'Infosys Ltd', symbol: 'INFY', qty: 50, avg: 1400.00, price: 1420.90, net: '+20.90', day: '+1.49%' },
      { name: 'Tesla Inc', symbol: 'TSLA', qty: 10, avg: 170.00, price: 175.50, net: '+15.50', day: '+0.5%' },
      { name: 'Apple Inc', symbol: 'AAPL', qty: 200, avg: 400.00, price: 415.20, net: '+15.20', day: '+1.1%' },
      { name: 'Microsoft Corp', symbol: 'MSFT', qty: 25, avg: 1600.00, price: 1560.20, net: '-39.80', day: '-0.3%' },
      { name: 'Amazon.com Inc', symbol: 'AMZN', qty: 10, avg: 2400.00, price: 2450.00, net: '+50.00', day: '+2.1%' }
    ];
    await Holding.insertMany(holdings);

    const positions = [
      { product: 'MIS', name: 'Nvidia Corp', symbol: 'NVDA', qty: 50, avg: 150.5, price: 180.2, net: '+20%', day: '+20%', isRealized: false },
      { product: 'MIS', name: 'Google Alpha', symbol: 'GOOGL', qty: 15, avg: 220.0, price: 195.5, net: '-10%', day: '-10%', isRealized: false }
    ];
    await Position.insertMany(positions);

    const orders = [
      { name: 'Reliance Ind', symbol: 'RELIANCE.NS', qty: 10, price: 2850.50, mode: 'BUY', status: 'COMPLETE' },
      { name: 'Tata Consultancy', symbol: 'TCS.NS', qty: 25, price: 3845.00, mode: 'SELL', status: 'COMPLETE' },
      { name: 'Apple Inc', symbol: 'AAPL', qty: 15, price: 215.00, mode: 'BUY', status: 'PENDING' }
    ];
    await Order.insertMany(orders);

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

resetAndSeed();
