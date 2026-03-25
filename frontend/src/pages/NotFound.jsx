import React, { useEffect, useState } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="glass-panel text-center p-5"
        style={{ maxWidth: '600px', width: '100%' }}
      >
        <h1 className="display-1 text-gradient fw-bold mb-4">404</h1>
        <h3 className="text-white mb-4">Route not found</h3>
        <Alert variant="danger" className="bg-transparent border-danger text-danger fw-bold">
          The page you are looking for does not exist or has been moved.
        </Alert>
        <p className="lead text-muted mb-4">
          Redirecting to home in {countdown} seconds...
        </p>
        <Button variant="outline-info" onClick={() => navigate('/')}>
          Return to Home Now
        </Button>
      </motion.div>
    </Container>
  );
}
