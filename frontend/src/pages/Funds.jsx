import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaChevronRight } from 'react-icons/fa';
import axios from '../api/axiosInstance';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Modal, Alert, Form as BSForm, Row, Col, Badge, Button, ProgressBar, Container } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import Watchlist from '../components/Watchlist';

const amountSchema = yup.object().shape({
  amount: yup.number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .min(100, 'Minimum amount is ₹100')
    .required('Amount is required'),
});

export default function Funds() {
  const [showAdd, setShowAdd] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [fundData, setFundData] = useState(null);
  const [flashMessages, setFlashMessages] = useState([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(amountSchema)
  });

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = () => {
    axios.get('/allFunds')
      .then(res => setFundData(res.data))
      .catch(err => console.error("Error fetching funds:", err));
  };

  const showFlash = (message, variant = 'info') => {
    const id = Date.now();
    setFlashMessages(prev => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setFlashMessages(prev => prev.filter(msg => msg.id !== id));
    }, 4000);
  };

  const onDeposit = async (data) => {
    try {
      const res = await axios.post('/allFunds/deposit', { amount: data.amount });
      setFundData(prev => ({
        ...prev,
        ...res.data,
        totalClosing: prev.openingBalance + res.data.payin - res.data.payout + prev.spanPnl - prev.deliveryMargin
      }));
      showFlash(`Successfully deposited ₹${data.amount}`, 'success');
      setShowAdd(false);
      reset();
    } catch (err) {
      showFlash(err.response?.data?.message || 'Deposit failed', 'danger');
    }
  };

  const onWithdraw = async (data) => {
    try {
      const res = await axios.post('/allFunds/withdraw', { amount: data.amount });
      setFundData(prev => ({
        ...prev,
        ...res.data,
        totalClosing: prev.openingBalance + res.data.payin - res.data.payout + prev.spanPnl - prev.deliveryMargin
      }));
      showFlash(`Successfully initiated withdrawal of ₹${data.amount}`, 'success');
      setShowWithdraw(false);
      reset();
    } catch (err) {
      showFlash(err.response?.data?.message || 'Withdrawal failed', 'danger');
    }
  };

  if (!fundData) return null; // Wait for fetch

  const utilization = ((fundData.usedMargin / fundData.availableMargin) * 100).toFixed(0);
  
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

        {/* Right Side: Funds */}
        <Col lg={9}>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-5" style={{ minHeight: '600px' }}>
            
            <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <div>
                <h3 className="text-light mb-1 d-flex gap-2 align-items-center">
                  Funds <Badge bg="success" pill style={{ fontSize: '0.9rem' }}>Equity</Badge>
                </h3>
                <Typography variant="body2" className="text-muted" as="p">Instant withdrawal available up to ₹1,50,000.</Typography>
              </div>
              
              <div className="d-flex gap-3">
                <Button variant="success" className="px-4 fw-bold shadow hover-scale d-flex align-items-center gap-2" onClick={() => setShowAdd(true)}>
                  <FaPlus /> Add Funds
                </Button>
                <Button variant="outline-primary" className="px-4 fw-bold hover-scale d-flex align-items-center gap-2" onClick={() => setShowWithdraw(true)}>
                  <FaMinus /> Withdraw
                </Button>
              </div>
            </div>

            <Row className="g-5 mt-4">
              {/* Balances overview */}
              <Col md={6}>
                <div className="p-4 rounded-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <motion.div initial={{ x: -10 }} animate={{ x: 0 }}>
                    <h5 className="text-muted">Available Margin</h5>
                    <h1 className="text-gradient fw-bold display-5 mb-4">₹ {fundData.availableMargin.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h1>
                  </motion.div>

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Used Margin</span>
                    <span className="text-danger">₹ {fundData.usedMargin.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Available Cash</span>
                    <span className="text-success">₹ {fundData.availableCash.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-top" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted small">Margin Utilization</span>
                      <span className="text-muted small">{utilization}%</span>
                    </div>
                    <ProgressBar variant="danger" now={Number(utilization)} style={{ height: '6px', background: 'rgba(255,255,255,0.1)' }} />
                  </div>
                </div>
              </Col>

              {/* Fund details list */}
              <Col md={6}>
                <h5 className="text-light mb-4">Detailed Balance Breakdown</h5>
                
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <span className="text-muted">Opening Balance</span>
                    <span className="text-light fw-medium">₹ {fundData.openingBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="d-flex justify-content-between border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <span className="text-muted">Payin</span>
                    <span className="text-success fw-medium">+₹ {fundData.payin.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="d-flex justify-content-between border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <span className="text-muted">Payout</span>
                    <span className="text-danger fw-medium">-₹ {fundData.payout.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="d-flex justify-content-between border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <span className="text-muted">Span P&L</span>
                    <span className="text-success fw-medium">+₹ {fundData.spanPnl.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="d-flex justify-content-between border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <span className="text-muted">Delivery Margin</span>
                    <span className="text-danger fw-medium">-₹ {fundData.deliveryMargin.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="d-flex justify-content-between pt-2">
                    <span className="text-light fw-bold fs-5">Total Closing</span>
                    <span className="text-success fw-bold fs-5">₹ {fundData.totalClosing.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                  </div>
                </div>

              </Col>
            </Row>
          </motion.div>
        </Col>
      </Row>

      {/* Modals for Add & Withdraw */}
      <Modal show={showAdd} onHide={() => { setShowAdd(false); reset(); }} centered contentClassName="glass-panel p-0 border-0">
        <Modal.Header closeButton closeVariant="white" className="border-bottom-0 pb-0">
          <Modal.Title className="text-light">Deposit Funds</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <BSForm onSubmit={handleSubmit(onDeposit)}>
            <BSForm.Group className="mb-3">
              <BSForm.Label className="text-light">Amount (₹)</BSForm.Label>
              <BSForm.Control 
                type="number" 
                placeholder="Enter amount" 
                className={`custom-input ${errors.amount ? 'is-invalid' : ''}`}
                {...register('amount')}
              />
              {errors.amount && <div className="invalid-feedback">{errors.amount.message}</div>}
            </BSForm.Group>
            <Button type="submit" variant="success" className="w-100 py-2 fw-bold">Proceed to Deposit</Button>
          </BSForm>
        </Modal.Body>
      </Modal>

      <Modal show={showWithdraw} onHide={() => { setShowWithdraw(false); reset(); }} centered contentClassName="glass-panel p-0 border-0">
        <Modal.Header closeButton closeVariant="white" className="border-bottom-0 pb-0">
          <Modal.Title className="text-light">Withdraw Funds</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <BSForm onSubmit={handleSubmit(onWithdraw)}>
            <BSForm.Group className="mb-3">
              <BSForm.Label className="text-light">Amount (₹)</BSForm.Label>
              <BSForm.Control 
                type="number" 
                placeholder="Enter amount to withdraw" 
                className={`custom-input ${errors.amount ? 'is-invalid' : ''}`}
                {...register('amount')}
              />
              {errors.amount && <div className="invalid-feedback">{errors.amount.message}</div>}
            </BSForm.Group>
            <Button type="submit" variant="primary" className="w-100 py-2 fw-bold">Request Withdrawal</Button>
          </BSForm>
        </Modal.Body>
      </Modal>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-input { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: white; }
        .custom-input:focus { background: rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.2); color: white; box-shadow: none; }
      `}} />
    </Container>
  );
}

const Typography = ({ children, as: Component = 'span', className = '', style = {} }) => (
  <Component className={className} style={style}>{children}</Component>
);
