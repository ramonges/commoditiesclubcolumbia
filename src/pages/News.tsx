import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './News.css';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  subcategory: string;
}

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

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

  const articles: NewsArticle[] = [
    // Energy - Oil
    { id: '1', title: 'Oil Market Dynamics: Supply Constraints and Demand Outlook', summary: 'Analysis of recent OPEC+ decisions and their impact on global crude prices, examining both short-term volatility and longer-term structural shifts in the energy landscape.', date: 'March 15, 2024', category: 'energy', subcategory: 'oil' },
    { id: '2', title: 'Crude Oil Futures: Forward Curve Analysis', summary: 'Examining the WTI forward curve structure and the economics of storage, identifying potential arbitrage opportunities.', date: 'March 10, 2024', category: 'energy', subcategory: 'oil' },
    // Energy - Natural Gas
    { id: '3', title: 'Natural Gas: Winter Demand Patterns and Storage Levels', summary: 'Examining the relationship between weather patterns, storage inventories, and natural gas pricing dynamics in North American markets.', date: 'March 8, 2024', category: 'energy', subcategory: 'natural-gas' },
    { id: '4', title: 'LNG Markets: Global Trade Flows and Pricing', summary: 'Analyzing the evolution of liquefied natural gas markets and their impact on regional pricing differentials.', date: 'March 5, 2024', category: 'energy', subcategory: 'natural-gas' },
    // Energy - Power
    { id: '5', title: 'Power Markets: Renewable Integration Challenges', summary: 'Exploring how the shift toward renewable energy sources is reshaping demand patterns and grid stability in power markets.', date: 'March 1, 2024', category: 'energy', subcategory: 'power' },
    { id: '6', title: 'Electricity Pricing: Regional Variations and Policy Impacts', summary: 'Examining how policy decisions and infrastructure investments affect electricity pricing across different regions.', date: 'February 28, 2024', category: 'energy', subcategory: 'power' },
    // Precious Metals - Gold
    { id: '7', title: 'Gold Rally: Central Bank Policy and Safe Haven Demand', summary: 'Exploring the factors driving gold prices to multi-year highs, with focus on monetary policy expectations and geopolitical risk premiums.', date: 'March 12, 2024', category: 'precious-metals', subcategory: 'gold' },
    { id: '8', title: 'Gold Futures: Technical Analysis and Market Sentiment', summary: 'Analyzing gold futures positioning and the relationship between ETF flows and physical demand.', date: 'March 7, 2024', category: 'precious-metals', subcategory: 'gold' },
    // Precious Metals - Silver
    { id: '9', title: 'Silver: Industrial Demand Meets Monetary Hedge', summary: 'Analyzing silver\'s dual role as both an industrial metal and a monetary asset, and how this creates unique price dynamics.', date: 'March 5, 2024', category: 'precious-metals', subcategory: 'silver' },
    { id: '10', title: 'Silver Market: Solar Panel Demand and Supply Constraints', summary: 'Examining how the growth in solar panel manufacturing is affecting silver demand and pricing.', date: 'March 2, 2024', category: 'precious-metals', subcategory: 'silver' },
    // Precious Metals - Copper (user mentioned copper for precious, but it's typically base metal - I'll include it here as requested)
    { id: '11', title: 'Copper: The Barometer of Global Economic Health', summary: 'Understanding copper\'s role as an economic indicator and analyzing current market trends in the context of global growth expectations.', date: 'March 10, 2024', category: 'precious-metals', subcategory: 'copper' },
    // Base Metals
    { id: '12', title: 'Aluminum: Energy Costs and Supply Chain Dynamics', summary: 'Examining how energy prices impact aluminum production costs and the resulting effects on global supply chains and pricing.', date: 'March 3, 2024', category: 'base-metals', subcategory: 'aluminum' },
    { id: '13', title: 'Zinc and Lead: Infrastructure Investment and Battery Demand', summary: 'Analyzing the impact of infrastructure spending and battery technology on zinc and lead markets, including supply constraints.', date: 'February 25, 2024', category: 'base-metals', subcategory: 'zinc-lead' },
    { id: '14', title: 'Nickel: EV Battery Demand and Supply Chain Evolution', summary: 'Exploring how electric vehicle production is reshaping nickel demand and the implications for mining and refining capacity.', date: 'February 22, 2024', category: 'base-metals', subcategory: 'nickel' },
    // Agriculture
    { id: '15', title: 'Grain Markets: Weather Patterns and Export Dynamics', summary: 'Assessing the impact of El Niño on crop yields and the evolving trade flows in global grain markets, particularly wheat and corn.', date: 'March 10, 2024', category: 'agriculture', subcategory: 'grains' },
    { id: '16', title: 'Coffee: Climate Change and Supply Chain Resilience', summary: 'Exploring how changing weather patterns are affecting coffee production regions and the implications for global supply and pricing.', date: 'March 7, 2024', category: 'agriculture', subcategory: 'soft-commodities' },
    { id: '17', title: 'Sugar: Brazilian Production and Global Trade Flows', summary: 'Analyzing Brazil\'s role as a major sugar producer and exporter, and how production cycles affect global pricing dynamics.', date: 'March 2, 2024', category: 'agriculture', subcategory: 'soft-commodities' },
  ];

  const categories = [
    { id: 'energy', name: 'Energy', subcategories: [
      { id: 'oil', name: 'Oil' },
      { id: 'natural-gas', name: 'Natural Gas' },
      { id: 'power', name: 'Power' }
    ]},
    { id: 'precious-metals', name: 'Precious Metals', subcategories: [
      { id: 'gold', name: 'Gold' },
      { id: 'silver', name: 'Silver' },
      { id: 'copper', name: 'Copper' }
    ]},
    { id: 'base-metals', name: 'Base Metals', subcategories: [
      { id: 'aluminum', name: 'Aluminum' },
      { id: 'zinc-lead', name: 'Zinc & Lead' },
      { id: 'nickel', name: 'Nickel' }
    ]},
    { id: 'agriculture', name: 'Agriculture', subcategories: [
      { id: 'grains', name: 'Grains' },
      { id: 'soft-commodities', name: 'Soft Commodities' }
    ]}
  ];

  const filteredArticles = articles.filter(article => {
    if (selectedCategory === 'all') return true;
    if (article.category !== selectedCategory) return false;
    if (selectedSubcategory === 'all') return true;
    return article.subcategory === selectedSubcategory;
  });

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('all');
  };

  const getCategoryArticles = (categoryId: string) => {
    return articles.filter(a => a.category === categoryId);
  };

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">News & Analysis</h1>
          <p className="page-subtitle">In-depth coverage of global commodity markets across energy, metals, and agriculture</p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="section section-filters">
        <div className="container">
          <div className="filters-container">
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select 
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            {selectedCategory !== 'all' && (
              <div className="filter-group">
                <label className="filter-label">Subcategory</label>
                <select 
                  className="filter-select"
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                >
                  <option value="all">All {categories.find(c => c.id === selectedCategory)?.name}</option>
                  {categories.find(c => c.id === selectedCategory)?.subcategories.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* News Categories */}
      <section className="section section-news-page">
        <div className="container">
          {selectedCategory === 'all' ? (
            // Show all categories
            categories.map(category => {
              const categoryArticles = getCategoryArticles(category.id);
              if (categoryArticles.length === 0) return null;
              
              return (
                <div key={category.id} className="news-category" id={category.id}>
                  <div className="category-header">
                    <h2 className="category-title">{category.name}</h2>
                    <span className="category-count">{categoryArticles.length} articles</span>
                  </div>
                  <div className="category-filters">
                    {category.subcategories.map(sub => (
                      <button
                        key={sub.id}
                        className={`subcategory-filter ${selectedSubcategory === sub.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setSelectedSubcategory(sub.id);
                        }}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                  <div className="news-grid">
                    {categoryArticles.map(article => (
                      <article key={article.id} className="news-card">
                        <div className={`news-card-tag tag-${category.id}`}>{category.name}</div>
                        <div className="news-card-subcategory">{category.subcategories.find(s => s.id === article.subcategory)?.name}</div>
                        <h3 className="news-card-title">{article.title}</h3>
                        <p className="news-card-summary">{article.summary}</p>
                        <div className="news-card-footer">
                          <span className="news-card-date">{article.date}</span>
                          <a href="#" className="news-card-link">Read More →</a>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // Show filtered results
            <div className="news-category" id={selectedCategory}>
              <div className="category-header">
                <h2 className="category-title">{categories.find(c => c.id === selectedCategory)?.name}</h2>
                <span className="category-count">{filteredArticles.length} articles</span>
              </div>
              {selectedCategory !== 'all' && (
                <div className="category-filters">
                  {categories.find(c => c.id === selectedCategory)?.subcategories.map(sub => (
                    <button
                      key={sub.id}
                      className={`subcategory-filter ${selectedSubcategory === sub.id ? 'active' : ''}`}
                      onClick={() => setSelectedSubcategory(sub.id)}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
              <div className="news-grid">
                {filteredArticles.map(article => {
                  const category = categories.find(c => c.id === article.category);
                  return (
                    <article key={article.id} className="news-card">
                      <div className={`news-card-tag tag-${article.category}`}>{category?.name}</div>
                      <div className="news-card-subcategory">{category?.subcategories.find(s => s.id === article.subcategory)?.name}</div>
                      <h3 className="news-card-title">{article.title}</h3>
                      <p className="news-card-summary">{article.summary}</p>
                      <div className="news-card-footer">
                        <span className="news-card-date">{article.date}</span>
                        <a href="#" className="news-card-link">Read More →</a>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default News;
