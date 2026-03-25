const express = require('express');
const router = express.Router();
const https = require('https');

const FINNHUB_API_KEY = 'd719em1r01qot5jcjd30d719em1r01qot5jcjd3g';
const cache = {};

function fetchFinnhubQuote(symbol) {
  return new Promise((resolve, reject) => {
    https.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', err => reject(err));
  });
}

// GET quote for a symbol
router.get('/quote', async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).json({ error: 'Symbol is required' });

  // Cache for 15 seconds to avoid rate-limiting
  if (cache[symbol] && Date.now() - cache[symbol].timestamp < 15000) {
    return res.json(cache[symbol].data);
  }

  try {
    const data = await fetchFinnhubQuote(symbol);
    if (data && data.c !== undefined && data.c !== null && data.c !== 0) {
        cache[symbol] = {
            data,
            timestamp: Date.now()
        };
    }
    res.json(data);
  } catch (error) {
    console.error('Finnhub API error:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  }
});

module.exports = router;
