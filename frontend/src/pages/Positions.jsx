import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Button, Modal, Form, Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import Watchlist from '../components/Watchlist';
import axios from '../api/axiosInstance';
import { FaExchangeAlt, FaShoppingCart } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const tradeSchema = yup.object().shape({
  qty: yup.number()
    .typeError('Quantity must be a number')
    .positive('Quantity must be positive')
    .integer('Quantity must be an integer')
    .required('Quantity is required'),
  price: yup.number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required')
});

export default function Positions() {
  const [positions, setPositions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [flashMessages, setFlashMessages] = useState([]);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(tradeSchema)
  });

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = () => {
    axios.get('/allPositions')
      .then(async res => {
        const formatted = res.data.map((item, idx) => ({
          id: item._id || idx,
          product: item.product,
          company: item.name,
          symbol: item.symbol,
          qty: item.qty,
          avg: item.avg,
          ltp: item.price,
          chg: item.day
        }));
        
        const updatedPositions = await Promise.all(formatted.map(async (p) => {
          try {
            const quoteRes = await axios.get(`http://localhost:3002/finnhub/quote?symbol=${p.symbol}`);
            if (quoteRes.data && quoteRes.data.c) {
              return { 
                ...p, 
                ltp: quoteRes.data.c,
                chg: `${quoteRes.data.dp > 0 ? '+' : ''}${quoteRes.data.dp.toFixed(2)}%`
              };
            }
          } catch (e) {
            console.error(`Error fetching quote for ${p.symbol}`, e);
          }
          return p;
        }));
        
        setPositions(updatedPositions);
      })
      .catch(err => console.error(err));
  };

  const showFlash = (message, variant = 'info') => {
    const id = Date.now();
    setFlashMessages(prev => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setFlashMessages(prev => prev.filter(msg => msg.id !== id));
    }, 4000);
  };

  const openTrade = (stock) => {
    setSelectedStock(stock);
    setValue('price', stock.ltp);
    setValue('qty', 1);
    setShowModal(true);
  };

  const onTradeSubmit = (data, mode) => {
    const payload = {
      name: selectedStock.company,
      symbol: selectedStock.symbol,
      qty: data.qty,
      price: data.price,
      mode: mode
    };

    axios.post('http://localhost:3002/allOrders/new', payload)
      .then(() => {
        showFlash(`Placed ${mode} order for ${data.qty} shares of ${selectedStock.symbol}`, 'success');
        setShowModal(false);
        reset();
      })
      .catch(err => {
        console.error(err);
        showFlash(`Failed to place order`, 'danger');
      });
  };

  const currentM2M = positions.reduce((acc, curr) => acc + ((curr.ltp - curr.avg) * curr.qty), 0);
  const isProfit = currentM2M >= 0;
  
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
              className="mb-2"
            >
              <Alert variant={msg.variant} className="shadow m-0 d-flex align-items-center" style={{ minWidth: '300px' }}>
                <span className="fw-bold me-2">Update:</span> {msg.message}
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

        {/* Right Side: Positions Data */}
        <Col lg={9}>
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-4 pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
              <h4 className="text-light mb-0 d-flex align-items-center gap-2">
                Positions <Badge bg="primary" pill>{positions.length}</Badge>
              </h4>
              <div className="text-end">
                <small className="text-muted d-block">Total M2M</small>
                <h4 className={`mb-0 fw-bold ${isProfit ? 'text-success' : 'text-danger'}`}>
                  {isProfit ? '+' : ''}₹ {Math.abs(currentM2M).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                </h4>
              </div>
            </div>

            {/* Positions Table via CSS Grid */}
            <div className="custom-data-grid mt-4">
              <div className="row text-muted small fw-bold text-uppercase border-bottom pb-2 mb-2 g-0" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                <div className="col-1">Product</div>
                <div className="col-3">Company (Symbol)</div>
                <div className="col-2 text-end">Qty</div>
                <div className="col-2 text-end">Avg. Price</div>
                <div className="col-2 text-end">LTP</div>
                <div className="col-1 text-end">Chg. %</div>
                <div className="col-1 text-end">M2M P&L</div>
                <div className="col-1 text-center">Action</div>
              </div>
              
              {positions.map((item, idx) => {
                const m2m = (item.ltp - item.avg) * item.qty;
                const isItemProfit = m2m >= 0;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: idx * 0.15 }}
                    key={item.id} 
                    className="row align-items-center py-3 border-bottom g-0 hover-bg" 
                    style={{ borderColor: 'rgba(255,255,255,0.05) !important', transition: 'background 0.2s' }}
                  >
                    <div className="col-1">
                      <Badge bg={item.product === 'MIS' ? 'info' : 'warning'} className="text-dark">
                        {item.product}
                      </Badge>
                    </div>
                    <div className="col-3">
                      <div className="fw-bold text-light">{item.symbol}</div>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>{item.company}</small>
                    </div>
                    <div className="col-2 text-end fw-medium text-light">{item.qty}</div>
                    <div className="col-2 text-end text-muted">₹{item.avg.toFixed(2)}</div>
                    <div className="col-2 text-end text-light fw-medium">₹{item.ltp.toFixed(2)}</div>
                    <div className={`col-1 text-end ${item.chg.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                      {item.chg}
                    </div>
                    <div className={`col-1 text-end fw-bold ${isItemProfit ? 'text-success' : 'text-danger'}`}>
                      {isItemProfit ? '+' : ''}₹{Math.abs(m2m).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                    </div>
                    <div className="col-1 text-center">
                      <Button variant="outline-primary" size="sm" className="rounded-pill px-3" onClick={() => openTrade(item)}>
                        <FaExchangeAlt />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {positions.length === 0 && (
              <div className="text-center text-muted mt-5 mb-5 py-5">
                <p>No active positions today</p>
              </div>
            )}
            
          </motion.div>
        </Col>
      </Row>

      {/* Trade Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); reset(); }} centered contentClassName="glass-panel p-0 border-0">
        <Modal.Header closeButton closeVariant="white" className="border-bottom-0 pb-0">
          <Modal.Title className="text-light d-flex align-items-center gap-2">
            <FaShoppingCart /> Trade <span className="text-info fw-bold">{selectedStock?.symbol}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="text-light small fw-bold">Qty</Form.Label>
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

            <div className="d-flex gap-3">
              <Button variant="primary" className="w-50 py-2 fw-bold" onClick={handleSubmit(data => onTradeSubmit(data, 'BUY'))}>BUY</Button>
              <Button variant="danger" className="w-50 py-2 fw-bold" onClick={handleSubmit(data => onTradeSubmit(data, 'SELL'))}>SELL</Button>
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
