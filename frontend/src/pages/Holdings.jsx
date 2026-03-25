import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Modal, Form, Button, Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Watchlist from '../components/Watchlist';
import axios from 'axios';
import { FaShoppingCart, FaExchangeAlt } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, ChartTooltip, Legend);

const COLORS = ['#0f766e', '#0369a1', '#b45309', '#be123c', '#4338ca', '#86198f'];

// Validation schema for an order
const orderSchema = yup.object().shape({
  qty: yup.number()
    .typeError('Quantity must be a number')
    .positive('Quantity must be greater than zero')
    .integer('Quantity must be an integer')
    .required('Quantity is required'),
  price: yup.number()
    .typeError('Price must be a number')
    .positive('Price must be greater than zero')
    .required('Price is required')
});

export default function Holdings() {
  const [holdings, setHoldings] = useState([]);
  const [hoveredChartIndex, setHoveredChartIndex] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [flashMessages, setFlashMessages] = useState([]);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(orderSchema)
  });

  useEffect(() => {
    fetchHoldings();
  }, []);

  const fetchHoldings = () => {
    axios.get('http://localhost:3002/allHoldings')
      .then(async (res) => {
        const formattedData = res.data.map((item, index) => ({
          id: item._id || index,
          name: item.name,
          symbol: item.symbol,
          qty: item.qty,
          avg: item.avg,
          ltp: item.price || 0,
          netChg: item.net || '0',
          dayChg: item.day || '0'
        }));
        
        // Fetch live prices for each holding
        const updatedHoldings = await Promise.all(formattedData.map(async (h) => {
          try {
            const quoteRes = await axios.get(`http://localhost:3002/finnhub/quote?symbol=${h.symbol}`);
            if (quoteRes.data && quoteRes.data.c) {
              return { 
                ...h, 
                ltp: quoteRes.data.c,
                dayChg: `${quoteRes.data.dp > 0 ? '+' : ''}${quoteRes.data.dp.toFixed(2)}%`,
                netChg: `${quoteRes.data.d > 0 ? '+' : ''}${quoteRes.data.d.toFixed(2)}`
              };
            }
          } catch (e) {
            console.error(`Error fetching quote for ${h.symbol}`, e);
          }
          return h;
        }));
        
        setHoldings(updatedHoldings);
      })
      .catch((err) => console.error("Error fetching holdings", err));
  };

  const showFlash = (message, variant = 'success') => {
    const id = Date.now();
    setFlashMessages(prev => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setFlashMessages(prev => prev.filter(msg => msg.id !== id));
    }, 4000);
  };

  const handleOpenOrder = (stock) => {
    setSelectedStock(stock);
    setValue('price', stock.ltp);
    setValue('qty', 1);
    setShowOrderModal(true);
  };

  const submitOrder = (data, mode) => {
    const payload = {
      name: selectedStock.name,
      symbol: selectedStock.symbol,
      qty: data.qty,
      price: data.price,
      mode: mode
    };

    axios.post('http://localhost:3002/allOrders/new', payload)
      .then(res => {
        showFlash(`Successfully placed ${mode} order for ${data.qty} shares of ${selectedStock.symbol}`, 'success');
        setShowOrderModal(false);
        reset();
      })
      .catch(err => {
        console.error("Order error", err);
        showFlash(`Failed to place ${mode} order`, 'danger');
      });
  };

  const totalInvestment = holdings.reduce((acc, curr) => acc + (curr.qty * curr.avg), 0);
  const currentValue = holdings.reduce((acc, curr) => acc + (curr.qty * curr.ltp), 0);
  const totalPnL = currentValue - totalInvestment;
  const isProfit = totalPnL >= 0;

  return (
    <Container fluid className="px-4 py-3" style={{ minHeight: '85vh', position: 'relative' }}>
      {/* Flash Messages Display */}
      <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 1050 }}>
        <AnimatePresence>
          {flashMessages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="mb-2"
            >
              <Alert variant={msg.variant} className="shadow m-0 d-flex align-items-center" style={{ minWidth: '300px' }}>
                <span className="fw-bold me-2">Notice:</span> {msg.message}
              </Alert>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Row className="g-4">
        {/* Left Side: Watchlist */}
        <Col lg={3} className="d-none d-lg-block">
          <Watchlist />
        </Col>

        {/* Right Side: Holdings Data */}
        <Col lg={9}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-4 pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
              <h4 className="text-light mb-0 d-flex align-items-center gap-2">
                Holdings <Badge bg="success" pill>{holdings.length}</Badge>
              </h4>
            </div>

            {/* Top Summaries & Chart Layout */}
            <Row className="mb-4">
              <Col md={8}>
                <Row className="g-3 h-100">
                  <Col sm={6} md={4}>
                    <div className="p-3 rounded-3 h-100" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <p className="text-muted small mb-1">Total Investment</p>
                      <h5 className="text-light">₹ {totalInvestment.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h5>
                    </div>
                  </Col>
                  <Col sm={6} md={4}>
                    <div className="p-3 rounded-3 h-100" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <p className="text-muted small mb-1">Current Value</p>
                      <h5 className="text-light">₹ {currentValue.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h5>
                    </div>
                  </Col>
                  <Col sm={12} md={4}>
                    <div className="p-3 rounded-3 h-100" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <p className="text-muted small mb-1">Total P&L</p>
                      <h5 className={isProfit ? 'text-success' : 'text-danger'}>
                        {isProfit ? '+' : ''}₹ {Math.abs(totalPnL).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                      </h5>
                    </div>
                  </Col>
                </Row>
              </Col>
              
              <Col md={4}>
                <div className="p-3 rounded-3 d-flex flex-column align-items-center justify-content-center h-100" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-muted small mb-2 text-start w-100">Asset Allocation</p>
                  <div style={{ height: '140px', width: '100%', position: 'relative' }}>
                    <Doughnut 
                      data={{
                        labels: holdings.map(h => h.symbol),
                        datasets: [{
                          data: holdings.map(h => (h.qty * h.ltp)),
                          backgroundColor: holdings.map((h, i) => 
                            hoveredChartIndex === null ? COLORS[i % COLORS.length] : 
                            hoveredChartIndex === i ? COLORS[i % COLORS.length] : 'rgba(255,255,255,0.05)'
                          ),
                          borderWidth: 0,
                          hoverOffset: 4
                        }]
                      }}
                      options={{
                        maintainAspectRatio: false,
                        cutout: '70%',
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                const idx = context.dataIndex;
                                const h = holdings[idx];
                                return `₹${context.raw.toLocaleString('en-IN', {minimumFractionDigits: 2})} (${h.qty} qty @ ₹${h.ltp})`;
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </Col>
            </Row>

            {/* Holdings Table via CSS Grid */}
            <div className="custom-data-grid mt-4">
              <div className="row text-muted small fw-bold text-uppercase border-bottom pb-2 mb-2 g-0 align-items-center" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                <div className="col-3">Company Name</div>
                <div className="col-1 text-end">Qty</div>
                <div className="col-1 text-end">Avg Cost</div>
                <div className="col-1 text-end">LTP</div>
                <div className="col-2 text-end">P&L</div>
                <div className="col-1 text-end">Net Chg</div>
                <div className="col-1 text-end">Day Chg</div>
                <div className="col-2 text-center">Action</div>
              </div>
              
              {holdings.map((item, idx) => {
                const curVal = item.qty * item.ltp;
                const pnl = curVal - (item.qty * item.avg);
                const isPnLProfit = pnl >= 0;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: idx * 0.1 }}
                    key={item.id} 
                    onClick={() => setHoveredChartIndex(hoveredChartIndex === idx ? null : idx)}
                    className="row align-items-center py-3 border-bottom g-0 hover-bg" 
                    style={{ 
                      borderColor: 'rgba(255,255,255,0.05) !important', 
                      transition: 'background 0.2s',
                      background: hoveredChartIndex === idx ? 'rgba(255,255,255,0.04)' : 'transparent'
                    }}
                  >
                    <div className="col-3">
                      <div className="fw-bold text-light">{item.symbol}</div>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>{item.name}</small>
                    </div>
                    <div className="col-1 text-end">{item.qty}</div>
                    <div className="col-1 text-end text-muted">₹{item.avg.toFixed(2)}</div>
                    <div className="col-1 text-end text-light fw-medium">₹{item.ltp.toFixed(2)}</div>
                    <div className={`col-2 text-end fw-bold ${isPnLProfit ? 'text-success' : 'text-danger'}`}>
                      {isPnLProfit ? '+' : ''}₹{Math.abs(pnl).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                    </div>
                    <div className={`col-1 text-end ${(item.netChg || '').startsWith('+') ? 'text-success' : 'text-danger'}`}>
                      {item.netChg}
                    </div>
                    <div className={`col-1 text-end ${(item.dayChg || '').startsWith('+') ? 'text-success' : 'text-danger'}`}>
                      {item.dayChg}
                    </div>
                    <div className="col-2 text-center">
                      <Button variant="outline-primary" size="sm" className="rounded-pill px-3" onClick={() => handleOpenOrder(item)}>
                        <FaExchangeAlt className="me-1" /> Trade
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </Col>
      </Row>

      {/* Order Modal */}
      <Modal show={showOrderModal} onHide={() => { setShowOrderModal(false); reset(); }} centered contentClassName="glass-panel p-0 border-0">
        <Modal.Header closeButton closeVariant="white" className="border-bottom-0 pb-0">
          <Modal.Title className="text-light d-flex align-items-center gap-2">
            <FaShoppingCart /> Place Order <span className="text-gradient fw-bold ms-2">{selectedStock?.symbol}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <div className="d-flex justify-content-between mb-4 p-2 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <span className="text-muted small">CMP: <span className="text-light fw-bold">₹{selectedStock?.ltp.toFixed(2)}</span></span>
            <span className="text-muted small">Holding: <span className="text-light fw-bold">{selectedStock?.qty} shares</span></span>
          </div>
          
          <Form id="orderForm">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="text-light small fw-bold">Quantity</Form.Label>
                  <Form.Control 
                    type="number" 
                    className={`custom-input ${errors.qty ? 'is-invalid' : ''}`}
                    {...register('qty')}
                  />
                  {errors.qty && <div className="invalid-feedback">{errors.qty.message}</div>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="text-light small fw-bold">Price (₹)</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.05"
                    className={`custom-input ${errors.price ? 'is-invalid' : ''}`}
                    {...register('price')}
                  />
                  {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-3 mt-2">
              <Button 
                variant="primary" 
                className="w-50 py-2 fw-bold" 
                onClick={handleSubmit((data) => submitOrder(data, 'BUY'))}
              >
                BUY
              </Button>
              <Button 
                variant="danger" 
                className="w-50 py-2 fw-bold" 
                onClick={handleSubmit((data) => submitOrder(data, 'SELL'))}
              >
                SELL
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <style dangerouslySetInnerHTML={{__html: `
        .hover-bg:hover { background: rgba(255,255,255,0.02) !important; cursor: pointer; }
        .custom-input { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: white; }
        .custom-input:focus { background: rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.2); color: white; box-shadow: none; }
      `}} />
    </Container>
  );
}
