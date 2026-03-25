import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AccountCircle, Logout, Login as LoginIcon, PersonAdd } from '@mui/icons-material';
import axios from '../api/axiosInstance';
import Loader from './Loader';

export default function AppNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredPath, setHoveredPath] = useState(location.pathname);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Sync state if external route changes
  useEffect(() => {
    setHoveredPath(location.pathname);
  }, [location.pathname]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post('/auth/logout');
      localStorage.removeItem('user');
      setUser(null);
      // Small delay for the modern feel
      setTimeout(() => {
        setLoading(false);
        navigate('/login');
      }, 700);
    } catch (err) {
      setLoading(false);
      console.error('Logout failed', err);
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/orders', label: 'Orders' },
    { path: '/holdings', label: 'Holdings' },
    { path: '/positions', label: 'Positions' },
    { path: '/funds', label: 'Funds' },
    { path: '/apps', label: 'Apps' }
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <AnimatePresence>
        {loading && <Loader text="Safe Logout..." />}
      </AnimatePresence>
      <Navbar expand="lg" className="custom-navbar sticky-top" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/" onClick={scrollToTop} className="fw-bold text-gradient fs-3 d-flex align-items-center">
            <img 
              src="/stock_logo.png" 
              alt="TradeSphere Logo" 
              width="40" 
              height="40" 
              className="me-2 rounded-circle"
            />
            TradeSphere AI
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav 
              onMouseLeave={() => setHoveredPath(location.pathname)} 
              className="align-items-center"
              style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '30px', padding: '5px' }}
            >
              <AnimatePresence>
                {navItems.map((item) => {
                  const isActive = item.path === location.pathname;
                  const isHovered = item.path === hoveredPath;
                  
                  return (
                    <div key={item.path} className="position-relative px-2" onMouseEnter={() => setHoveredPath(item.path)}>
                      <Link
                        to={item.path}
                        className={`nav-link px-3 py-1 text-white position-relative ${isActive ? 'fw-bold' : ''}`}
                        style={{ zIndex: 2, transition: 'color 0.3s' }}
                      >
                        {item.label}
                      </Link>
                      {isHovered && (
                        <motion.div
                          layoutId="nav-pill"
                          className="position-absolute"
                          style={{
                            top: 0, 
                            bottom: 0, 
                            left: 0, 
                            right: 0, 
                            background: 'rgba(255,255,255,0.15)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '30px',
                            zIndex: 1
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 500, 
                            damping: 30 
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </AnimatePresence>
            </Nav>

            {/* Profile Dropdown with Animation */}
            <Dropdown className="ms-4">
              <Dropdown.Toggle as={motion.div} 
                className="text-light d-flex align-items-center justify-content-center cursor-pointer"
                whileHover={{ scale: 1.1, color: '#38bdf8' }}
                whileTap={{ scale: 0.95 }}
                style={{ cursor: 'pointer', background: 'none', border: 'none' }}
              >
                <div className="d-flex align-items-center gap-2">
                  <AccountCircle sx={{ fontSize: 32 }} />
                  {user && <span className="small d-none d-md-block fw-bold">{user.username}</span>}
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-panel py-2 shadow-lg" align="end" style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                {user ? (
                  <>
                    <Dropdown.Item className="text-light-50 py-2 d-flex align-items-center gap-2" disabled>
                      Signed in as <strong>{user.username}</strong>
                    </Dropdown.Item>
                    <Dropdown.Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                    <Dropdown.Item as={Link} to="/dashboard" className="text-light py-2 d-flex align-items-center gap-2 hover-bg-light">
                      <AccountCircle sx={{ fontSize: 18 }} /> Dashboard
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout} className="text-danger py-2 d-flex align-items-center gap-2 hover-bg-light">
                      <Logout sx={{ fontSize: 18 }} /> Logout
                    </Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item as={Link} to="/login" className="text-light py-2 d-flex align-items-center gap-2 hover-bg-light">
                      <LoginIcon sx={{ fontSize: 18 }} /> Login
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/signup" className="text-light py-2 d-flex align-items-center gap-2 hover-bg-light">
                      <PersonAdd sx={{ fontSize: 18 }} /> Signup
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
            
            <style dangerouslySetInnerHTML={{ __html: `
              .dropdown-panel .dropdown-item:hover { background: rgba(255,255,255,0.1) !important; color: #38bdf8 !important; }
              .dropdown-panel .dropdown-item { transition: all 0.2s; }
              .text-light-50 { color: rgba(255,255,255,0.6); font-size: 0.85rem; }
            `}} />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
