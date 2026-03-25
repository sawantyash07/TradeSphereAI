import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default function Awards() {
  const awardsList = [
    { title: 'Best Retail Broker 2024', desc: 'Recognized for top retail experience' },
    { title: 'Fintech Innovator', desc: 'Pioneer in 3D Web Trading' },
    { title: 'Security Excellence', desc: 'Top marks in trading data security' }
  ];

  return (
    <section className="section-padding text-center">
      <Container>
        <h2 className="text-gradient mb-5">Our Accolades & Awards</h2>
        <Row>
          {awardsList.map((award, idx) => (
            <Col md={4} key={idx} className="mb-4">
              <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-center animate-float" style={{ animationDelay: `${idx * 0.5}s` }}>
                <h4 className="fw-bold">{award.title}</h4>
                <p className="text-muted mb-0">{award.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
