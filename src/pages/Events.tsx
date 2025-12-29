import { useEffect } from 'react';
import './Events.css';

const Events = () => {
  useEffect(() => {
    // Smooth scroll to hash on mount
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, []);

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Our Events</h1>
          <p className="page-subtitle">Dinners, speaker events, company visits, and networking opportunities</p>
        </div>
      </section>

      {/* Events Content */}
      <section className="section section-events-page">
        <div className="container">
          {/* Upcoming Events */}
          <div className="events-section">
            <h2 className="events-section-title">Upcoming Events</h2>
            <div className="events-grid">
              <article className="event-card featured" id="next-dinner">
                <div className="event-card-date">
                  <span className="event-card-month">April</span>
                  <span className="event-card-day">12</span>
                </div>
                <div className="event-card-content">
                  <span className="event-card-type">Dinner</span>
                  <h3 className="event-card-title">Spring Commodities Dinner</h3>
                  <p className="event-card-description">
                    Join us for an evening discussion on energy transition and its impact on commodity markets. 
                    This dinner will feature industry professionals from leading trading firms and energy companies, 
                    along with student presentations on recent market developments. Topics will include renewable 
                    energy adoption, traditional energy demand patterns, and the evolving role of commodities 
                    in a transitioning economy.
                  </p>
                  <div className="event-card-meta">
                    <span className="event-card-location">📍 Faculty House, Columbia University</span>
                    <span className="event-card-time">6:00 PM - 9:00 PM</span>
                  </div>
                  <div className="event-card-cta">
                    <a 
                      href="mailto:events@columbiacommodityclub.org?subject=Spring Commodities Dinner RSVP" 
                      className="btn btn-primary"
                    >
                      RSVP
                    </a>
                  </div>
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
                    Guest speaker from a leading trading firm shares insights on career paths in commodities trading, 
                    market-making strategies, and the day-to-day life of a commodity trader. This event will cover 
                    different roles within trading firms, required skills and qualifications, and how to prepare for 
                    a career in commodities markets.
                  </p>
                  <div className="event-card-meta">
                    <span className="event-card-location">📍 Uris Hall, Room 301</span>
                    <span className="event-card-time">5:00 PM - 6:30 PM</span>
                  </div>
                  <div className="event-card-cta">
                    <a 
                      href="mailto:events@columbiacommodityclub.org?subject=Trading Floor Insights RSVP" 
                      className="btn btn-primary"
                    >
                      RSVP
                    </a>
                  </div>
                </div>
              </article>
              
              <article className="event-card">
                <div className="event-card-date">
                  <span className="event-card-month">May</span>
                  <span className="event-card-day">8</span>
                </div>
                <div className="event-card-content">
                  <span className="event-card-type">Company Visit</span>
                  <h3 className="event-card-title">Trading Floor Tour: Energy Trading Firm</h3>
                  <p className="event-card-description">
                    Exclusive opportunity to visit a leading energy trading firm in Manhattan. Members will tour 
                    the trading floor, meet with traders and analysts, and learn about the firm's approach to 
                    energy markets. This is a unique chance to see commodity trading in action and network with 
                    industry professionals.
                  </p>
                  <div className="event-card-meta">
                    <span className="event-card-location">📍 Midtown Manhattan (TBA)</span>
                    <span className="event-card-time">2:00 PM - 4:00 PM</span>
                  </div>
                  <div className="event-card-cta">
                    <a 
                      href="mailto:events@columbiacommodityclub.org?subject=Trading Floor Tour RSVP" 
                      className="btn btn-primary"
                    >
                      RSVP
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </div>

          {/* Past Events */}
          <div className="events-section">
            <h2 className="events-section-title">Past Events</h2>
            <div className="events-grid">
              <article className="event-card past">
                <div className="event-card-date">
                  <span className="event-card-month">March</span>
                  <span className="event-card-day">15</span>
                </div>
                <div className="event-card-content">
                  <span className="event-card-type">Dinner</span>
                  <h3 className="event-card-title">Winter Commodities Dinner</h3>
                  <p className="event-card-description">
                    Discussion on precious metals markets, central bank policies, and their impact on gold and 
                    silver prices. Featured presentations on mining economics and monetary policy analysis.
                  </p>
                  <div className="event-card-meta">
                    <span className="event-card-location">📍 Faculty House, Columbia University</span>
                    <span className="event-card-time">Completed</span>
                  </div>
                </div>
              </article>
              
              <article className="event-card past">
                <div className="event-card-date">
                  <span className="event-card-month">February</span>
                  <span className="event-card-day">28</span>
                </div>
                <div className="event-card-content">
                  <span className="event-card-type">Speaker Event</span>
                  <h3 className="event-card-title">Agricultural Markets: Supply Chain Analysis</h3>
                  <p className="event-card-description">
                    Expert presentation on global agricultural commodity markets, focusing on supply chain dynamics, 
                    weather impacts, and trade flows in grain and soft commodity markets.
                  </p>
                  <div className="event-card-meta">
                    <span className="event-card-location">📍 Uris Hall, Room 301</span>
                    <span className="event-card-time">Completed</span>
                  </div>
                </div>
              </article>
              
              <article className="event-card past">
                <div className="event-card-date">
                  <span className="event-card-month">February</span>
                  <span className="event-card-day">10</span>
                </div>
                <div className="event-card-content">
                  <span className="event-card-type">Workshop</span>
                  <h3 className="event-card-title">Introduction to Commodity Trading</h3>
                  <p className="event-card-description">
                    Educational workshop covering the basics of commodity markets, trading mechanics, and fundamental 
                    analysis. Designed for members new to commodities trading.
                  </p>
                  <div className="event-card-meta">
                    <span className="event-card-location">📍 Online</span>
                    <span className="event-card-time">Completed</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Events;

