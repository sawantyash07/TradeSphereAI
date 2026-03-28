import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Skeleton } from '@mui/material';
import axios from '../api/axiosInstance';
import { motion } from 'framer-motion';

export default function MarketSnapshot() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/finnhub/daily')
      .then(res => {
        setStocks(res.data.stocks || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch daily snapshot", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Skeleton variant="rectangular" height={100} sx={{ borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.05)' }} />;

  return (
    <Box className="glass-panel p-4 mb-4">
      <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
        Daily Market Snapshot <Chip label="24h Data" size="small" sx={{ ml: 1, color: '#38bdf8', borderColor: '#38bdf8' }} variant="outline" />
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: '4px' } }}>
        {stocks.slice(0, 8).map((stock, i) => {
            const isUp = stock.price >= stock.prevClose;
            return (
                <motion.div 
                    key={stock.symbol}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ minWidth: '150px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>{stock.symbol}</Typography>
                    <Typography variant="h6" sx={{ color: 'white', my: 0.5 }}>₹{stock.price ? stock.price.toFixed(2) : 'N/A'}</Typography>
                    <Typography variant="caption" sx={{ color: isUp ? '#10b981' : '#ef4444' }}>
                        {isUp ? '▲' : '▼'} {stock.prevClose ? (((stock.price - stock.prevClose)/stock.prevClose)*100).toFixed(2) : '0.00'}%
                    </Typography>
                </motion.div>
            )
        })}
      </Box>
    </Box>
  );
}
