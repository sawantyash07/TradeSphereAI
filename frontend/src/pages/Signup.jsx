import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../components/Loader';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required!'),
  lastName: yup.string().required('Last name is required!'),
  email: yup.string().email('Invalid email!').required('Email required!'),
  mobile: yup.string().matches(/^[0-9]{10}$/, '10 digit mobile number!').required('Mobile required!'),
  password: yup.string()
    .min(6, 'Min 6 characters!')
    .required('Password required!'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match!')
    .required('Confirm password!')
});

export default function Signup() {
  const [flashMessages, setFlashMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  const showFlash = (message, variant = 'info') => {
    const id = Date.now();
    setFlashMessages(prev => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setFlashMessages(prev => prev.filter(msg => msg.id !== id));
    }, 4000);
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

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
      const res = await axios.post('http://localhost:3002/auth/signup', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile,
        password: data.password
      });

      if (res.data.status === 'success') {
        showFlash('Account created! Redirecting to login...', 'success');
        setTimeout(() => {
          setLoading(false);
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setLoading(false);
      showFlash(err.response?.data?.message || 'Signup failed', 'danger');
    }
  };

  return (
    <Container className="py-5" style={{ minHeight: '80vh' }}>
      <AnimatePresence>
        {loading && <Loader text="Creating Account..." />}
      </AnimatePresence>
      {/* Interactive Notifications */}
      <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 1050 }}>
        <AnimatePresence>
          {flashMessages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="mb-2"
            >
              <Alert variant={msg.variant} className="shadow glass-panel border-0 text-white">
                <span className="fw-bold">Registration:</span> {msg.message}
              </Alert>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Row className="justify-content-center">
        <Col md={8}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel mt-5 p-5"
          >
            <h2 className="text-center text-gradient mb-4">Create Your Account</h2>
            
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light">First Name</Form.Label>
                    <Form.Control 
                      className={`custom-input ${errors.firstName ? 'is-invalid' : ''}`}
                      {...register('firstName')} 
                    />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName.message}</div>}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light">Last Name</Form.Label>
                    <Form.Control 
                      className={`custom-input ${errors.lastName ? 'is-invalid' : ''}`}
                      {...register('lastName')} 
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName.message}</div>}
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="text-light">Email Address</Form.Label>
                <Form.Control 
                  type="email" 
                  className={`custom-input ${errors.email ? 'is-invalid' : ''}`}
                  {...register('email')} 
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-light">Mobile Number</Form.Label>
                <Form.Control 
                  type="text" 
                  className={`custom-input ${errors.mobile ? 'is-invalid' : ''}`}
                  {...register('mobile')} 
                />
                {errors.mobile && <div className="invalid-feedback">{errors.mobile.message}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-light">Password</Form.Label>
                <Form.Control 
                  type="password" 
                  className={`custom-input ${errors.password ? 'is-invalid' : ''}`}
                  {...register('password')} 
                />
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="text-light">Confirm Password</Form.Label>
                <Form.Control 
                  type="password" 
                  className={`custom-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  {...register('confirmPassword')} 
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
              </Form.Group>

              <div className="d-grid mt-4">
                <Button type="submit" className="btn-primary-custom btn-lg">
                  Submit Registration
                </Button>
              </div>
            </Form>
            
            <div className="text-center mt-4">
              <p className="text-light-50">
                Already have an account? {' '}
                <span 
                  onClick={() => handleRedirect('/login')} 
                  className="text-info fw-bold cursor-pointer hover-underline"
                  style={{ cursor: 'pointer' }}
                >
                  Log in
                </span>
              </p>
            </div>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}
