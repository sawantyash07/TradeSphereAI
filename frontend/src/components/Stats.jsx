import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Stats() {
  return (
    <section className="section-padding py-5 border-top border-secondary">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="mb-4 mb-md-0 glass-panel">
            <h2 className="text-gradient">Real-Time Market Stats</h2>
            <p className="lead mt-3">
              Track thousands of stocks across global markets with millisecond-accuracy.
              Our platform provides institutional-grade data straight to your browser.
            </p>
            <ul className="list-unstyled mt-4" style={{ lineHeight: '2.5' }}>
              <li>✓ <strong>100M+</strong> Daily Trades Processed</li>
              <li>✓ <strong>5,000+</strong> Assets Available</li>
              <li>✓ <strong>0.1ms</strong> Trade Execution latency</li>
            </ul>
          </Col>
          <Col md={6} className="text-center">
            {/* Using a placeholder for the stats image */}
            <div className="glass-panel d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
              <img 
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1000" 
                alt="Stock Stats" 
                className="img-fluid rounded mb-4" 
                style={{ maxHeight: '200px', objectFit: 'cover' }}
              />
              <div className="d-flex gap-3">
                <Button variant="outline-primary" as={Link} to="/products">Explore More</Button>
                <Button className="btn-primary-custom" as={Link} to="/signup">Try Demo</Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
