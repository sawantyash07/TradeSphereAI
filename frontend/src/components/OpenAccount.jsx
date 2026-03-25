import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function OpenAccount() {
  return (
    <section className="section-padding py-5 text-center">
      <Container>
        <div className="glass-panel py-5" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(56,189,248,0.2) 100%)' }}>
          <h2 className="display-5 fw-bold text-white mb-4">Ready to Start Trading?</h2>
          <p className="lead text-light mb-5 px-md-5">
            Open your Trading and Demat account in less than 5 minutes. Entirely paperless process. No hidden fees or software access charges. Free real-time data streaming included!
          </p>
          <Button as={Link} to="/signup" className="btn-primary-custom btn-lg">
            Open Free Account
          </Button>
          <div className="mt-3">
            <small className="text-muted">Takes ~5 minutes • Keep Aadhar/PAN ready</small>
          </div>
        </div>
      </Container>
    </section>
  );
}
