import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/assets/logo.png" alt="Columbia Commodity Club Logo" className="logo-img footer-logo-img" />
            <p className="footer-tagline">Open Dialogue. Real Markets.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-heading">Navigation</h4>
              <ul className="footer-list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/news">News</Link></li>
                <li><Link to="/strategies">Trading Strategies</Link></li>
                <li><Link to="/events">Events</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Connect</h4>
              <ul className="footer-list">
                <li><a href="mailto:info@columbiacommodityclub.org">Email</a></li>
                <li><Link to="/#partner">Partner With Us</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Columbia Commodity Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

