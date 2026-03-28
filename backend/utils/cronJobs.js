const cron = require('node-cron');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const https = require('https');

const FINNHUB_API_KEY = 'd719em1r01qot5jcjd30d719em1r01qot5jcjd3g';

const SYMBOLS_PATH = path.join(__dirname, '../data/symbols.yaml');
const STOCKS_PATH = path.join(__dirname, '../data/stocks.yaml');

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

async function updateStockData() {
  console.log('Daily Stock Data Update: Starting...');
  try {
    const symbolsFile = fs.readFileSync(SYMBOLS_PATH, 'utf8');
    const { symbols } = yaml.load(symbolsFile);
    
    const stockResults = [];
    for (const symbol of symbols) {
      try {
        const data = await fetchFinnhubQuote(symbol);
        // data.c is Current Price, data.pc is Previous Close, etc.
        stockResults.push({
          symbol,
          price: data.c,
          high: data.h,
          low: data.l,
          open: data.o,
          prevClose: data.pc,
          timestamp: new Date().toISOString()
        });
        // Avoid aggressive rate limiting
        await new Promise(r => setTimeout(r, 100));
      } catch (err) {
        console.error(`Error fetching ${symbol}:`, err.message);
      }
    }

    const yamlOutput = yaml.dump({ stocks: stockResults });
    fs.writeFileSync(STOCKS_PATH, yamlOutput, 'utf8');
    console.log('Daily Stock Data Update: Completed successfully.');
  } catch (error) {
    console.error('Stock Data Update Error:', error);
  }
}

// Schedule: 00:00 every day (24 hours)
const initCronJobs = () => {
  cron.schedule('0 0 * * *', () => {
    updateStockData();
  });
  
  // Also run once on startup to ensure data exists
  updateStockData();
};

module.exports = { initCronJobs, updateStockData };
