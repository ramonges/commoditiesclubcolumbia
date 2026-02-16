import { Link } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '../lib/auth';
import LoginModal from './LoginModal';
import './Footer.css';

const Footer = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const isAuthenticated = authService.isAuthenticated();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
              <img src="/assets/logo.png" alt="Columbia Commodity Club Logo" className="logo-img footer-logo-img" />
              <p className="footer-tagline">Open Dialogue. Real Markets.</p>
            </div>
            <div className="footer-navigation">
              <h4 className="footer-heading">Navigation</h4>
              <ul className="footer-list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/news">Analysis</Link></li>
                <li><Link to="/research">Research</Link></li>
                <li><Link to="/events">Events</Link></li>
              </ul>
            </div>
            <div className="footer-connect">
              <h4 className="footer-heading">Connect</h4>
              <ul className="footer-list">
                <li><a href="mailto:columbia.commodity@gmail.com">Email</a></li>
                <li><a href="mailto:columbia.commodity@gmail.com">Partner With Us</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-right">
            <h4 className="footer-heading">Follow Us</h4>
            <a 
              href="https://substack.com/@columbiacommodities" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Substack"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className="social-icon"
              >
                <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V16.5c0 1.637 1.327 2.963 2.963 2.963h6.69v-2.836H4.423v-5.815H1.46zm21.08 0V16.5c0 1.637-1.327 2.963-2.963 2.963h-6.69v-2.836h6.69v-5.815h2.963z"/>
              </svg>
              <span>Substack</span>
            </a>
            <a 
              href="https://www.linkedin.com/company/columbia-commodities/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="LinkedIn"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className="social-icon"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>LinkedIn</span>
            </a>
            {!isAuthenticated ? (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="footer-login-btn"
              >
                Log In Team
              </button>
            ) : (
              <Link to="/admin" className="footer-login-btn">
                Admin Panel
              </Link>
            )}
          </div>
          <LoginModal 
            isOpen={isLoginOpen} 
            onClose={() => setIsLoginOpen(false)}
            onLogin={() => window.location.reload()}
          />
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Columbia Commodity Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
