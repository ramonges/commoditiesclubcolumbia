import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <img src="/assets/logo.png" alt="Columbia Commodity Club Logo" className="logo-img" />
            </Link>
          </div>
          
          <nav className={`nav ${isMobileMenuOpen ? 'active' : ''}`}>
            <ul className="nav-list">
              <li>
                <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/news" className={`nav-link ${isActive('/news') ? 'active' : ''}`}>
                  News
                </Link>
              </li>
              <li>
                <Link to="/strategies" className={`nav-link ${isActive('/strategies') ? 'active' : ''}`}>
                  Weekly Trading Strategies
                </Link>
              </li>
              <li>
                <Link to="/events" className={`nav-link ${isActive('/events') ? 'active' : ''}`}>
                  Our Events
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="header-cta">
            <Link to="/events#next-dinner" className="btn btn-primary">Next Dinner</Link>
            <Link to="/#partner" className="btn btn-secondary">Partner With Us</Link>
          </div>
          
          <button 
            className="mobile-menu-toggle" 
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
