import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <footer className="footer pt-5 pb-3 animate-fade-in-up" style={{ animationDelay: '0.2s', position: 'relative', zIndex: 2 }}>
        <Container className="glass-panel text-muted" style={{ borderRadius: '16px', borderBottom: '1px solid var(--glass-border)' }}>
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <div className="d-flex align-items-center mb-3">
                <img src="/stock_logo.png" alt="TradeSphere Logo" width="40" height="40" className="me-2 rounded-circle hover-scale" />
                <h4 className="text-gradient m-0">TradeSphere AI</h4>
              </div>
              <p className="mt-2 small text-muted">&copy; 2026 TradeSphere AI. All Rights Reserved.</p>
            </Col>
            <Col md={3} className="mb-3 hover-links">
              <h5 className="text-white mb-3 position-relative d-inline-block">Company<div className="underline-gradient"></div></h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/about" className="text-muted text-decoration-none footer-link">About</Link></li>
                <li className="mb-2"><Link to="/products" className="text-muted text-decoration-none footer-link">Products</Link></li>
                <li className="mb-2"><Link to="/pricing" className="text-muted text-decoration-none footer-link">Pricing</Link></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none footer-link">Referral Programme</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none footer-link">Careers</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none footer-link">TradeSphere</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none footer-link">Press and media</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none footer-link">TradeSphere Cares</a></li>
              </ul>
            </Col>
            <Col md={3} className="mb-3 hover-links">
              <h5 className="text-white mb-3 position-relative d-inline-block">Support<div className="underline-gradient"></div></h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/support" className="text-muted text-decoration-none footer-link">Support portal</Link></li>
                <li className="mb-2"><Link to="/support" className="text-muted text-decoration-none footer-link">Connect us</Link></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none footer-link">List of charges</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none footer-link">Downloads and resources</a></li>
              </ul>
            </Col>
            <Col md={3} className="mb-3 hover-links">
              <h5 className="text-white mb-3 position-relative d-inline-block">Account<div className="underline-gradient"></div></h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/signup" className="text-muted text-decoration-none footer-link">Open account</Link></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none footer-link">Fund transfer</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none footer-link">100 day challenge</a></li>
              </ul>
            </Col>
          </Row>
        </Container>
        
        {/* After Footer Info Section */}
        <Container className="mt-4 animate-fade-in-up text-center" style={{ animationDelay: '0.4s' }}>
          <p className="text-muted small lh-lg px-md-5">
            TradeSphere AI is a state-of-the-art fintech platform revolutionizing the retail trading experience. By utilizing ultra-low latency infrastructure and predictive 3D market analytics, we provide an edge formerly available only to institutional investors. Investing involves market risks. Read all related documents carefully before investing. TradeSphere AI Inc is not a registered broker-dealer and does not offer financial advice.
          </p>
          <div className="mt-3 d-flex justify-content-center gap-3 flex-wrap related-links">
            <a href="#" className="text-info small text-decoration-none">Privacy Policy</a>
            <span className="text-muted">|</span>
            <a href="#" className="text-info small text-decoration-none">Terms of Service</a>
            <span className="text-muted">|</span>
            <a href="#" className="text-info small text-decoration-none">Risk Disclosures</a>
            <span className="text-muted">|</span>
            <a href="#" className="text-info small text-decoration-none">Compliance Information</a>
          </div>
        </Container>
      </footer>
    </>
  );
}
