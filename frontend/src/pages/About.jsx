import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

export default function About() {
  return (
    <Container className="py-5" style={{ minHeight: '80vh' }}>
      <div className="text-center mb-5 animate-fade-in-up">
        <h2 className="text-gradient display-4 fw-bold">About TradeSphere AI</h2>
      </div>

      <Row className="align-items-center">
        {/* Left Side: Photo and Details */}
        <Col md={4} className="mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Card className="glass-panel text-center h-100 border-0 bg-transparent">
            <Card.Img 
              variant="top" 
              src="/yash_photo.jpg" 
              className="rounded-circle mx-auto my-3 animate-float" 
              style={{ width: '200px', height: '200px', objectFit: 'cover', border: '4px solid var(--secondary-color)' }} 
              alt="Yash Sawant"
            />
            <Card.Body>
              <Card.Title className="fw-bold text-white fs-3">Yash Sawant</Card.Title>
              <Card.Subtitle className="mb-3 text-secondary fs-5">Co-founder, CEO</Card.Subtitle>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Side: Company Information */}
        <Col md={8} className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="glass-panel p-4 p-md-5">
            <h3 className="text-white mb-4">Our Vision & Mission</h3>
            <p className="lead text-light mb-4" style={{ lineHeight: '1.8' }}>
              TradeSphere AI is fundamentally transforming the retail trading landscape. Our mission is to democratize advanced trading tools by integrating cutting-edge 3D visualization technology with ultra-low latency data pipelines. 
            </p>
            <p className="text-muted" style={{ lineHeight: '1.8' }}>
              Previously, the predictive algorithms and high-frequency infrastructure we utilize were exclusively available to institutional investors and massive hedge funds. Today, we deliver these state-of-the-art analytical engines directly to your fingertips in an intuitive, beautifully designed interface. Whether you are exploring global equities, derivatives, or cryptos, TradeSphere AI empowers you to experience the market from an entirely new dimension.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
