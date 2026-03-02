import { useEffect, useState, useRef } from 'react';
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

const memberProfiles = [
  {
    name: 'Timothe Jekel',
    image: '/assets/timothe_jekel.png',
    bio: 'Timothe is originally from Paris and focuses on the intersection of geopolitics, commodity markets, and the energy transition. He has worked at the International Energy Agency during the EU gas crisis and at Kpler on global energy flows and market analysis. At Columbia, he founded the Columbia Commodity Club to foster open, rigorous and market-driven conversations on energy and commodities.'
  },
  {
    name: 'Raphael Monges',
    image: '/assets/raphael_monges.png',
    bio: 'Raphael is a graduate student at Columbia Engineering, focusing on building tools that make trading energy, metals and agricultural commodities more efficient. He has worked with freight companies to help forecast maritime freight rates and is preparing for a career as a commodity trader, contributing researched articles to this platform.'
  },
  {
    name: 'David Tang',
    image: '/assets/david_tang.png',
    bio: 'David is pursuing a Master’s in Climate & Society at Columbia Climate School, with a background in chemical engineering and atmospheric chemistry. He focuses on power, renewable energy certificates, carbon markets and emerging low‑carbon commodities, bridging climate science with energy market strategy to support the clean energy transition.'
  },
  {
    name: 'Hans Sutikno',
    image: '/assets/hans_sutikno.png',
    bio: "Hans is an M.S. in Sustainability Management candidate at Columbia, focusing on energy finance as a Global Energy Fellow at the Center on Global Energy Policy. He has worked on critical minerals and transition finance research, and previously drove sustainable finance strategy and client engagement on decarbonization and green finance in Indonesia's banking sector."
  },
  {
    name: 'Jasmin Zheng',
    image: '/assets/jasmin_zheng.png',
    bio: 'Jasmin is pursuing an MA in Climate and Society at the Columbia Climate School. She works at the intersection of climate policy, biodiversity, development finance and impact measurement, with a growing interest in how commodity markets can finance the energy and nature transition.'
  },
  {
    name: 'Rahul Verma',
    image: '/assets/rahul_verma.png',
    bio: 'Rahul is an MS in Climate Finance student at Columbia. He previously worked at a critical minerals trading firm focused on battery metals and rare earths, and has experience in energy private equity. He supports the Columbia Commodity Club and is keen to deepen his involvement in global commodity markets.'
  },
  {
    name: 'Salman Al Fathan',
    image: '/assets/salman_al_fathan.png',
    bio: 'Salman has five years of experience in partnership development, policy research, project management and data analysis. Now pursuing an MA in Climate and Society at Columbia, he is passionate about climate mitigation policies, the energy transition and driving sustainable climate investments.'
  }
];

const Home = () => {
  const [latestArticles, setLatestArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement | null>(null);

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

  const scrollCarousel = (direction: 'left' | 'right') => {
    const container = carouselRef.current;
    if (!container || !container.firstElementChild) return;

    const firstCard = container.firstElementChild as HTMLElement;
    const cardWidth = firstCard.offsetWidth;
    const gap = 16; // approximate gap between cards
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
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

      {/* Become 3C Member + Profiles Carousel */}
      <section className="section section-founding">
        <div className="container">
          <div className="founding-carousel">
            <h3 className="founding-profiles-title">Member Profiles</h3>
            <div className="carousel-wrapper">
              <button
                type="button"
                className="carousel-arrow carousel-arrow-left"
                onClick={() => scrollCarousel('left')}
                aria-label="Scroll profiles left"
              >
                ‹
              </button>
              <div className="carousel-track" ref={carouselRef}>
                {memberProfiles.map(profile => (
                  <article key={profile.name} className="member-card">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="member-card-image"
                    />
                    <h4 className="member-card-name">{profile.name}</h4>
                    <p className="member-card-bio">{profile.bio}</p>
                  </article>
                ))}
              </div>
              <button
                type="button"
                className="carousel-arrow carousel-arrow-right"
                onClick={() => scrollCarousel('right')}
                aria-label="Scroll profiles right"
              >
                ›
              </button>
            </div>
          </div>

          <div className="founding-intro founding-intro-centered">
            <h2 className="section-title">Become a 3C Member</h2>
            <p className="founding-text">
              Would you want to be highlighted as a 3C member on our website?
            </p>
            <p className="founding-text">
              If so, please send:
            </p>
            <ul className="founding-list">
              <li>A high-quality headshot</li>
              <li>A short blurb (background + interests in commodities)</li>
            </ul>
            <p className="founding-text">
              You can send it to us on WhatsApp.
            </p>
            <div className="founding-actions">
              <a 
                href="https://wa.me/33647412004" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary btn-large"
              >
                Contact us on WhatsApp
              </a>
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

