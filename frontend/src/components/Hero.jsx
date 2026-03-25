import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero-section text-center animate-fade-in-up">
      <Container>
        <Row className="justify-content-center">
        <Col md={8} className="glass-panel">
          <h1 className="display-3 fw-bold mb-4">
            Welcome to <span className="text-gradient">TradeSphere AI</span>
          </h1>
          <p className="lead mb-4">
            Make account for trading. Experience the future of real-time stock trading. Advanced 3D analytics, interactive charts, and zero brokerages. Scroll to explore the market in a new dimension.
          </p>
          <Button as={Link} to="/signup" className="btn-primary-custom btn-lg mx-2">
            Sign up now
          </Button>
          <Button as={Link} to="/products" variant="outline-light" className="btn-lg mx-2">
            Explore Universe
          </Button>
        </Col>
        </Row>
      </Container>
    </section>
  );
}
