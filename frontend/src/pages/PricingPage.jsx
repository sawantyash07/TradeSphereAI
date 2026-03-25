import React from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BsArrowRight, BsCheckCircleFill } from 'react-icons/bs';
import PricingHome from '../components/PricingHome'; // reuse the component

export default function PricingPage() {
  return (
    <Container className="py-5">
      <h2 className="text-center text-gradient mb-4 display-4 fw-bold">Detailed Pricing & Brokerage</h2>
      
      {/* Reusing the homepage pricing section for consistency */}
      <PricingHome />

      <div className="glass-panel mt-5 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <h3 className="text-white mb-4">Brokerage Charges Config</h3>
        <Table responsive variant="dark" className="bg-transparent border-0 text-light align-middle">
          <thead>
            <tr>
              <th>Segment</th>
              <th>Account Type</th>
              <th>Brokerage</th>
              <th>STT / CTT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Equity Delivery</td>
              <td>Retail</td>
              <td>Zero</td>
              <td>0.1% on buy & sell</td>
            </tr>
            <tr>
              <td>Equity Intraday</td>
              <td>Retail</td>
              <td>₹20 or 0.03%</td>
              <td>0.025% on sell</td>
            </tr>
            <tr>
              <td>Futures</td>
              <td>Professional</td>
              <td>₹20 per executed order</td>
              <td>0.0125% on sell</td>
            </tr>
            <tr>
              <td>Options</td>
              <td>Professional</td>
              <td>₹20 per executed order</td>
              <td>0.0625% on sell premium</td>
            </tr>
          </tbody>
        </Table>
      </div>

      <div className="glass-panel mt-5 mb-5 p-4 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
        <h3 className="text-white mb-4">Understanding Your Brokerage Calculation</h3>
        <p className="text-light text-opacity-75 mb-4">
          The total charges applied to a trade go beyond just the flat brokerage fee. Your contract note will reflect the complete calculation involving regulatory and government taxes. Here is the entire brokerage calculation breakdown:
        </p>
        <Row>
          <Col md={6}>
            <ul className="list-unstyled text-light">
              <li className="mb-3 d-flex align-items-start">
                <BsCheckCircleFill className="text-info mt-1 me-3" size={18} />
                <div>
                  <strong>Brokerage:</strong> Flat ₹20 per executed order or 0.03% (whichever is lower) for intraday & F&O. Delivery is completely free.
                </div>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <BsCheckCircleFill className="text-info mt-1 me-3" size={18} />
                <div>
                  <strong>STT/CTT (Securities/Commodities Transaction Tax):</strong> Charged by the Government of India on the transactions. 0.1% on buy/sell for delivery; 0.025% on sell for intraday.
                </div>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <BsCheckCircleFill className="text-info mt-1 me-3" size={18} />
                <div>
                  <strong>Transaction Charges:</strong> Charged by exchanges (NSE, BSE, MCX) and vary by segment. Typically ~0.00345% on the turnover.
                </div>
              </li>
            </ul>
          </Col>
          <Col md={6}>
            <ul className="list-unstyled text-light">
              <li className="mb-3 d-flex align-items-start">
                <BsCheckCircleFill className="text-info mt-1 me-3" size={18} />
                <div>
                  <strong>GST (Goods and Services Tax):</strong> 18% levied by the government on the total sum of brokerage, transaction charges, and SEBI fee.
                </div>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <BsCheckCircleFill className="text-info mt-1 me-3" size={18} />
                <div>
                  <strong>SEBI Charges:</strong> Levied by the Securities and Exchange Board of India at ₹10 per crore of turnover.
                </div>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <BsCheckCircleFill className="text-info mt-1 me-3" size={18} />
                <div>
                  <strong>Stamp Charges:</strong> State government tax applied only on the buying side of the turnover. Differs based on specific state rates but uniform across segments since 2020.
                </div>
              </li>
            </ul>
          </Col>
        </Row>
      </div>

      <div className="text-center mt-4 pt-4 pb-4 border-top border-secondary border-opacity-25">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="d-inline-block"
        >
          <Button as={Link} to="/signup" variant="primary" className="btn-primary-custom px-5 py-3 rounded-pill shadow-lg" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            Sign Up Now <BsArrowRight className="ms-2" />
          </Button>
        </motion.div>
      </div>
    </Container>
  );
}
