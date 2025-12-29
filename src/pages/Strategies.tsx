import './Strategies.css';

const Strategies = () => {
  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Weekly Trading Strategies</h1>
          <p className="page-subtitle">
            Educational analysis focusing on macro themes, spreads, curves, and commodity-specific setups
          </p>
          <p className="page-disclaimer">
            <em>Note: This content is for educational purposes only and does not constitute investment advice.</em>
          </p>
        </div>
      </section>

      {/* Strategies Content */}
      <section className="section section-strategies-page">
        <div className="container">
          <article className="strategy-article">
            <div className="strategy-article-header">
              <div className="strategy-article-meta">
                <span className="strategy-article-week">Week of March 18, 2024</span>
                <span className="strategy-article-focus">Macro Focus</span>
              </div>
              <h2 className="strategy-article-title">Copper-Gold Spread: Industrial Demand vs. Monetary Policy</h2>
            </div>
            
            <div className="strategy-article-content">
              <h3>Overview</h3>
              <p>
                The copper-gold spread serves as a powerful indicator of macroeconomic regime shifts. 
                Copper, often called "Dr. Copper" for its diagnostic value, reflects industrial demand and 
                global growth expectations. Gold, conversely, responds to monetary policy, inflation expectations, 
                and safe-haven demand. Analyzing their relative performance can reveal important insights about 
                the economic environment.
              </p>
              
              <h3>Current Market Context</h3>
              <p>
                Recent months have shown a notable divergence between copper and gold prices. While gold has 
                reached multi-year highs on the back of central bank buying and geopolitical uncertainty, 
                copper has been more volatile, reflecting mixed signals about global industrial demand.
              </p>
              
              <h3>Key Factors</h3>
              <ul>
                <li><strong>Monetary Policy:</strong> Central bank rate decisions and forward guidance impact gold's 
                opportunity cost and copper's financing costs</li>
                <li><strong>China's Economy:</strong> As the world's largest copper consumer, Chinese economic data 
                significantly influences copper prices</li>
                <li><strong>Dollar Strength:</strong> Both metals are sensitive to USD movements, but often in 
                different ways</li>
                <li><strong>Geopolitical Risk:</strong> Gold benefits from safe-haven flows during periods of 
                uncertainty</li>
              </ul>
              
              <h3>Spread Analysis</h3>
              <p>
                The copper-gold ratio (copper price / gold price) has historically been a useful indicator. 
                When the ratio is rising, it suggests strong industrial demand relative to monetary concerns. 
                When falling, it indicates risk-off sentiment or monetary policy dominance.
              </p>
              
              <h3>Educational Takeaways</h3>
              <p>
                This spread trade illustrates the importance of understanding different commodity drivers. 
                While both are metals, their price dynamics reflect entirely different economic forces. 
                Successful commodity trading requires analyzing these relationships and understanding when 
                macro regimes shift.
              </p>
            </div>
          </article>

          <article className="strategy-article">
            <div className="strategy-article-header">
              <div className="strategy-article-meta">
                <span className="strategy-article-week">Week of March 11, 2024</span>
                <span className="strategy-article-focus">Curve Analysis</span>
              </div>
              <h2 className="strategy-article-title">Crude Oil Contango Structure: Storage Economics</h2>
            </div>
            
            <div className="strategy-article-content">
              <h3>Overview</h3>
              <p>
                The forward curve structure in crude oil markets provides valuable information about supply-demand 
                dynamics, storage economics, and market expectations. Understanding contango (futures prices above 
                spot) versus backwardation (futures prices below spot) is essential for commodity market analysis.
              </p>
              
              <h3>Current Curve Structure</h3>
              <p>
                WTI crude oil has recently exhibited a contango structure, particularly in the near-term months. 
                This suggests that the market expects current supply to exceed immediate demand, creating incentives 
                for storage rather than immediate consumption.
              </p>
              
              <h3>Storage Economics</h3>
              <p>
                In a contango market, traders can profit by:
              </p>
              <ul>
                <li>Buying physical oil at spot prices</li>
                <li>Storing it in tanks or tankers</li>
                <li>Selling futures contracts at higher prices</li>
                <li>Delivering the oil when the contract expires</li>
              </ul>
              <p>
                This arbitrage opportunity exists until storage costs plus financing costs equal the contango spread. 
                When storage fills up, the curve typically flattens or moves toward backwardation.
              </p>
              
              <h3>Key Indicators</h3>
              <ul>
                <li><strong>Storage Levels:</strong> EIA weekly inventory reports show whether storage capacity is 
                being utilized</li>
                <li><strong>Time Spreads:</strong> The difference between nearby and deferred contracts indicates 
                the strength of contango</li>
                <li><strong>Floating Storage:</strong> Tanker rates and utilization indicate whether traders are 
                storing oil at sea</li>
              </ul>
              
              <h3>Educational Takeaways</h3>
              <p>
                Curve structure analysis is fundamental to commodity trading. The shape of the forward curve 
                reflects market participants' expectations about future supply and demand, as well as the economics 
                of storage and transportation. Understanding these dynamics helps traders identify opportunities and 
                assess market conditions.
              </p>
            </div>
          </article>

          <article className="strategy-article">
            <div className="strategy-article-header">
              <div className="strategy-article-meta">
                <span className="strategy-article-week">Week of March 4, 2024</span>
                <span className="strategy-article-focus">Commodity-Specific</span>
              </div>
              <h2 className="strategy-article-title">Wheat-Corn Spread: Relative Value in Grain Markets</h2>
            </div>
            
            <div className="strategy-article-content">
              <h3>Overview</h3>
              <p>
                The wheat-corn spread is a classic agricultural commodity trade that reflects relative supply-demand 
                dynamics between two major grains. Both are used for food and feed, but have different growing 
                conditions, uses, and seasonal patterns.
              </p>
              
              <h3>Fundamental Drivers</h3>
              <p>
                Wheat and corn prices are influenced by:
              </p>
              <ul>
                <li><strong>Weather:</strong> Growing conditions in major producing regions (US, Russia, Ukraine, 
                Argentina, Brazil)</li>
                <li><strong>Export Demand:</strong> Global trade flows, particularly from major importers like 
                China and Middle Eastern countries</li>
                <li><strong>Feed Demand:</strong> Livestock production and feed usage</li>
                <li><strong>Biofuel Policy:</strong> Corn ethanol mandates affect corn demand</li>
              </ul>
              
              <h3>Spread Dynamics</h3>
              <p>
                Historically, wheat has traded at a premium to corn due to its higher protein content and use in 
                human food products. However, this spread can widen or narrow based on relative supply-demand 
                imbalances. When wheat supplies are tight relative to corn, the spread widens. When corn demand 
                is strong (e.g., ethanol production), the spread can narrow.
              </p>
              
              <h3>Current Analysis</h3>
              <p>
                Recent weather patterns in key wheat-growing regions have created supply concerns, while corn 
                markets have been more balanced. This has led to a widening of the wheat-corn spread, reflecting 
                the relative tightness in wheat supplies.
              </p>
              
              <h3>Educational Takeaways</h3>
              <p>
                Spread trading in agricultural commodities requires understanding both individual commodity fundamentals 
                and their relative relationships. Weather, policy, and demand factors can affect each commodity 
                differently, creating trading opportunities based on relative value rather than absolute price levels.
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
};

export default Strategies;

