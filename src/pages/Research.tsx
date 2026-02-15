import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Research.css';

interface ArticleBlock {
  block_type: string;
  content: string | null;
  image_url: string | null;
  image_alt: string | null;
  block_order: number;
}

interface ResearchArticle {
  id: string;
  title: string;
  subtitle: string | null;
  subcategory: string;
  published_at: string;
  blocks: ArticleBlock[];
}

const Research = () => {
  const [articles, setArticles] = useState<ResearchArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      setLoading(true);
      // Fetch research articles (strategies category)
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .eq('category', 'strategies')
        .order('published_at', { ascending: false });

      if (articlesError) throw articlesError;

      // Fetch blocks for all articles
      const articleIds = articlesData?.map(a => a.id) || [];
      if (articleIds.length > 0) {
        const { data: blocksData, error: blocksError } = await supabase
          .from('article_blocks')
          .select('*')
          .in('article_id', articleIds)
          .order('block_order', { ascending: true });

        if (blocksError) throw blocksError;

        // Combine articles with their blocks
        const articlesWithBlocks: ResearchArticle[] = (articlesData || []).map(article => ({
          id: article.id,
          title: article.title,
          subtitle: article.subtitle,
          subcategory: article.subcategory,
          published_at: article.published_at,
          blocks: (blocksData || []).filter(b => b.article_id === article.id)
        }));

        setArticles(articlesWithBlocks);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error('Error fetching research:', error);
    } finally {
      setLoading(false);
    }
  };

  const subcategories = [
    { id: 'macro-focus', name: 'Macro Focus' },
    { id: 'curve-analysis', name: 'Curve Analysis' },
    { id: 'commodity-specific', name: 'Commodity-Specific' },
    { id: 'spread-analysis', name: 'Spread Analysis' }
  ];

  const filteredArticles = selectedSubcategory === 'all' 
    ? articles 
    : articles.filter(a => a.subcategory === selectedSubcategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getSubcategoryName = (subcategory: string) => {
    return subcategory.split('-').map(w => 
      w.charAt(0).toUpperCase() + w.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <>
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">Research</h1>
            <p className="page-subtitle">
              Educational analysis focusing on macro themes, spreads, curves, and commodity-specific setups
            </p>
            <p className="page-disclaimer">
              <em>Note: This content is for educational purposes only and does not constitute investment advice.</em>
            </p>
          </div>
        </section>
        <section className="section section-research-page">
          <div className="container">
            <p>Loading research...</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Research</h1>
          <p className="page-subtitle">
            Educational analysis focusing on macro themes, spreads, curves, and commodity-specific setups
          </p>
          <p className="page-disclaimer">
            <em>Note: This content is for educational purposes only and does not constitute investment advice.</em>
          </p>
        </div>
      </section>

      {/* Filter Section */}
      {articles.length > 0 && (
        <section className="section section-filters">
          <div className="container">
            <div className="filters-container">
              <div className="filter-group">
                <label className="filter-label">Filter by Type</label>
                <select 
                  className="filter-select"
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                >
                  <option value="all">All Research</option>
                  {subcategories.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Research Content */}
      <section className="section section-research-page">
        <div className="container">
          {articles.length === 0 ? (
            <div className="empty-research">
              <p>No research published yet. Check back soon!</p>
            </div>
          ) : (
            <>
              {filteredArticles.map(article => (
                <article key={article.id} className="research-article">
                  <div className="research-article-header">
                    <div className="research-article-meta">
                      <span className="research-article-date">
                        Published {formatDate(article.published_at)}
                      </span>
                      <span className="research-article-focus">
                        {getSubcategoryName(article.subcategory)}
                      </span>
                    </div>
                    <h2 className="research-article-title">{article.title}</h2>
                    {article.subtitle && (
                      <p className="research-article-subtitle">{article.subtitle}</p>
                    )}
                  </div>
                  
                  <div className="research-article-content">
                    {article.blocks.map((block, index) => (
                      <div key={index} className={`research-block block-${block.block_type}`}>
                        {block.block_type === 'text' && block.content && (
                          <div className="research-text">
                            {block.content.split('\n').map((paragraph, pIndex) => (
                              paragraph.trim() && (
                                <p key={pIndex}>{paragraph}</p>
                              )
                            ))}
                          </div>
                        )}
                        {block.block_type === 'image' && block.image_url && (
                          <figure className="research-image">
                            <img 
                              src={block.image_url} 
                              alt={block.image_alt || ''} 
                              loading="lazy"
                            />
                            {block.image_alt && (
                              <figcaption>{block.image_alt}</figcaption>
                            )}
                          </figure>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="research-article-footer">
                    <Link to={`/article/${article.id}`} className="research-read-more">
                      Read Full Analysis →
                    </Link>
                  </div>
                </article>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Research;
