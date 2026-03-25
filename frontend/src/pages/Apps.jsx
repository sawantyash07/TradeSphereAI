import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Watchlist from '../components/Watchlist';
import { Assessment, Timeline, Shield } from '@mui/icons-material';

const dummyApps = [
  { id: 1, name: 'TradeSmart Algos', desc: 'Pre-built algorithmic strategies tailored for Nifty & BankNifty.', icon: <Assessment fontSize="large" sx={{ color: '#38bdf8' }} /> },
  { id: 2, name: 'Portfolio Analyzer', desc: 'Analyze deep asset allocations, overlaps, and historical risk.', icon: <Timeline fontSize="large" sx={{ color: '#10b981' }} /> },
  { id: 3, name: 'Risk Management Pro', desc: 'Auto-trailing stop losses and kill-switch features.', icon: <Shield fontSize="large" sx={{ color: '#f59e0b' }} /> }
];

export default function Apps() {
  return (
    <Container fluid className="px-4 py-3" style={{ minHeight: '85vh' }}>
      <Row className="g-4">
        {/* Left Side: Watchlist */}
        <Col lg={3} className="d-none d-lg-block">
          <Watchlist />
        </Col>

        {/* Right Side: Apps */}
        <Col lg={9}>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-5" style={{ minHeight: '600px' }}>
            <h3 className="text-light mb-4">Discover Integrated Apps</h3>
            <p className="text-muted mb-5">Connect TradeSphere AI with our verified ecosystem partners to augment your trading capabilities.</p>

            <Row className="g-4 mt-2">
              {dummyApps.map((app, idx) => (
                <Col md={4} key={app.id}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: idx * 0.15 }}
                    whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                    className="p-4 rounded-4 h-100 d-flex flex-column align-items-start"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <div className="mb-3 p-3 rounded-circle" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {app.icon}
                    </div>
                    <h5 className="text-light fw-bold">{app.name}</h5>
                    <p className="text-muted small flex-grow-1">{app.desc}</p>
                    <Button variant="outline-light" size="sm" className="mt-3 w-100 rounded-pill hover-scale fw-bold">Connect App</Button>
                  </motion.div>
                </Col>
              ))}
            </Row>

          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}
