import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Home.css';

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

const Home = () => {
  const [latestArticles, setLatestArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestArticles();
  }, []);

  const fetchLatestArticles = async () => {
    try {
      setLoading(true);
      // Fetch articles excluding strategies category (which is now Research)
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .neq('category', 'strategies')
        .order('published_at', { ascending: false })
        .limit(3);

      if (articlesError) throw articlesError;

      if (!articlesData || articlesData.length === 0) {
        setLatestArticles([]);
        setLoading(false);
        return;
      }

      // Fetch blocks for the articles
      const articleIds = articlesData.map(a => a.id);
      const { data: blocksData, error: blocksError } = await supabase
        .from('article_blocks')
        .select('*')
        .in('article_id', articleIds)
        .order('block_order', { ascending: true });

      if (blocksError) throw blocksError;

      // Combine articles with their blocks
      const articlesWithBlocks: NewsArticle[] = articlesData.map(article => ({
        id: article.id,
        title: article.title,
        subtitle: article.subtitle,
        category: article.category,
        subcategory: article.subcategory,
        published_at: article.published_at,
        blocks: (blocksData || []).filter(b => b.article_id === article.id)
      }));

      setLatestArticles(articlesWithBlocks);
    } catch (error) {
      console.error('Error fetching latest articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      'energy': 'Energy',
      'precious-metals': 'Metals',
      'base-metals': 'Metals',
      'metals': 'Metals',
      'agriculture': 'Agriculture'
    };
    return categories[category] || category;
  };

  const getCategoryTagClass = (category: string) => {
    const tagClasses: { [key: string]: string } = {
      'energy': 'tag-energy',
      'precious-metals': 'tag-metals',
      'base-metals': 'tag-metals',
      'metals': 'tag-metals',
      'agriculture': 'tag-agriculture'
    };
    return tagClasses[category] || 'tag-energy';
  };

  const getArticleSummary = (article: NewsArticle) => {
    // Get first text block or subtitle as summary
    const textBlock = article.blocks.find(b => b.block_type === 'text');
    if (textBlock?.content) {
      return textBlock.content.substring(0, 200) + (textBlock.content.length > 200 ? '...' : '');
    }
    return article.subtitle || 'No summary available';
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">A student-led platform<br />exploring global commodity markets</h1>
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
            <h2 className="section-title">Latest Analysis</h2>
            <Link to="/news" className="section-link">View All Analysis →</Link>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
              Loading articles...
            </div>
          ) : latestArticles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
              No articles published yet. Check back soon!
            </div>
          ) : (
            <div className="news-grid">
              {latestArticles.map(article => (
                <article key={article.id} className="news-card">
                  <div className={`news-card-tag ${getCategoryTagClass(article.category)}`}>
                    {getCategoryName(article.category)}
                  </div>
                  <h3 className="news-card-title">{article.title}</h3>
                  <p className="news-card-summary">{getArticleSummary(article)}</p>
                  <div className="news-card-footer">
                    <span className="news-card-date">{formatDate(article.published_at)}</span>
                    <Link to={`/article/${article.id}`} className="news-card-link">Read More →</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
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
              We collaborate with leading firms in commodity trading, energy, agriculture, and mining 
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
            <h2 className="social-title">Follow Our Latest Analysis and Research</h2>
            <p className="social-description">
              Stay updated with our latest analysis and research published on Substack and LinkedIn.
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

