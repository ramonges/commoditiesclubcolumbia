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
            <Link to="/news" className="section-link">View All Analys