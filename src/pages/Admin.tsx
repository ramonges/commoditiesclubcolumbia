import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../lib/auth';
import { supabase } from '../lib/supabase';
import './Admin.css';

interface ArticleBlock {
  id: string;
  type: 'title' | 'subtitle' | 'text' | 'image';
  content: string;
  imageUrl?: string;
  imageAlt?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [blocks, setBlocks] = useState<ArticleBlock[]>([]);
  const [category, setCategory] = useState('energy');
  const [subcategory, setSubcategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
    } else {
      setUser(authService.getCurrentUser());
    }
  }, [navigate]);

  const categories = {
    energy: ['oil', 'natural-gas', 'power'],
    'precious-metals': ['gold', 'silver', 'copper'],
    'base-metals': ['aluminum', 'zinc-lead', 'nickel'],
    agriculture: ['grains', 'soft-commodities']
  };

  const addBlock = (type: ArticleBlock['type']) => {
    setBlocks([...blocks, {
      id: Date.now().toString(),
      type,
      content: '',
      imageUrl: '',
      imageAlt: ''
    }]);
  };

  const updateBlock = (id: string, updates: Partial<ArticleBlock>) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const handleImageUpload = async (blockId: string, file: File) => {
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      const { error } = await supabase.storage
        .from('article-images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);

      updateBlock(blockId, { imageUrl: publicUrl });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to upload image' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (blocks.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one content block' });
      return;
    }

    if (!subcategory) {
      setMessage({ type: 'error', text: 'Please select a subcategory' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Create article
      const { data: article, error: articleError } = await supabase
        .from('articles')
        .insert({
          title: blocks.find(b => b.type === 'title')?.content || 'Untitled',
          subtitle: blocks.find(b => b.type === 'subtitle')?.content || null,
          category,
          subcategory,
          author_email: user.email
        })
        .select()
        .single();

      if (articleError) throw articleError;

      // Create article blocks
      const blocksToInsert = blocks.map((block, index) => ({
        article_id: article.id,
        block_type: block.type,
        block_order: index,
        content: block.type !== 'image' ? block.content : null,
        image_url: block.type === 'image' ? block.imageUrl : null,
        image_alt: block.type === 'image' ? block.imageAlt : null
      }));

      const { error: blocksError } = await supabase
        .from('article_blocks')
        .insert(blocksToInsert);

      if (blocksError) throw blocksError;

      setMessage({ type: 'success', text: 'Article published successfully!' });
      setBlocks([]);
      setCategory('energy');
      setSubcategory('');
      
      setTimeout(() => {
        navigate('/news');
      }, 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to publish article' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Article Editor</h1>
            <p className="admin-subtitle">Welcome, {user.name}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>

        {message && (
          <div className={`admin-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-section">
            <h3 className="section-title">Category & Subcategory</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory('');
                  }}
                  className="form-select"
                >
                  <option value="energy">Energy</option>
                  <option value="precious-metals">Precious Metals</option>
                  <option value="base-metals">Base Metals</option>
                  <option value="agriculture">Agriculture</option>
                </select>
              </div>
              <div className="form-group">
                <label>Subcategory</label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select subcategory</option>
                  {categories[category as keyof typeof categories].map(sub => (
                    <option key={sub} value={sub}>
                      {sub.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3 className="section-title">Content Blocks</h3>
              <div className="block-buttons">
                <button type="button" onClick={() => addBlock('title')} className="btn btn-outline btn-sm">+ Title</button>
                <button type="button" onClick={() => addBlock('subtitle')} className="btn btn-outline btn-sm">+ Subtitle</button>
                <button type="button" onClick={() => addBlock('text')} className="btn btn-outline btn-sm">+ Text</button>
                <button type="button" onClick={() => addBlock('image')} className="btn btn-outline btn-sm">+ Image</button>
              </div>
            </div>

            {blocks.length === 0 && (
              <p className="empty-state">Click the buttons above to add content blocks</p>
            )}

            <div className="blocks-container">
              {blocks.map((block, index) => (
                <div key={block.id} className="block-item">
                  <div className="block-header">
                    <span className="block-type">{block.type}</span>
                    <div className="block-actions">
                      <button
                        type="button"
                        onClick={() => moveBlock(block.id, 'up')}
                        disabled={index === 0}
                        className="btn-icon"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(block.id, 'down')}
                        disabled={index === blocks.length - 1}
                        className="btn-icon"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(block.id)}
                        className="btn-icon btn-danger"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  
                  {block.type === 'image' ? (
                    <div className="block-content-image">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(block.id, file);
                        }}
                        className="file-input"
                      />
                      {block.imageUrl && (
                        <div className="image-preview">
                          <img src={block.imageUrl} alt={block.imageAlt || ''} />
                          <input
                            type="text"
                            placeholder="Image alt text"
                            value={block.imageAlt || ''}
                            onChange={(e) => updateBlock(block.id, { imageAlt: e.target.value })}
                            className="form-input"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      placeholder={`Enter ${block.type}...`}
                      className="block-textarea"
                      rows={block.type === 'title' ? 2 : block.type === 'subtitle' ? 2 : 6}
                      required
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-large" disabled={loading || blocks.length === 0}>
              {loading ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;

