import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Tabs, Tab } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Watchlist from '../components/Watchlist';
import axios from 'axios';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3002/allOrders')
      .then(res => {
        const formatted = res.data.map((item, idx) => {
          const timeStr = new Date(item.createdAt || Date.now()).toLocaleTimeString();
          return {
            id: item._id || idx,
            time: timeStr,
            symbol: item.symbol,
            type: item.mode,
            product: 'MIS', // Defaulted or handled on backend later
            qty: item.qty,
            price: item.price,
            status: item.status,
            message: item.status === 'REJECTED' ? 'Insufficient margin' : ''
          };
        });
        setOrders(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(o => o.status.toLowerCase() === activeTab);

  return (
    <Container fluid className="px-4 py-3" style={{ minHeight: '85vh' }}>
      <Row className="g-4">
        {/* Left Side: Watchlist */}
        <Col lg={3} className="d-none d-lg-block">
          <Watchlist />
        </Col>

        {/* Right Side: Orders */}
        <Col lg={9}>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-4 pb-5" style={{ minHeight: '600px' }}>
            <h4 className="text-light mb-4 text-gradient">Order Book</h4>

            {/* Custom Tabs using flex since Bootstrap Tabs overide css heavily some times */}
            <div className="d-flex gap-3 mb-4 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              {['all', 'open', 'complete', 'rejected'].map(tab => (
                <button
                  key={tab}
                  className={`btn btn-link text-decoration-none px-3 py-1 fw-bold ${activeTab === tab ? 'text-white border-bottom border-2 border-primary' : 'text-muted'}`}
                  onClick={() => setActiveTab(tab)}
                  style={{ borderRadius: 0 }}
                >
                  {tab.toUpperCase()}
                  {tab === 'all' && <Badge bg="secondary" className="ms-2">{orders.length}</Badge>}
                </button>
              ))}
            </div>

            {/* Orders Data Grid */}
            <div className="custom-data-grid">
              <div className="row text-muted small fw-bold text-uppercase pb-2 mb-2 g-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="col-1">Time</div>
                <div className="col-1">Type</div>
                <div className="col-2">Instrument</div>
                <div className="col-1">Product</div>
                <div className="col-1 text-end">Qty</div>
                <div className="col-2 text-end">Price</div>
                <div className="col-2 text-center">Status</div>
                <div className="col-2 text-end">Message</div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-5 mt-4">
                  <p className="text-muted">No orders found in this category.</p>
                </div>
              ) : (
                filteredOrders.map((order, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: idx * 0.1 }}
                    key={order.id} 
                    className="row align-items-center py-3 border-bottom g-0 hover-bg" 
                    style={{ borderColor: 'rgba(255,255,255,0.05) !important', transition: 'background 0.2s' }}
                  >
                    <div className="col-1 text-muted small">{order.time}</div>
                    <div className="col-1">
                      <Badge bg={order.type === 'BUY' ? 'primary' : 'danger'}>{order.type}</Badge>
                    </div>
                    <div className="col-2 fw-bold text-light">{order.symbol}</div>
                    <div className="col-1"><Badge bg="dark" text="light" border="light">{order.product}</Badge></div>
                    <div className="col-1 text-end text-light fw-medium">{order.qty}</div>
                    <div className="col-2 text-end text-light">₹{order.price.toFixed(2)}</div>
                    <div className="col-2 text-center">
                      <Badge 
                        bg={order.status === 'COMPLETE' ? 'success' : order.status === 'REJECTED' ? 'danger' : 'warning'}
                        text={order.status === 'OPEN' ? 'dark' : 'light'}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <div className="col-2 text-end small text-muted text-truncate" title={order.message || '-'}>
                      {order.message || '-'}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

          </motion.div>
        </Col>
      </Row>
      <style dangerouslySetInnerHTML={{__html: `
        .hover-bg:hover { background: rgba(255,255,255,0.02) !important; cursor: pointer; }
      `}} />
    </Container>
  );
}
