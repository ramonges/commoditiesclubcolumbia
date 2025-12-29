import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './ArticleDetail.css';

interface ArticleBlock {
  block_type: string;
  content: string | null;
  image_url: string | null;
  image_alt: string | null;
  block_order: number;
}

interface Article {
  id: string;
  title: string;
  subtitle: string | null;
  category: string;
  subcategory: string;
  author_email: string | null;
  published_at: string;
  blocks: ArticleBlock[];
}

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  const fetchArticle = async (articleId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch article
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single();

      if (articleError) throw articleError;
      if (!articleData) {
        setError('Article not found');
        return;
      }

      // Fetch article blocks
      const { data: blocksData, error: blocksError } = await supabase
        .from('article_blocks')
        .select('*')
        .eq('article_id', articleId)
        .order('block_order', { ascending: true });

      if (blocksError) throw blocksError;

      setArticle({
        ...articleData,
        blocks: blocksData || []
      });
    } catch (err: any) {
      console.error('Error fetching article:', err);
      setError(err.message || 'Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      'energy': 'Energy',
      'precious-metals': 'Precious Metals',
      'base-metals': 'Base Metals',
      'agriculture': 'Agriculture'
    };
    return categories[category] || category;
  };

  const getSubcategoryName = (subcategory: string) => {
    return subcategory.split('-').map(w => 
      w.charAt(0).toUpperCase() + w.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="article-detail-page">
        <div className="container">
          <div className="loading-state">
            <p>Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-detail-page">
        <div className="container">
          <div className="error-state">
            <h2>Article Not Found</h2>
            <p>{error || 'The article you are looking for does not exist.'}</p>
            <button onClick={() => navigate('/news')} className="btn btn-primary">
              Back to News
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      <div className="container">
        <button onClick={() => navigate('/news')} className="back-button">
          ← Back to News
        </button>

        <article className="article-content">
          <div className="article-header">
            <div className="article-meta">
              <span className={`article-category tag-${article.category}`}>
                {getCategoryName(article.category)}
              </span>
              <span className="article-subcategory">
                {getSubcategoryName(article.subcategory)}
              </span>
            </div>
            <div className="article-dates">
              <span className="article-date">Published: {formatDate(article.published_at)}</span>
              {article.author_email && (
                <span className="article-author">By {article.author_email}</span>
              )}
            </div>
          </div>

          <div className="article-blocks">
            {article.blocks.map((block, index) => (
              <div key={index} className={`article-block block-${block.block_type}`}>
                {block.block_type === 'title' && block.content && (
                  <h1 className="article-title">{block.content}</h1>
                )}
                {block.block_type === 'subtitle' && block.content && (
                  <h2 className="article-subtitle">{block.content}</h2>
                )}
                {block.block_type === 'text' && block.content && (
                  <div className="article-text">
                    {block.content.split('\n').map((paragraph, pIndex) => (
                      paragraph.trim() && (
                        <p key={pIndex}>{paragraph}</p>
                      )
                    ))}
                  </div>
                )}
                {block.block_type === 'image' && block.image_url && (
                  <figure className="article-image">
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

          {article.blocks.length === 0 && (
            <div className="empty-article">
              <p>This article has no content yet.</p>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;


