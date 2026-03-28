const express = require('express');
const router = express.Router();
const https = require('https');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

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

// GET symbols list from YAML
router.get('/symbols', (req, res) => {
  try {
    const yamlPath = path.join(__dirname, '../data/symbols.yaml');
    if (!fs.existsSync(yamlPath)) return res.json({ symbols: [] });
    
    const fileContent = fs.readFileSync(yamlPath, 'utf8');
    const data = yaml.load(fileContent);
    res.json(data);
  } catch (error) {
    console.error('Error reading symbols.yaml:', error);
    res.status(500).json({ error: 'Failed to read symbols data' });
  }
});

// GET daily snapshot (from YAML updated every 24h)
router.get('/daily', (req, res) => {
  try {
    const yamlPath = path.join(__dirname, '../data/stocks.yaml');
    if (!fs.existsSync(yamlPath)) return res.json({ stocks: [] });
    
    const fileContent = fs.readFileSync(yamlPath, 'utf8');
    const data = yaml.load(fileContent);
    res.json(data);
  } catch (error) {
    console.error('Error reading stocks.yaml:', error);
    res.status(500).json({ error: 'Failed to read daily data' });
  }
});

module.exports = router;
