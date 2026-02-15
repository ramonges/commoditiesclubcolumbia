import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">A student-led platform exploring global commodity markets.</h1>
            <p className="hero-description">
              We bring together research, market analysis, trading discussions, and industry engagement 
              to deepen understanding of commodity markets and their role in the global economy.
            </p>
            <div className="hero-cta">
              <Link to="/events" className="btn btn-primary btn-large">Join Our Next Event</Link>
              <Link to="/news" className="btn btn-outline btn-large">Explore Our Research</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Preview */}
      <section className="section section-news">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest News</h2>
            <Link to="/news" className="section-link">View All News →</Link>
          </div>
          <div className="news-grid">
            <article className="news-card">
              <div className="news-card-tag tag-energy">Energy</div>
              <h3 className="news-card-title">Oil Market Dynamics: Supply Constraints and Demand Outlook</h3>
              <p className="news-card-summary">
                Analysis of recent OPEC+ decisions and their impact on global crude prices, examining both 
                short-term volatility and longer-term structural shifts.
              </p>
              <div className="news-card-footer">
                <span className="news-card-date">March 15, 2024</span>
                <Link to="/news#energy" className="news-card-link">Read More →</Link>
              </div>
            </article>
            
            <article className="news-card">
              <div className="news-card-tag tag-metals">Precious Metals</div>
              <h3 className="news-card-title">Gold Rally: Central Bank Policy and Safe Haven Demand</h3>
              <p className="news-card-summary">
                Exploring the factors driving gold prices to multi-year highs, with focus on monetary policy 
                expectations and geopolitical risk premiums.
              </p>
              <div className="news-card-footer">
                <span className="news-card-date">March 12, 2024</span>
                <Link to="/news#precious-metals" className="news-card-link">Read More →</Link>
              </div>
            </article>
            
            <article className="news-card">
              <div className="news-card-tag tag-agriculture">Agriculture</div>
              <h3 className="news-card-title">Grain Markets: Weather Patterns and Export Dynamics</h3>
              <p className="news-card-summary">
                Assessing the impact of El Niño on crop yields and the evolving trade flows in global grain 
                markets, particularly wheat and corn.
              </p>
              <div className="news-card-footer">
                <span className="news-card-date">March 10, 2024</span>
                <Link to="/news#agriculture" className="news-card-link">Read More →</Link>
              </div>
            </article>
          </div>
        </div>
      </section>


      {/* Upcoming Events Preview */}
      <section className="section section-events">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Upcoming Events</h2>
            <Link to="/events" className="section-link">View All Events →</Link>
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="section section-partner" id="partner">
        <div className="container">
          <div className="partner-content">
            <h2 className="partner-title">Partner With Us</h2>
            <p className="partner-description">
              We collaborate with leading firms in commodities trading, energy, agriculture, and finance 
              to provide our members with industry insights, networking opportunities, and career pathways.
            </p>
            <a href="mailto:columbia.commodity@gmail.com" className="btn btn-primary btn-large">Get In Touch</a>
          </div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="section section-social">
        <div className="container">
          <div className="social-content">
            <h2 className="social-title">Follow Our Research</h2>
            <p className="social-description">
              Stay updated with our latest articles and analysis published on Substack and LinkedIn.
            </p>
            <div className="social-buttons">
              <a 
                href="https://substack.com/@columbiacommodities" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary btn-large"
              >
                Follow on Substack
              </a>
              <a 
                href="https://www.linkedin.com/company/columbia-commodities/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline btn-large"
              >
                Follow on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

