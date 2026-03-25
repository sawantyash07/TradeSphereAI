import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../components/Loader';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email address!').required('Email/Username is required!'),
  password: yup.string().required('Password is required!'),
});

export default function Login() {
  const [flashMessages, setFlashMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const showFlash = (message, variant = 'danger') => {
    const id = Date.now();
    setFlashMessages(prev => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setFlashMessages(prev => prev.filter(msg => msg.id !== id));
    }, 4000);
  };

  const handleRedirect = (path) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(path);
    }, 800);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', {
        email: data.email,
        password: data.password
      });

      if (res.data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        // Small delay for the modern feel
        setTimeout(() => {
          setLoading(false);
          navigate('/dashboard');
          window.location.reload(); 
        }, 800);
      }
    } catch (err) {
      setLoading(false);
      showFlash(err.response?.data?.message || 'Login failed. Check credentials.', 'danger');
    }
  };

  return (
    <Container className="py-5" style={{ minHeight: '80vh' }}>
      <AnimatePresence>
        {loading && <Loader text="Verifying Identity..." />}
      </AnimatePresence>
      {/* Interactive Notifications */}
      <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 1050 }}>
        <AnimatePresence>
          {flashMessages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20 }}
              className="mb-2"
            >
              <Alert variant={msg.variant} className="shadow-lg border-0 glass-panel py-3 px-4 text-white">
                <span className="fw-bold">Login Alert:</span> {msg.message}
              </Alert>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Row className="justify-content-center">
        <Col md={6}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel mt-5 p-5"
          >
            <h2 className="text-center text-gradient mb-4">Login to TradeSphere</h2>
            
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label className="text-light">Username / Email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter your email" 
                  className={`custom-input ${errors.email ? 'is-invalid' : ''}`}
                  {...register('email')} 
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="text-light">Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="••••••••" 
                  className={`custom-input ${errors.password ? 'is-invalid' : ''}`}
                  {...register('password')} 
                />
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </Form.Group>

              <div className="d-grid mt-4">
                <Button type="submit" className="btn-primary-custom btn-lg">
                  Login
                </Button>
              </div>
            </Form>
            <div className="text-center mt-4">
              <p className="text-light-50">
                New user? {' '}
                <span 
                  onClick={() => handleRedirect('/signup')} 
                  className="text-info fw-bold cursor-pointer hover-underline"
                  style={{ cursor: 'pointer' }}
                >
                  Register here
                </span>
              </p>
            </div>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}
