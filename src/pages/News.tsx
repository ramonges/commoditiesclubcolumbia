import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import './News.css';

const News = () => {
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
          <h1 className="page-title">News & Analysis</h1>
          <p className="page-subtitle">In-depth coverage of global commodity markets across energy, metals, and agriculture</p>
        </div>
      </section>

      {/* News Categories */}
      <section className="section section-news-page">
        <div className="container">
          {/* Energy */}
          <div className="news-category" id="energy">
            <div className="category-header">
              <h2 className="category-title">Energy</h2>
              <span className="category-count">12 articles</span>
            </div>
            <div className="news-grid">
              <article className="news-card">
                <div className="news-card-tag tag-energy">Energy</div>
                <h3 className="news-card-title">Oil Market Dynamics: Supply Constraints and Demand Outlook</h3>
                <p className="news-card-summary">
                  Analysis of recent OPEC+ decisions and their impact on global crude prices, examining both 
                  short-term volatility and longer-term structural shifts in the energy landscape.
                </p>
                <div className="news-card-footer">
                  <span className="news-card-date">March 15, 2024</span>
                  <a href="#" className="news-card-link">Read More →</a>
                </div>
              </article>
              
              <article className="news-card">
                <div className="news-card-tag tag-energy">Energy</div>
                <h3 className="news-card-title">Natural Gas: Winter Demand Patterns and Storage Levels</h3>
                <p className="news-card-summary">
                  Examining the relationship between weather patterns, storage inventories, and natural gas 
                  pricing dynamics in North American markets.
                </p>
                <div className="news-card-footer">
                  <span className="news-card-date">March 8, 2024</span>
                  <a href="#" className="news-card-link">Read More →</a>
                </div>
              </article>
              
              <article className="news-card">
                <div className="news-card-tag tag-energy">Energy</div>
                <h3 className="news-card-title">Renewable Energy Transition: Impact on Traditional Energy Commodities</h3>
                <p className="news-card-summary">
                  Exploring how the shift toward renewable energy sources is reshaping demand patterns for 
                  coal, oil, and natural gas in global markets.
                </p>
                <div className="news-card-footer">
                  <span className="news-card-date">March 1, 2024</span>
                  <a href="#" className="news-card-link">Read More →</a>
                </div>
              </article>
            </div>
          </div>

          {/* Precious Metals */}
          <div className="news-category" id="precious-metals">
            <div className="category-header">
              <h2 className="category-title">Precious Metals</h2>
              <span className="category-count">8 articles</span>
            </div>
            <div className="news-grid">
              <article className="news-card">
                <div className="news-card-tag tag-metals">Precious Metals</div>
                <h3 className="news-card-title">Gold Rally: Central Bank Policy and Safe Haven Demand</h3>
                <p className="news-card-summary">
                  Exploring the factors driving gold prices to multi-year highs, with focus on monetary policy 
                  expectations and geopolitical risk premiums.
                </p>
                <div className="news-card-footer">
                  <span className="news-card-date">March 12, 2024</span>
                  <a href="#" className="news-card-link">Read More →</a>
                </div>
              </article>
              
              <article className="news-card">
                <div className="news-card-tag tag-metals">Precious Metals</div>
                <h3 className="news-card-title">Silver: Industrial Demand Meets Monetary Hedge</h3>
                <p className="news-card-summary">
                  Analyzing silver's dual role as both an industrial metal and a monetary asset, and how 
                  this creates unique price dynamics.
                </p>
                <div className="news-card-footer">
                  <span className="news-card-date">March 5, 2024</span>
                  <a href="#" className="news-card-link">Read More →</a>
                </div>
              </article>
              
              <article className="news-card">
                <div className="news-card-tag tag-metals">Precious Metals</div>
                <h3 className="news-card-title">Platinum Group Metals: Automotive and Industrial Applications</h3>
                <p className="news-card-summary">
                  Examining the supply-demand fundamentals for platinum, palladium, and rhodium in the 
                  context of automotive emissions standards and industrial uses.
                </p>
                <div className="news-card-footer">
                  <span className="news-card-date">February 28, 2024</span>
                  <a href="#" className="news-card-link">Read More →</a>
                </div>
              </article>
            </div>
          </div>

          {/* Base Metals */}
          <div className="news-category" id="base-metals">
            <div className="category-header">
              <h2 className="category-title">Base Metals</h2>
              <span className="category-count">10 articles</span>
            </div>
            <div className="news-grid">
              <article className="news-card">
                <div className="news-card-tag tag-base-metals">Base Metals</div>
                <h3 className="news-card-title">Copper: The Barometer of Global Economic Health</h3>
                <p className="news-card-summary">
                  Understanding copper's role as an economic indicator and analyzing current market trends 
                  in the context of global growth expectations.
                </p>
                <div className="news-card-footer">
                  <span className="news-card-date">March 10, 2024</span>
                  <a href="#" className="news-card-link">Read More →</a>
                </div>
              </article>
              
              <article className="news-card">
                <div className="news-card-tag tag-base-metals">Base Metals</div>
                <h3 className="news-card-title">Aluminum: Energy Costs and Supply Chain Dynamics</h3>
                <p className="news-card-summary">
                  Examining how energy prices impact aluminum production costs and the resulting effects 
                  on global supply chains and pricing.
                </p>
                <div className="news-card-footer">
                  <span className="news-card-date">March 3, 2024</span>
                  <a href="#" className="news-card-link">Read More →</a>
                </div>
              </article>
              
              <article className="news-card">
                <div className="news-card-tag tag-base-metals">Base Metals</div>
                <h3 className="news-card-title">Zinc and Lead: Infrastructure Investment and Battery Demand</h3>
                <p className="news-card-summary">
                  Analyzing the impact of infrastructure spending and battery technology on zinc and lead 
                  markets, including supply constraints.
                </p>
                <div className="news-card-footer">
                  <span className="news-card-date">February 25, 2024</span>
                  <a href="#" className="news-card-link">Read More →</a>
                </div>
              </article>
            </div>
          </div>

          {/* Agriculture */}
          <div className="news-category" id="agriculture">
            <div className="category-header">
              <h2 className="category-title">Agriculture</h2>
              <span className="category-count">15 articles</span>
            </div>
            <div className="news-grid">
              <article className="news-card">
                <div className="news-card-tag tag-agriculture">Agriculture</div>
                <h3 className="news-card-title">Grain Markets: Weather Patterns and Export Dynamics</h3>
                <p className="news-card-summary">
                  Assessing the impact of El Niño on crop yields and the evolving trade flows in global 
                  grain markets, particularly wheat and corn.
                </p>
                <div className="news-card-footer">
                  <span className="news-card-date">March 10, 2024</span>
                  <a href="#" className="news-card-link">Read More →</a>
                </div>
              </article>
              
              <article className="news-card">
                <div className="news-card-tag tag-agriculture">Agriculture</div>
                <h3 className="news-card-title">Coffee: Climate Change and Supply Chain Resilience</h3>
                <p className="news-card-summary">
                  Exploring how changing weather patterns are affecting coffee production regions and the 
                  implications for global supply and pricing.
                </p>
                <div className="news-card-footer">
                  <span className="news-card-date">March 7, 2024</span>
                  <a href="#" className="news-card-link">Read More →</a>
                </div>
              </article>
              
              <article className="news-card">
                <div className="news-card-tag tag-agriculture">Agriculture</div>
                <h3 className="news-card-title">Sugar: Brazilian Production and Global Trade Flows</h3>
                <p className="news-card-summary">
                  Analyzing Brazil's role as a major sugar producer and exporter, and how production cycles 
                  affect global pricing dynamics.
                </p>
                <div className="news-card-footer">
                  <span className="news-card-date">March 2, 2024</span>
                  <a href="#" className="news-card-link">Read More →</a>
                </div>
              </article>
            </div>
          </div>

          {/* Weekly Trading Strategies */}
          <div className="news-category" id="weekly-strategies">
            <div className="category-header">
              <h2 className="category-title">Weekly Trading Strategies</h2>
              <span className="category-count">View all →</span>
            </div>
            <div className="news-grid">
              <article className="news-card">
                <div className="news-card-tag tag-strategies">Strategy</div>
                <h3 className="news-card-title">Copper-Gold Spread: Industrial Demand vs. Monetary Policy</h3>
                <p className="news-card-summary">
                  Analyzing the divergence between copper (industrial demand proxy) and gold (monetary policy 
                  proxy) to identify macro regime shifts.
                </p>
                <div className="news-card-footer">
                  <span className="news-card-date">March 18, 2024</span>
                  <Link to="/strategies" className="news-card-link">View Full Analysis →</Link>
                </div>
              </article>
              
              <article className="news-card">
                <div className="news-card-tag tag-strategies">Strategy</div>
                <h3 className="news-card-title">Crude Oil Contango Structure: Storage Economics</h3>
                <p className="news-card-summary">
                  Examining the WTI forward curve structure and the economics of storage, identifying 
                  potential arbitrage opportunities.
                </p>
                <div className="news-card-footer">
                  <span className="news-card-date">March 11, 2024</span>
                  <Link to="/strategies" className="news-card-link">View Full Analysis →</Link>
                </div>
              </article>
            </div>
            <div className="category-footer">
              <Link to="/strategies" className="btn btn-outline">View All Weekly Strategies</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default News;

