import React, { useState } from 'react';
import { Box, Paper, Typography, Button, IconButton, useTheme, Divider } from '@mui/material';
import { ArrowDropUp, ArrowDropDown, ShowChart } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const initialWatchListData = [
  { id: 1, symbol: 'AAPL', name: 'Apple Inc', price: '0', changeNum: '0', changePct: '0%', isUp: true },
  { id: 2, symbol: 'TSLA', name: 'Tesla Inc', price: '0', changeNum: '0', changePct: '0%', isUp: false },
  { id: 3, symbol: 'GOOGL', name: 'Alphabet Inc', price: '0', changeNum: '0', changePct: '0%', isUp: true },
  { id: 4, symbol: 'MSFT', name: 'Microsoft Corp', price: '0', changeNum: '0', changePct: '0%', isUp: false },
  { id: 5, symbol: 'AMZN', name: 'Amazon.com Inc', price: '0', changeNum: '0', changePct: '0%', isUp: true },
  { id: 6, symbol: 'NVDA', name: 'Nvidia Corp', price: '0', changeNum: '0', changePct: '0%', isUp: true },
  { id: 7, symbol: 'META', name: 'Meta Platforms', price: '0', changeNum: '0', changePct: '0%', isUp: false }
];

import axios from 'axios';

export default function Watchlist({ onBuy, onSell }) {
  const [hoveredStockId, setHoveredStockId] = useState(null);
  const [watchListData, setWatchListData] = useState(initialWatchListData);

  React.useEffect(() => {
    const fetchQuotes = async () => {
        const updatedData = await Promise.all(watchListData.map(async (stock) => {
            try {
                const res = await axios.get(`http://localhost:3002/finnhub/quote?symbol=${stock.symbol}`);
                if (res.data && res.data.c) {
                    return {
                        ...stock,
                        price: res.data.c.toFixed(2),
                        changePct: `${res.data.dp > 0 ? '+' : ''}${res.data.dp.toFixed(2)}%`,
                        isUp: res.data.dp >= 0
                    };
                }
            } catch (e) {
                console.error("Error fetching watch list quote", e);
            }
            return stock;
        }));
        setWatchListData(updatedData);
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ 
      background: 'rgba(15, 23, 42, 0.6)', 
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      overflow: 'hidden',
      height: 'calc(100vh - 100px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Market Indices Header */}
      <Box sx={{ p: 2, display: 'flex', gap: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>NIFTY 50</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>22,450.20</Typography>
            <Typography variant="caption" sx={{ color: '#10b981', ml: 1 }}>+0.25%</Typography>
          </Box>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>SENSEX</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>73,850.10</Typography>
            <Typography variant="caption" sx={{ color: '#ef4444', ml: 1 }}>-0.10%</Typography>
          </Box>
        </Box>
      </Box>

      {/* Watchlist Header */}
      <Box sx={{ p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>Watchlist</Typography>
      </Box>

      {/* Watchlist Items */}
      <Box sx={{ flex: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
        {watchListData.map((stock, index) => {
          const isUp = stock.isUp;
          const color = isUp ? '#10b981' : '#ef4444';
          const isHovered = hoveredStockId === stock.id;

          return (
            <motion.div
              key={stock.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setHoveredStockId(stock.id)}
              onMouseLeave={() => setHoveredStockId(null)}
            >
              <Box sx={{ 
                p: 2, 
                borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                transition: 'background 0.2s ease',
                background: isHovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                cursor: 'pointer',
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  
                  {/* Left Side: Symbol */}
                  <Typography sx={{ color: isHovered ? '#38bdf8' : 'white', fontWeight: isHovered ? 'bold' : 'normal', transition: 'all 0.2s ease' }}>
                    {stock.symbol}
                  </Typography>

                  {/* Right Side: Price / Actions */}
                  <Box sx={{ position: 'relative', height: '28px', width: '150px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    
                    {/* Default State: Price and Change */}
                    <AnimatePresence>
                      {!isHovered && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          style={{ position: 'absolute', right: 0, display: 'flex', alignItems: 'center' }}
                        >
                          <Typography sx={{ color, fontSize: '0.8rem', display: 'flex', alignItems: 'center', mr: 1 }}>
                            {isUp ? <ArrowDropUp fontSize="small" /> : <ArrowDropDown fontSize="small" />}
                            {stock.changePct}
                          </Typography>
                          <Typography sx={{ color, fontWeight: 'bold' }}>
                            {stock.price}
                          </Typography>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Hover State: Actions */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          style={{ position: 'absolute', right: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Button 
                            variant="contained" 
                            size="small" 
                            sx={{ minWidth: '40px', p: '2px 8px', bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
                            onClick={(e) => { e.stopPropagation(); onBuy(stock); }}
                          >
                            B
                          </Button>
                          <Button 
                            variant="contained" 
                            size="small" 
                            sx={{ minWidth: '40px', p: '2px 8px', bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}
                            onClick={(e) => { e.stopPropagation(); onSell(stock); }}
                          >
                            S
                          </Button>
                          <IconButton size="small" sx={{ color: '#38bdf8' }}>
                            <ShowChart fontSize="small" />
                          </IconButton>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </Box>
                </Box>
              </Box>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
}
