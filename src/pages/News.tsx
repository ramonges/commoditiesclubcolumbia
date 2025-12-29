import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './News.css';

interface ArticleBlock {
  block_type: string;
  content: string | null;
  image_url: string | null;
  image_alt: string | null;
  block_order: number;
}

interface NewsArticle {
  id: string;
  title: string;
  subtitle: string | null;
  category: string;
  subcategory: string;
  published_at: string;
  blocks: ArticleBlock[];
}

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

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

  const fetchArticles = async () => {
    try {
      setLoading(true);
      // Fetch articles
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (articlesError) throw articlesError;

      // Fetch blocks for all articles
      const articleIds = articlesData?.map(a => a.id) || [];
      const { data: blocksData, error: blocksError } = await supabase
        .from('article_blocks')
        .select('*')
        .in('article_id', articleIds)
        .order('block_order', { ascending: true });

      if (blocksError) throw blocksError;

      // Combine articles with their blocks
      const articlesWithBlocks: NewsArticle[] = (articlesData || []).map(article => ({
        id: article.id,
        title: article.title,
        subtitle: article.subtitle,
        category: article.category,
        subcategory: article.subcategory,
        published_at: article.published_at,
        blocks: (blocksData || []).filter(b => b.article_id === article.id)
      }));

      setArticles(articlesWithBlocks);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

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
    ]},
    { id: 'strategies', name: 'Weekly Trading Strategies', subcategories: [
      { id: 'macro-focus', name: 'Macro Focus' },
      { id: 'curve-analysis', name: 'Curve Analysis' },
      { id: 'commodity-specific', name: 'Commodity-Specific' },
      { id: 'spread-analysis', name: 'Spread Analysis' }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getArticleSummary = (article: NewsArticle) => {
    // Get first text block or subtitle as summary
    const textBlock = article.blocks.find(b => b.block_type === 'text');
    if (textBlock?.content) {
      return textBlock.content.substring(0, 200) + (textBlock.content.length > 200 ? '...' : '');
    }
    return article.subtitle || 'No summary available';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="container">
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

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
                        <div className={`news-card-tag tag-${article.category}`}>{category.name}</div>
                        <div className="news-card-subcategory">{category.subcategories.find(s => s.id === article.subcategory)?.name}</div>
                        <h3 className="news-card-title">{article.title}</h3>
                        <p className="news-card-summary">{getArticleSummary(article)}</p>
                        <div className="news-card-footer">
                          <span className="news-card-date">{formatDate(article.published_at)}</span>
                          <Link to={`/article/${article.id}`} className="news-card-link">Read More →</Link>
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
                      <p className="news-card-summary">{getArticleSummary(article)}</p>
                      <div className="news-card-footer">
                        <span className="news-card-date">{formatDate(article.published_at)}</span>
                        <Link to={`/article/${article.id}`} className="news-card-link">Read More →</Link>
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
