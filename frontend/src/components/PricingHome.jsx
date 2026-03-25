import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PricingHome() {
  return (
    <section className="section-padding my-5">
      <Container>
        <Row className="align-items-center">
          {/* Left Side: Text */}
          <Col md={6} className="mb-4 mb-md-0 glass-panel">
            <h2 className="text-gradient mb-3">Transparent Pricing & Zero Brokerage</h2>
            <p className="lead">
              Our fee structure is simple: no hidden charges, complete transparency. We believe in empowering every retail trader.
            </p>
            <p className="text-muted">
              Whether you are an investor building wealth or an active trader making frequent transactions, our pricing works perfectly for you.
            </p>
          </Col>
          
          {/* Right Side: Pricing Cards */}
          <Col md={6}>
            <Row>
              <Col xs={6}>
                <Card className="glass-panel text-center animate-float h-100 p-2" bg="transparent" border="0">
                  <Card.Body>
                    <Card.Title className="fw-bold mb-3 text-white">Equity Delivery</Card.Title>
                    <h3 className="display-5 text-gradient">₹0</h3>
                    <p className="text-muted mt-3 mb-0 small">No hidden charges on delivery trades.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6}>
                <Card className="glass-panel text-center animate-float h-100 p-2" style={{ animationDelay: '0.5s' }} bg="transparent" border="0">
                  <Card.Body>
                    <Card.Title className="fw-bold mb-3 text-white">Intraday / F&O</Card.Title>
                    <h3 className="display-5 text-gradient">₹20</h3>
                    <p className="text-muted mt-3 mb-0 small">Flat ₹20 or 0.03% (whichever is lower).</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {/* Related text below pricing cards */}
            <div className="mt-4 text-center">
              <p className="text-light mb-2">Trade securely. All transactions governed by regulators.</p>
              <Link to="/pricing" className="text-decoration-underline text-info">View Detailed Pricing Plans</Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
