const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const passport = require('passport');
require('./passport-config');

function createApp() {
  const app = express();
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  
  app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key_123',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    proxy: true, // Necessary if backend is behind high-availability proxy like Render
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true for https (Production only)
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // none needed for cross-site cookies
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Import and use routes
  const holdingRoute = require('./routes/HoldingRoute');
  const positionRoute = require('./routes/PositionRoute');
  const orderRoute = require('./routes/OrderRoute');
  const fundRoute = require('./routes/FundRoute');
  const finnhubRoute = require('./routes/FinnhubRoute');
  const authRoute = require('./routes/AuthRoute');
  const tradeRoute = require('./routes/TradeRoute');
  
  app.use('/allHoldings', holdingRoute);
  app.use('/allPositions', positionRoute);
  app.use('/allOrders', orderRoute);
  app.use('/allFunds', fundRoute);
  app.use('/finnhub', finnhubRoute);
  app.use('/auth', authRoute);
  app.use('/trade', tradeRoute);

  app.get('/', (req, res) => {
    res.send('TradeSphere AI Backend Server is Running');
  });

  return app;
}

module.exports = createApp;
