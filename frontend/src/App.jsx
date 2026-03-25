import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import PricingPage from './pages/PricingPage';
import Support from './pages/Support';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Holdings from './pages/Holdings';
import Positions from './pages/Positions';
import Funds from './pages/Funds';
import Apps from './pages/Apps';
import Scene from './components/Scene';
import NotFound from './pages/NotFound';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/products" element={<PageWrapper><Products /></PageWrapper>} />
        <Route path="/pricing" element={<PageWrapper><PricingPage /></PageWrapper>} />
        <Route path="/support" element={<PageWrapper><Support /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/orders" element={<PageWrapper><Orders /></PageWrapper>} />
        <Route path="/holdings" element={<PageWrapper><Holdings /></PageWrapper>} />
        <Route path="/positions" element={<PageWrapper><Positions /></PageWrapper>} />
        <Route path="/funds" element={<PageWrapper><Funds /></PageWrapper>} />
        <Route path="/apps" element={<PageWrapper><Apps /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <Router>
      <div className="canvas-container">
        <Scene />
      </div>

      <Navbar />
      <div style={{ position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 60px)', overflowX: 'hidden' }}>
        <AnimatedRoutes />
      </div>
      <Footer />
    </Router>
  );
}

export default App;
