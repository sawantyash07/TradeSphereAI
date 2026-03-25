import React, { useState } from 'react';
import { Container, Row, Col, Button, Badge, Alert, Modal, Form } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaPlus, FaMinus, FaChevronRight } from 'react-icons/fa';
import Watchlist from '../components/Watchlist';

import axios from 'axios';


// Validation schema for Adding Funds
const addFundsSchema = yup.object().shape({
  amount: yup.number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .min(100, 'Minimum deposit is ₹100')
    .max(1000000, 'Maximum single deposit is ₹1,000,000')
    .required('Amount is required'),
});

const withdrawSchema = yup.object().shape({
  amount: yup.number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .min(500, 'Minimum withdrawal is ₹500')
    .max(150000, 'Maximum available withdrawal is ₹150,000')
    .required('Amount is required'),
});

const AnimatedName = ({ name }) => {
  const characters = name.split("");
  return (
    <div className="d-inline-flex overflow-hidden align-items-baseline">
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: index * 0.1,
            duration: 0.5,
            ease: "easeOut"
          }}
          className="text-gradient fw-bold"
          style={{ whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [flashMessages, setFlashMessages] = useState([]);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [holdingData, setHoldingData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [fundData, setFundData] = useState({ availableMargin: 0, usedMargin: 0, availableCash: 0 });
  const [user, setUser] = useState(null);

  const refreshData = () => {
    // Fetch Holdings
    axios.get('http://localhost:3002/allHoldings')
      .then(res => {
        const formatted = res.data.map((item, idx) => ({
          id: item._id || idx,
          name: item.name,
          symbol: item.symbol,
          qty: item.qty,
          avg: item.avg,
          ltp: item.price
        }));
        setHoldingData(formatted);
      })
      .catch(err => console.error(err));

    // Fetch Positions
    axios.get('http://localhost:3002/allPositions')
      .then(res => {
        const formatted = res.data.map((item, idx) => ({
          id: item._id || idx,
          name: item.name,
          symbol: item.symbol,
          qty: item.qty,
          avg: item.avg,
          ltp: item.price,
          type: item.product
        }));
        setPositionData(formatted);
      })
      .catch(err => console.error(err));

    // Fetch Funds
    fetchFunds();
  };

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    refreshData();
  }, []);

  const fetchFunds = () => {
    axios.get('http://localhost:3002/allFunds')
      .then(res => setFundData(res.data))
      .catch(err => console.error(err));
  };

  // Form handling
  const { register: registerAdd, handleSubmit: handleAddSubmit, formState: { errors: addErrors }, reset: resetAdd } = useForm({
    resolver: yupResolver(addFundsSchema)
  });
  
  const { register: registerWithdraw, handleSubmit: handleWithdrawSubmit, formState: { errors: withdrawErrors }, reset: resetWithdraw } = useForm({
    resolver: yupResolver(withdrawSchema)
  });

  const showFlash = (message, variant = 'info') => {
    const id = Date.now();
    setFlashMessages(prev => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setFlashMessages(prev => prev.filter(msg => msg.id !== id));
    }, 4000);
  };

  const onAddFunds = async (data) => {
    try {
      await axios.post('http://localhost:3002/allFunds/deposit', { amount: data.amount });
      showFlash(`Successfully deposited ₹${data.amount}`, 'success');
      setShowAddFunds(false);
      resetAdd();
      fetchFunds(); // Refresh data
    } catch (err) {
      showFlash('Deposit failed', 'danger');
    }
  };

  const onWithdraw = async (data) => {
    try {
      await axios.post('http://localhost:3002/allFunds/withdraw', { amount: data.amount });
      showFlash(`Withdrawal request for ₹${data.amount} submitted successfully`, 'info');
      setShowWithdraw(false);
      resetWithdraw();
      fetchFunds(); // Refresh data
    } catch (err) {
      showFlash(err.response?.data?.message || 'Withdrawal failed', 'danger');
    }
  };

  const handleBuy = async (stock) => {
    try {
        const qty = prompt(`Enter quantity of ${stock.symbol} you want to Buy:`, "1");
        if (!qty || isNaN(qty) || qty <= 0) return;
        
        const res = await axios.post('http://localhost:3002/trade/buy', {
            name: stock.name,
            symbol: stock.symbol,
            qty: Number(qty),
            price: Number(stock.price),
            type: 'CNC' // Default to long-term
        });
        
        if (res.data.status === 'success') {
            showFlash(res.data.message, 'success');
            refreshData();
        }
    } catch (err) {
        showFlash(err.response?.data?.message || 'Buy Order Failed', 'danger');
    }
  };

  const handleSell = async (stock) => {
    try {
        const qty = prompt(`Enter quantity of ${stock.symbol} you want to Sell:`, "1");
        if (!qty || isNaN(qty) || qty <= 0) return;

        const res = await axios.post('http://localhost:3002/trade/sell', {
            name: stock.name,
            symbol: stock.symbol,
            qty: Number(qty),
            price: Number(stock.price),
            type: 'CNC'
        });

        if (res.data.status === 'success') {
            showFlash(res.data.message, 'info');
            refreshData();
        }
    } catch (err) {
        showFlash(err.response?.data?.message || 'Sell Order Failed', 'danger');
    }
  };

  const overallPnL = holdingData.reduce((acc, item) => acc + ((item.ltp - item.avg) * item.qty), 0);
  const isOverallProfit = overallPnL >= 0;

  const m2mPnL = positionData.reduce((acc, item) => acc + ((item.ltp - item.avg) * item.qty), 0);
  const isM2mProfit = m2mPnL >= 0;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

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
                <span className="fw-bold me-2">Notification:</span> {msg.message}
              </Alert>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Header with Interactive Name Animation */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          {user && (
            <div className="d-flex align-items-baseline gap-2 glass-panel py-2 px-4 shadow-sm border border-light-subtle" style={{ borderRadius: '50px', background: 'rgba(255,255,255,0.03)' }}>
              <h3 className="m-0 text-light fw-normal opacity-75" style={{ fontSize: '1.5rem' }}>Hello,</h3>
              <h3 className="m-0" style={{ fontSize: '1.8rem' }}><AnimatedName name={user.username} /></h3>
            </div>
          )}
        </div>
        <div className="d-flex gap-3">
          <Button 
            variant="success" 
            className="rounded-pill px-4 py-2 fw-bold shadow hover-scale d-flex align-items-center gap-2"
            onClick={() => setShowAddFunds(true)}
          >
            <FaPlus /> Add Funds
          </Button>
          <Button 
            variant="outline-light" 
            className="rounded-pill px-4 py-2 fw-bold hover-scale d-flex align-items-center gap-2"
            onClick={() => setShowWithdraw(true)}
          >
            <FaMinus /> Withdraw
          </Button>
        </div>
      </div>

      <Row className="g-4">
        {/* Left Panel: Favourite Stocks - FIXED FEEL */}
        <Col lg={3} className="d-none d-lg-block">
          <Watchlist onBuy={handleBuy} onSell={handleSell} />
        </Col>

        {/* Right Section: Equity, Holdings, Positions */}
        <Col lg={9}>
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="d-flex flex-column gap-4 pb-5"
          >
            
            {/* Equity Status */}
            <motion.div variants={itemVariants} className="glass-panel px-4 py-4 position-relative overflow-hidden">
              {/* Decorative background element */}
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--secondary-color)', opacity: 0.1, borderRadius: '50%', filter: 'blur(30px)' }} />
              
              <h4 className="text-gradient mb-4 d-flex align-items-center gap-2">
                <FaChevronRight size={16} /> Equity Margin
              </h4>
              <Row>
                <Col md={4} className="mb-3 mb-md-0">
                  <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '4px solid var(--secondary-color)' }}>
                    <p className="text-muted mb-1 text-uppercase small fw-bold">Available Margin</p>
                    <h3 className="text-light mb-0">₹ {fundData.availableMargin.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h3>
                  </div>
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                  <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '4px solid #ef4444' }}>
                    <p className="text-muted mb-1 text-uppercase small fw-bold">Used Margin</p>
                    <h3 className="text-light mb-0">₹ {fundData.usedMargin.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h3>
                  </div>
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                  <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '4px solid #10b981' }}>
                    <p className="text-muted mb-1 text-uppercase small fw-bold">Available Cash</p>
                    <h3 className="text-light mb-0">₹ {fundData.availableCash.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h3>
                  </div>
                </Col>
              </Row>
            </motion.div>

            {/* Holdings Component */}
            <motion.div variants={itemVariants} className="glass-panel p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-light mb-0 d-flex align-items-center gap-2">
                  <span className="text-gradient">Holdings</span> 
                  <Badge bg="success" pill>{holdingData.length}</Badge>
                </h4>
                <div className="text-end">
                  <small className="text-muted d-block">Overall P&L</small>
                  <span className={`fw-bold fs-5 ${isOverallProfit ? 'text-success' : 'text-danger'}`}>
                    {isOverallProfit ? '+' : ''}₹ {Math.abs(overallPnL).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                  </span>
                </div>
              </div>

              {/* Custom CSS Grid for Data Display instead of basic table */}
              <div className="custom-data-grid">
                <div className="row text-muted small fw-bold text-uppercase border-bottom pb-2 mb-2 g-0" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                  <div className="col-3">Instrument</div>
                  <div className="col-2 text-end">Qty</div>
                  <div className="col-2 text-end">Avg. Cost</div>
                  <div className="col-2 text-end">LTP</div>
                  <div className="col-3 text-end">Total P&L</div>
                </div>
                
                {holdingData.map(item => {
                  const pnl = ((item.ltp - item.avg) * item.qty);
                  const isProfit = pnl >= 0;
                  return (
                    <div key={item.id} className="row align-items-center py-3 border-bottom g-0 hover-bg" style={{ borderColor: 'rgba(255,255,255,0.05) !important', transition: 'background 0.2s' }}>
                      <div className="col-3 fw-bold text-light">
                        {item.name} <span className="text-muted small">({item.symbol})</span>
                      </div>
                      <div className="col-2 text-end">{item.qty}</div>
                      <div className="col-2 text-end">₹{item.avg.toFixed(2)}</div>
                      <div className="col-2 text-end">₹{item.ltp.toFixed(2)}</div>
                      <div className={`col-3 text-end fw-bold ${isProfit ? 'text-success' : 'text-danger'}`}>
                        {isProfit ? '+' : ''}₹{Math.abs(pnl).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Positions Component */}
            <motion.div variants={itemVariants} className="glass-panel p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-light mb-0 d-flex align-items-center gap-2">
                  <span className="text-gradient">Positions</span> 
                  <Badge bg="primary" pill>{positionData.length}</Badge>
                </h4>
                <div className="text-end">
                  <small className="text-muted d-block">M2M</small>
                  <span className={`fw-bold fs-5 ${isM2mProfit ? 'text-success' : 'text-danger'}`}>
                    {isM2mProfit ? '+' : ''}₹ {Math.abs(m2mPnL).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                  </span>
                </div>
              </div>

              <div className="custom-data-grid">
                <div className="row text-muted small fw-bold text-uppercase border-bottom pb-2 mb-2 g-0" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                  <div className="col-4">Product</div>
                  <div className="col-2 text-end">Qty</div>
                  <div className="col-2 text-end">Avg. Price</div>
                  <div className="col-2 text-end">LTP</div>
                  <div className="col-2 text-end">M2M P&L</div>
                </div>
                
                {positionData.map(item => {
                  const m2m = ((item.ltp - item.avg) * item.qty);
                  const isProfit = m2m >= 0;
                  return (
                    <div key={item.id} className="row align-items-center py-3 border-bottom g-0 hover-bg" style={{ borderColor: 'rgba(255,255,255,0.05) !important', transition: 'background 0.2s' }}>
                      <div className="col-4 d-flex align-items-center gap-2">
                        <Badge bg="secondary" style={{ fontSize: '0.65rem' }}>{item.type}</Badge>
                        <span className="fw-bold text-light text-truncate">{item.name} <span className="text-muted small">({item.symbol})</span></span>
                      </div>
                      <div className="col-2 text-end">{item.qty}</div>
                      <div className="col-2 text-end">₹{item.avg.toFixed(2)}</div>
                      <div className="col-2 text-end">₹{item.ltp.toFixed(2)}</div>
                      <div className={`col-2 text-end fw-bold ${isProfit ? 'text-success' : 'text-danger'}`}>
                        {isProfit ? '+' : ''}₹{Math.abs(m2m).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

          </motion.div>
        </Col>
      </Row>

      {/* Modals for Add Funds & Withdraw */}
      <Modal show={showAddFunds} onHide={() => { setShowAddFunds(false); resetAdd(); }} centered contentClassName="glass-panel p-0 border-0">
        <Modal.Header closeButton closeVariant="white" className="border-bottom-0 pb-0">
          <Modal.Title className="text-light">Add Funds</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <p className="text-muted small">Deposit funds instantly to your trading account via UPI or Netbanking.</p>
          <Form onSubmit={handleAddSubmit(onAddFunds)}>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Amount (₹)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Enter amount" 
                className={`custom-input ${addErrors.amount ? 'is-invalid' : ''}`}
                {...registerAdd('amount')}
              />
              {addErrors.amount && <div className="invalid-feedback">{addErrors.amount.message}</div>}
            </Form.Group>
            <Button type="submit" variant="success" className="w-100 py-2 fw-bold">Proceed to Pay</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showWithdraw} onHide={() => { setShowWithdraw(false); resetWithdraw(); }} centered contentClassName="glass-panel p-0 border-0">
        <Modal.Header closeButton closeVariant="white" className="border-bottom-0 pb-0">
          <Modal.Title className="text-light">Withdraw Funds</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <p className="text-muted small">Available for withdrawal: <strong className="text-light">₹ {fundData.availableCash.toLocaleString('en-IN', {minimumFractionDigits: 2})}</strong></p>
          <Form onSubmit={handleWithdrawSubmit(onWithdraw)}>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Amount (₹)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Enter amount to withdraw" 
                className={`custom-input ${withdrawErrors.amount ? 'is-invalid' : ''}`}
                {...registerWithdraw('amount')}
              />
              {withdrawErrors.amount && <div className="invalid-feedback">{withdrawErrors.amount.message}</div>}
            </Form.Group>
            <Button type="submit" variant="outline-light" className="w-100 py-2 fw-bold">Initiate Withdrawal</Button>
          </Form>
        </Modal.Body>
      </Modal>
      
      {/* Inline styles for hover effect on rows */}
      <style dangerouslySetInnerHTML={{__html: `
        .hover-bg:hover { background: rgba(255,255,255,0.02) !important; cursor: pointer; }
      `}} />
    </Container>
  );
}
