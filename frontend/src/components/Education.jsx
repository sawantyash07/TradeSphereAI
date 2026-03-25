import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Education() {
  return (
    <section className="section-padding py-5">
      <Container>
        <Row className="align-items-center flex-column-reverse flex-md-row">
          {/* Left Side: Image */}
          <Col md={6} className="mt-4 mt-md-0 position-relative text-center">
            <div className="glass-panel d-inline-block animate-float" style={{ padding: '0.5rem' }}>
              <img 
                src="https://images.unsplash.com/photo-1590283603385-18ff388834b5?auto=format&fit=crop&q=80&w=800" 
                alt="Trading Education" 
                className="img-fluid rounded shadow-lg"
                style={{ maxHeight: '350px', objectFit: 'cover' }}
              />
            </div>
            {/* Background glowing orb effect purely with CSS via glassmorphism */}
            <div style={{ position: 'absolute', top: '10%', left: '10%', width: '150px', height: '150px', background: 'var(--secondary-color)', filter: 'blur(80px)', zIndex: -1, opacity: 0.5 }}></div>
          </Col>
          
          {/* Right Side: Content */}
          <Col md={6} className="glass-panel">
            <h2 className="text-gradient">Master the Markets</h2>
            <p className="lead text-light mt-3">
              We provide world-class educational material for both absolute beginners and seasoned pros. From technical analysis indicators to algorithmic trading setups, we've got you covered.
            </p>
            <p className="text-muted">
              Learn dynamically. Explore interactive 3D visualizations of market structures, order flow, and technical chart patterns, all within your browser.
            </p>
            {/* Button Below Text */}
            <div className="mt-4">
              <Button as={Link} to="/support" className="btn-primary-custom">Trading Q&A</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
