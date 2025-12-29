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

      {/* Weekly Trading Strategies Preview */}
      <section className="section section-strategies">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Weekly Trading Strategies</h2>
            <Link to="/strategies" className="section-link">View All Strategies →</Link>
          </div>
          <div className="strategies-grid">
            <article className="strategy-card">
              <div className="strategy-card-header">
                <span className="strategy-card-week">Week of March 18, 2024</span>
                <span className="strategy-card-focus">Macro Focus</span>
              </div>
              <h3 className="strategy-card-title">Copper-Gold Spread: Industrial Demand vs. Monetary Policy</h3>
              <p className="strategy-card-summary">
                Analyzing the divergence between copper (industrial demand proxy) and gold (monetary policy proxy) 
                to identify macro regime shifts and potential spread trading opportunities.
              </p>
              <Link to="/strategies" className="strategy-card-link">View Full Analysis →</Link>
            </article>
            
            <article className="strategy-card">
              <div className="strategy-card-header">
                <span className="strategy-card-week">Week of March 11, 2024</span>
                <span className="strategy-card-focus">Curve Analysis</span>
              </div>
              <h3 className="strategy-card-title">Crude Oil Contango Structure: Storage Economics</h3>
              <p className="strategy-card-summary">
                Examining the WTI forward curve structure and the economics of storage, 
                identifying potential arbitrage opportunities in the term structure.
              </p>
              <Link to="/strategies" className="strategy-card-link">View Full Analysis →</Link>
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
          <div className="events-grid">
            <article className="event-card" id="next-dinner">
              <div className="event-card-date">
                <span className="event-card-month">April</span>
                <span className="event-card-day">12</span>
              </div>
              <div className="event-card-content">
                <span className="event-card-type">Dinner</span>
                <h3 className="event-card-title">Spring Commodities Dinner</h3>
                <p className="event-card-description">
                  Join us for an evening discussion on energy transition and its impact on commodity markets, 
                  featuring industry professionals and student presentations.
                </p>
                <div className="event-card-meta">
                  <span className="event-card-location">📍 Faculty House, Columbia University</span>
                  <span className="event-card-time">6:00 PM</span>
                </div>
                <Link to="/events" className="event-card-link">Learn More →</Link>
              </div>
            </article>
            
            <article className="event-card">
              <div className="event-card-date">
                <span className="event-card-month">April</span>
                <span className="event-card-day">25</span>
              </div>
              <div className="event-card-content">
                <span className="event-card-type">Speaker Event</span>
                <h3 className="event-card-title">Trading Floor Insights: A Career in Commodities</h3>
                <p className="event-card-description">
                  Guest speaker from a leading trading firm shares insights on career paths, 
                  market-making strategies, and the day-to-day life of a commodity trader.
                </p>
                <div className="event-card-meta">
                  <span className="event-card-location">📍 Uris Hall, Room 301</span>
                  <span className="event-card-time">5:00 PM</span>
                </div>
                <Link to="/events" className="event-card-link">Learn More →</Link>
              </div>
            </article>
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
            <a href="mailto:partnerships@columbiacommodityclub.org" className="btn btn-primary btn-large">Get In Touch</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

