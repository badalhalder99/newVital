import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../mysass-custom.css';

const MySaaSLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/mysass', label: 'Home' },
    { path: '/mysass/about', label: 'About Us' },
    { path: '/mysass/services', label: 'Services' },
    { path: '/mysass/products', label: 'Products' },
    { path: '/mysass/team', label: 'Team' },
    { path: '/mysass/contact', label: 'Contact Us' }
  ];

  return (
    <div className="mysass-page">
      {/* Header */}
      <header className="mysass-header">
        <nav className="mysass-nav">
          <Link to="/mysass" className="mysass-logo">
            Harmony Sourcing
          </Link>

          {/* Desktop Navigation */}
          <ul className="mysass-nav-links" style={{ display: mobileMenuOpen ? 'none' : 'flex' }}>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`mysass-nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    // Smooth scroll to top on navigation
                    setTimeout(() => {
                      window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                      });
                    }, 100);
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Toggle */}
          <button 
            className="mysass-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--mysass-text-primary)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="mysass-mobile-nav" style={{
            background: 'var(--mysass-surface)',
            padding: '1rem 2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`mysass-nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  // Smooth scroll to top on navigation
                  setTimeout(() => {
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: 'smooth'
                    });
                  }, 100);
                }}
                style={{
                  display: 'block',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="mysass-footer">
        <div className="mysass-footer-content">
          <div className="mysass-footer-section">
            <div className="mysass-logo" style={{ marginBottom: '1rem' }}>
              Harmony Sourcing
            </div>
            <p style={{ color: 'var(--mysass-text-secondary)', marginBottom: '2rem' }}>
              Your trusted partner in ethical fashion sourcing. We connect global brands with reliable, 
              sustainable manufacturing partners across Asia.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a 
                href="#" 
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'var(--mysass-primary)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                📘
              </a>
              <a 
                href="#" 
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'var(--mysass-primary)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                🐦
              </a>
              <a 
                href="#" 
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'var(--mysass-primary)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                💼
              </a>
            </div>
          </div>

          <div className="mysass-footer-section">
            <h4>Quick Links</h4>
            <ul className="mysass-footer-links">
              <li><Link to="/mysass">Home</Link></li>
              <li><Link to="/mysass/about">About Us</Link></li>
              <li><Link to="/mysass/services">Services</Link></li>
              <li><Link to="/mysass/products">Products</Link></li>
              <li><Link to="/mysass/team">Our Team</Link></li>
              <li><Link to="/mysass/contact">Contact Us</Link></li>
              <li><Link to="/mysass/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div className="mysass-footer-section">
            <h4>Contact Info</h4>
            <div style={{ color: 'var(--mysass-text-secondary)' }}>
              <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--mysass-primary)' }}>📍</span>
                Dhaka, Bangladesh
              </p>
              <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--mysass-primary)' }}>📞</span>
                +880 12 345 6789
              </p>
              <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--mysass-primary)' }}>✉️</span>
                info@harmonysourcing.com
              </p>
            </div>
          </div>
        </div>

        <div className="mysass-footer-bottom">
          <p>Privacy Policy • Terms of Service • © 2024 Harmony Sourcing. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Building sustainable fashion, one partnership at a time. ™
          </p>
        </div>
      </footer>

      {/* Mobile responsive styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .mysass-nav-links {
            display: none !important;
          }
          
          .mysass-mobile-toggle {
            display: block !important;
          }
          
          .mysass-nav {
            padding: 1rem !important;
          }
          
          .mysass-footer-content {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .mysass-logo {
            font-size: 1.2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MySaaSLayout;