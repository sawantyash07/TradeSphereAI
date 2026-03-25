import React from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeadset, FaRegComments, FaBookOpen } from 'react-icons/fa';

const schema = yup.object().shape({
  name: yup.string().required('Name is required!'),
  email: yup.string().email('Invalid email address!').required('Email is required!'),
  subject: yup.string().required('Subject is required!'),
  message: yup.string()
    .min(20, 'Message should be at least 20 characters!')
    .required('Message is required!'),
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Support() {
  const [ticketId, setTicketId] = React.useState('');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = data => {
    // Mock API call to create ticket
    setTicketId(`TS-${Math.floor(1000 + Math.random() * 9000)}`);
    reset();
    
    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      setTicketId('');
    }, 5000);
  };

  return (
    <Container className="py-5" style={{ minHeight: '80vh' }}>
      <Row className="justify-content-center">
        <Col md={9} lg={8}>
          <motion.div 
            className="glass-panel p-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-center mb-5">
              <h2 className="text-gradient">Support & Helpdesk</h2>
              <p className="text-muted mt-2">
                Facing issues with your trades? Need account assistance? Raise a ticket and our 24/7 team will get back to you immediately.
              </p>
            </motion.div>

            <AnimatePresence>
              {ticketId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="info" className="text-center" style={{ background: 'rgba(13, 202, 240, 0.1)', border: '1px solid rgba(13, 202, 240, 0.3)', color: '#0dcaf0' }}>
                    Success! Your ticket has been created. Ticket ID: <strong>{ticketId}</strong>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants}>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="text-light">Your Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Jane Doe" 
                        className={`custom-input ${errors.name ? 'is-invalid' : ''}`}
                        {...register('name')} 
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="text-light">Email Address</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="jane@example.com" 
                        className={`custom-input ${errors.email ? 'is-invalid' : ''}`}
                        {...register('email')} 
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="text-light">Issue Subject</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="E.g., Order execution delayed" 
                    className={`custom-input ${errors.subject ? 'is-invalid' : ''}`}
                    {...register('subject')} 
                  />
                  {errors.subject && <div className="invalid-feedback">{errors.subject.message}</div>}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-light">Issue Description</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={5}
                    placeholder="Describe your issue in detail..." 
                    className={`custom-input ${errors.message ? 'is-invalid' : ''}`}
                    {...register('message')} 
                  />
                  {errors.message && <div className="invalid-feedback">{errors.message.message}</div>}
                </Form.Group>

                <div className="text-center mt-2">
                  <Button type="submit" className="btn-primary-custom px-5 py-3 w-100 fs-5 rounded-3 hover-scale">
                    Raise Support Ticket
                  </Button>
                </div>
              </Form>
            </motion.div>

            {/* Featured Section */}
            <motion.div variants={itemVariants} className="mt-5 pt-5 border-top" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
              <h4 className="text-center text-light mb-4">Why our support stands out</h4>
              <Row className="g-4">
                <Col md={4} className="text-center">
                  <div className="p-4 rounded-4 hover-scale" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease' }}>
                    <FaHeadset className="text-info mb-3" size={36} />
                    <h5 className="text-light fs-6 fw-bold">24/7 Priority Support</h5>
                    <p className="text-muted small mb-0 mt-2" style={{ lineHeight: '1.6' }}>We are always here, round the clock, ensuring your trades never halt.</p>
                  </div>
                </Col>
                <Col md={4} className="text-center">
                  <div className="p-4 rounded-4 hover-scale" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease' }}>
                    <FaRegComments className="text-info mb-3" size={36} />
                    <h5 className="text-light fs-6 fw-bold">Live Interventions</h5>
                    <p className="text-muted small mb-0 mt-2" style={{ lineHeight: '1.6' }}>Get immediate help on active trades directly from our experts.</p>
                  </div>
                </Col>
                <Col md={4} className="text-center">
                  <div className="p-4 rounded-4 hover-scale" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease' }}>
                    <FaBookOpen className="text-info mb-3" size={36} />
                    <h5 className="text-light fs-6 fw-bold">Knowledge Base</h5>
                    <p className="text-muted small mb-0 mt-2" style={{ lineHeight: '1.6' }}>Access thousands of articles and specific trading strategies.</p>
                  </div>
                </Col>
              </Row>
            </motion.div>
            
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}
