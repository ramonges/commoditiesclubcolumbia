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
            <h1 className="hero-title">A student-led club for commodity markets</h1>
            <p className="hero-description">
              Bridging the gap between academia and markets
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

      {/* Founding Members Call-to-Action */}
      <section className="section section-founding">
        <div className="container">
          <div className="founding-layout">
            <div className="founding-intro">
              <h2 className="section-title">Become a 3C Founding Member</h2>
              <p className="founding-text">
                Would you want to be highlighted as a 3C founding member on our website?
              </p>
              <p className="founding-text">
                If so, please send:
              </p>
              <ul className="founding-list">
                <li>A high-quality headshot</li>
                <li>A short blurb (background + interests in commodities)</li>
              </ul>
              <p className="founding-text">
                You can send it to us on WhatsApp, or upload it to the Google Drive link below (better for picture quality).
              </p>
              <div className="founding-actions">
                <a 
                  href="https://wa.me/33647412004" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-large"
                >
                  WhatsApp +33 6 47 41 20 04
                </a>
                <a 
                  href="https://drive.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-large"
                >
                  Upload via Google Drive
                </a>
              </div>
            </div>

            <div className="founding-profiles">
              <h3 className="founding-profiles-title">Founding Member Profiles</h3>
              <div className="founding-grid">
                <article className="member-card">
                  <img
                    src="/assets/timothe_jekel.png"
                    alt="Timothe Jekel"
                    className="member-card-image"
                  />
                  <h4 className="member-card-name">Timothe Jekel</h4>
                  <p className="member-card-bio">
                    Timothe is originally from Paris and focuses on the intersection of geopolitics, commodity markets,
                    and the energy transition. He has worked at the International Energy Agency during the EU gas crisis
                    and at Kpler on global energy flows and market analysis. At Columbia, he founded the Columbia
                    Commodity Club to foster open, rigorous and market-driven conversations on energy and commodities.
                  </p>
                </article>

                <article className="member-card">
                  <img
                    src="/assets/raphaelmonges-67b3e979-6bf4-46bf-b5fb-71271a96a77b.png"
                    alt="Raphael Monges"
                    className="member-card-image"
                  />
                  <h4 className="member-card-name">Raphael Monges</h4>
                  <p className="member-card-bio">
                    Raphael is a graduate student at Columbia Engineering, focusing on building tools that make trading
                    energy, metals and agricultural commodities more efficient. He has worked with freight companies to
                    help forecast maritime freight rates and is preparing for a career as a commodity trader, contributing
                    researched articles to this platform.
                  </p>
                </article>

                <article className="member-card">
                  <img
                    src="/assets/davidtang-e602b976-7584-4492-a694-79c7ec3b1e03.png"
                    alt="David Tang"
                    className="member-card-image"
                  />
                  <h4 className="member-card-name">David Tang</h4>
                  <p className="member-card-bio">
                    David is pursuing a Master’s in Climate &amp; Society at Columbia Climate School, with a background in
                    chemical engineering and atmospheric chemistry. He focuses on power, renewable energy certificates,
                    carbon markets and emerging low‑carbon commodities, bridging climate science with energy market
                    strategy to support the clean energy transition.
                  </p>
                </article>

                <article className="member-card">
                  <img
                    src="/assets/Hans_Sutkino-7df48fdb-5074-4cf7-b0c6-1bb1c041d82d.png"
                    alt="Hans Sutikno"
                    className="member-card-image"
                  />
                  <h4 className="member-card-name">Hans Sutikno</h4>
                  <p className="member-card-bio">
                    Hans is an M.S. in Sustainability Management candidate at Columbia, focusing on energy finance as a
                    Global Energy Fellow at the Center on Global Energy Policy. He has worked on critical minerals and
                    transition finance research, and previously drove sustainable finance strategy and client engagement
                    on decarbonization and green finance in Indonesia&apos;s banking sector.
                  </p>
                </article>

                <article className="member-card">
                  <img
                    src="/assets/jasmin_zheng-9219e371-ed12-4eb8-a588-012cacd65903.png"
                    alt="Jasmin Zheng"
                    className="member-card-image"
                  />
                  <h4 className="member-card-name">Jasmin Zheng</h4>
                  <p className="member-card-bio">
                    Jasmin is pursuing an MA in Climate and Society at the Columbia Climate School. She works at the
                    intersection of climate policy, biodiversity, development finance and impact measurement, with a
                    growing interest in how commodity markets can finance the energy and nature transition.
                  </p>
                </article>

                <article className="member-card">
                  <img
                    src="/assets/Rahul_verma-4b88e090-3aea-48e2-99b1-61db6fd8d4c8.png"
                    alt="Rahul Verma"
                    className="member-card-image"
                  />
                  <h4 className="member-card-name">Rahul Verma</h4>
                  <p className="member-card-bio">
                    Rahul is an MS in Climate Finance student at Columbia. He previously worked at a critical minerals
                    trading firm focused on battery metals and rare earths, and has experience in energy private equity.
                    He supports the Columbia Commodity Club and is keen to deepen his involvement in global commodity
                    markets.
                  </p>
                </article>

                <article className="member-card">
                  <img
                    src="/assets/Salman_al_fathan-e0b32a02-0396-44b6-a478-c18bae201ad7.png"
                    alt="Salman Al Fathan"
                    className="member-card-image"
                  />
                  <h4 className="member-card-name">Salman Al Fathan</h4>
                  <p className="member-card-bio">
                    Salman has five years of experience in partnership development, policy research, project management
                    and data analysis. Now pursuing an MA in Climate and Society at Columbia, he is passionate about
                    climate mitigation policies, the energy transition and driving sustainable climate investments.
                  </p>
                </article>
              </div>
            </div>
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

