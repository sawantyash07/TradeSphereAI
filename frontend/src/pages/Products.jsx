import React from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { BsArrowRight, BsGooglePlay, BsApple, BsPlayCircle, BsInfoCircle, BsGraphUpArrow, BsShieldCheck, BsBank, BsCurrencyExchange, BsGlobe, BsBuilding, BsCodeSlash, BsPieChartFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';

export default function Products() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const imageVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="products-page overflow-hidden py-5 pt-md-5 mt-5">
      <Container>
        {/* Header Section */}
        <motion.div 
          className="text-center mb-5 pb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <Badge bg="info" className="mb-3 px-3 py-2 rounded-pill shadow-sm">
            <BsGraphUpArrow className="me-2" /> Our Products
          </Badge>
          <h2 className="display-4 fw-bold text-gradient mb-3">Empowering Your Stock Market Journey</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Discover our suite of intuitive, high-performance platforms designed to make investing and trading seamless, whether you're a beginner or a seasoned pro.
          </p>
          <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
            <Button as={Link} to="/education" variant="primary" className="btn-primary-custom d-flex align-items-center">
              Learn More <BsArrowRight className="ms-2" />
            </Button>
            <Button as={Link} to="/about" variant="outline-info" className="d-flex align-items-center bg-glass border-secondary">
              See Investment Offerings <BsShieldCheck className="ms-2" />
            </Button>
          </div>
        </motion.div>

        {/* Product 1: Coin (Image Left, Text Right) */}
        <Row className="align-items-center mb-5 pb-5">
          <Col lg={6} className="mb-4 mb-lg-0 order-1 order-lg-1">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={imageVariant}
              className="glass-panel p-3"
            >
              <img 
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1000" 
                alt="Coin App" 
                className="img-fluid rounded"
                style={{ objectFit: 'cover', height: '400px', width: '100%' }}
              />
            </motion.div>
          </Col>
          <Col lg={6} className="order-2 order-lg-2 ps-lg-5">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h3 className="display-5 fw-bold text-white mb-3">Coin</h3>
              <h5 className="text-info mb-4">Mutual funds done right.</h5>
              <p className="text-light mb-4 text-opacity-75" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                Buy direct mutual funds online with zero commission. Experience seamless SIP creation, automated portfolio tracking, and expert-curated funds. Start investing in your future today.
              </p>
              
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Button variant="outline-info" className="d-flex align-items-center rounded-pill px-4">
                  <BsPlayCircle className="me-2 fs-5" /> Try Demo
                </Button>
                <Button variant="link" className="text-decoration-none text-light d-flex align-items-center">
                  <BsInfoCircle className="me-2" /> Learn More
                </Button>
              </div>
              
              <div className="d-flex flex-wrap gap-3 align-items-center mt-5 pt-3 border-top border-secondary border-opacity-50">
                <span className="text-muted small">Available on:</span>
                <Button variant="dark" size="sm" className="bg-glass border border-secondary text-white d-flex align-items-center rounded">
                  <BsGooglePlay className="me-2 text-info" /> Google Play
                </Button>
                <Button variant="dark" size="sm" className="bg-glass border border-secondary text-white d-flex align-items-center rounded">
                  <BsApple className="me-2 text-info" /> App Store
                </Button>
              </div>
            </motion.div>
          </Col>
        </Row>

        {/* Product 2: Kite (Text Left, Image Right) */}
        <Row className="align-items-center mb-5 pb-5">
          <Col lg={6} className="order-2 order-lg-1 pe-lg-5">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h3 className="display-5 fw-bold text-white mb-3">Kite</h3>
              <h5 className="text-info mb-4">The ultimate trading platform.</h5>
              <p className="text-light mb-4 text-opacity-75" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                Our flagship trading platform, built from the ground up for speed, elegance, and reliability. Execute lightning-fast trades, access advanced charting, and track markets in real-time.
              </p>
              
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Button variant="primary" className="btn-primary-custom d-flex align-items-center rounded-pill px-4">
                  <BsPlayCircle className="me-2 fs-5" /> Try Demo
                </Button>
                <Button variant="link" className="text-decoration-none text-light d-flex align-items-center">
                  <BsInfoCircle className="me-2" /> Learn More
                </Button>
              </div>
              
              <div className="d-flex flex-wrap gap-3 align-items-center mt-5 pt-3 border-top border-secondary border-opacity-50">
                <span className="text-muted small">Available on:</span>
                <Button variant="dark" size="sm" className="bg-glass border border-secondary text-white d-flex align-items-center rounded">
                  <BsGooglePlay className="me-2 text-info" /> Google Play
                </Button>
                <Button variant="dark" size="sm" className="bg-glass border border-secondary text-white d-flex align-items-center rounded">
                  <BsApple className="me-2 text-info" /> App Store
                </Button>
              </div>
            </motion.div>
          </Col>
          <Col lg={6} className="mb-4 mb-lg-0 order-1 order-lg-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={imageVariant}
              className="glass-panel p-3"
            >
              <img 
                src="https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=1000" 
                alt="Kite Trading App" 
                className="img-fluid rounded"
                style={{ objectFit: 'cover', height: '400px', width: '100%' }}
              />
            </motion.div>
          </Col>
        </Row>

        {/* Product 3: Varsity Mobile (Image Left, Text Right) */}
        <Row className="align-items-center mb-5 pb-3">
          <Col lg={6} className="mb-4 mb-lg-0 order-1 order-lg-1">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={imageVariant}
              className="glass-panel p-3"
            >
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000" 
                alt="Varsity Education App" 
                className="img-fluid rounded"
                style={{ objectFit: 'cover', height: '400px', width: '100%' }}
              />
            </motion.div>
          </Col>
          <Col lg={6} className="order-2 order-lg-2 ps-lg-5">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h3 className="display-5 fw-bold text-white mb-3">Varsity Mobile</h3>
              <h5 className="text-info mb-4">Stock market education on the go.</h5>
              <p className="text-light mb-4 text-opacity-75" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                Master the stock market with bite-sized, easy-to-understand lessons. Comprehensive modules on trading, investing, options, and technical analysis—completely free and accessible anywhere.
              </p>
              
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Button variant="outline-info" className="d-flex align-items-center rounded-pill px-4">
                  <BsPlayCircle className="me-2 fs-5" /> Try Demo
                </Button>
                <Button variant="link" className="text-decoration-none text-light d-flex align-items-center">
                  <BsInfoCircle className="me-2" /> Learn More
                </Button>
              </div>
              
              <div className="d-flex flex-wrap gap-3 align-items-center mt-5 pt-3 border-top border-secondary border-opacity-50">
                <span className="text-muted small">Available on:</span>
                <Button variant="dark" size="sm" className="bg-glass border border-secondary text-white d-flex align-items-center rounded">
                  <BsGooglePlay className="me-2 text-info" /> Google Play
                </Button>
                <Button variant="dark" size="sm" className="bg-glass border border-secondary text-white d-flex align-items-center rounded">
                  <BsApple className="me-2 text-info" /> App Store
                </Button>
              </div>
            </motion.div>
          </Col>
        </Row>
        {/* Product 4: Console (Text Left, Image Right) */}
        <Row className="align-items-center mb-5 pb-5">
          <Col lg={6} className="order-2 order-lg-1 pe-lg-5">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h3 className="display-5 fw-bold text-white mb-3">Console</h3>
              <h5 className="text-info mb-4">The central dashboard for your account.</h5>
              <p className="text-light mb-4 text-opacity-75" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                Gain actionable insights into your trades and investments. Console provides comprehensive reporting, tax statements, portfolio analytics, and a multi-dimensional view of your wealth.
              </p>
              
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Button variant="primary" className="btn-primary-custom d-flex align-items-center rounded-pill px-4">
                  <BsPlayCircle className="me-2 fs-5" /> Try Demo
                </Button>
                <Button variant="link" className="text-decoration-none text-light d-flex align-items-center">
                  <BsInfoCircle className="me-2" /> Learn More
                </Button>
              </div>
              
              <div className="d-flex flex-wrap gap-3 align-items-center mt-5 pt-3 border-top border-secondary border-opacity-50">
                <span className="text-muted small">Available on:</span>
                <Button variant="dark" size="sm" className="bg-glass border border-secondary text-white d-flex align-items-center rounded">
                  <BsGooglePlay className="me-2 text-info" /> Google Play
                </Button>
                <Button variant="dark" size="sm" className="bg-glass border border-secondary text-white d-flex align-items-center rounded">
                  <BsApple className="me-2 text-info" /> App Store
                </Button>
              </div>
            </motion.div>
          </Col>
          <Col lg={6} className="mb-4 mb-lg-0 order-1 order-lg-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={imageVariant}
              className="glass-panel p-3"
            >
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" 
                alt="Console Dashboard" 
                className="img-fluid rounded"
                style={{ objectFit: 'cover', height: '400px', width: '100%' }}
              />
            </motion.div>
          </Col>
        </Row>

        {/* Product 5: Kite Connect API (Image Left, Text Right) */}
        <Row className="align-items-center mb-5 pb-5">
          <Col lg={6} className="mb-4 mb-lg-0 order-1 order-lg-1">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={imageVariant}
              className="glass-panel p-3"
            >
              <img 
                src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000" 
                alt="Kite Connect API" 
                className="img-fluid rounded"
                style={{ objectFit: 'cover', height: '400px', width: '100%' }}
              />
            </motion.div>
          </Col>
          <Col lg={6} className="order-2 order-lg-2 ps-lg-5">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h3 className="display-5 fw-bold text-white mb-3">Kite Connect API</h3>
              <h5 className="text-info mb-4">Build your own trading platform.</h5>
              <p className="text-light mb-4 text-opacity-75" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                Build powerful trading applications with our simple HTTP/JSON APIs. Execute orders in real time, manage user portfolios, and stream live market data. The possibilities are endless.
              </p>
              
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Button variant="outline-info" className="d-flex align-items-center rounded-pill px-4">
                  <BsCodeSlash className="me-2 fs-5" /> Read Documentation
                </Button>
                <Button variant="link" className="text-decoration-none text-light d-flex align-items-center">
                  <BsInfoCircle className="me-2" /> Learn More
                </Button>
              </div>
            </motion.div>
          </Col>
        </Row>

        {/* Logos & Signup Section */}
        <motion.div 
          className="text-center py-5 border-top border-secondary border-opacity-50"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <h4 className="text-white mb-5">Trusted Partners & Integrated Exchanges</h4>
          <Row className="justify-content-center align-items-center mb-5 gy-4">
            {[
              { icon: <BsBank size={40} />, label: "NSE" },
              { icon: <BsBuilding size={40} />, label: "BSE" },
              { icon: <BsGlobe size={40} />, label: "Nasdaq" },
              { icon: <BsGraphUpArrow size={40} />, label: "MCX" },
              { icon: <BsPieChartFill size={40} />, label: "Mutual Funds" },
              { icon: <BsCurrencyExchange size={40} />, label: "Forex" },
            ].map((logo, index) => (
              <Col xs={6} md={4} lg={2} key={index}>
                <motion.div 
                  className="glass-panel d-flex flex-column align-items-center justify-content-center py-4 px-2"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="text-info mb-2">{logo.icon}</div>
                  <span className="text-light fw-semibold">{logo.label}</span>
                </motion.div>
              </Col>
            ))}
          </Row>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="d-inline-block"
          >
            <Button as={Link} to="/signup" variant="primary" className="btn-primary-custom px-5 py-3 rounded-pill shadow-lg" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              Sign Up Now <BsArrowRight className="ms-2" />
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
