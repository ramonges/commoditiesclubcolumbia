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
  const [activeTab, setActiveTab] = useState<'article' | 'event'>('article');
  
  // Article state
  const [blocks, setBlocks] = useState<ArticleBlock[]>([]);
  const [category, setCategory] = useState('energy');
  const [subcategory, setSubcategory] = useState('');
  
  // Event state
  const [eventMonth, setEventMonth] = useState('');
  const [eventDay, setEventDay] = useState('');
  const [eventType, setEventType] = useState('Dinner');
  const [eventTitle, setEventTitle] = useState('');
  const [eventSummary, setEventSummary] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [eventTimeFrom, setEventTimeFrom] = useState('');
  const [eventTimeTo, setEventTimeTo] = useState('');
  const [eventRsvpLink, setEventRsvpLink] = useState('');
  const [eventFeatured, setEventFeatured] = useState(false);
  
  // Event editing state
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  
  // Article management state
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [originalPublishedAt, setOriginalPublishedAt] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
    } else {
      setUser(authService.getCurrentUser());
      if (activeTab === 'event') {
        fetchEvents();
      } else if (activeTab === 'article') {
        fetchArticles();
      }
    }
  }, [navigate, activeTab]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });
      
      if (error) throw error;
      
      // Filter to show only future events (or events not marked as past)
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const futureEvents = (data || []).filter(event => {
        const eventDate = new Date(event.event_date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= now && !event.is_past;
      });
      
      setEvents(futureEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const loadArticleForEditing = async (article: any) => {
    setLoading(true);
    setMessage(null);
    
    try {
      // Fetch article blocks
      const { data: blocksData, error: blocksError } = await supabase
        .from('article_blocks')
        .select('*')
        .eq('article_id', article.id)
        .order('block_order', { ascending: true });

      if (blocksError) throw blocksError;

      // Convert database blocks to form blocks
      const formBlocks: ArticleBlock[] = (blocksData || []).map(block => ({
        id: block.id,
        type: block.block_type as ArticleBlock['type'],
        content: block.content || '',
        imageUrl: block.image_url || '',
        imageAlt: block.image_alt || ''
      }));

      // Set form state
      setCategory(article.category);
      setSubcategory(article.subcategory);
      setBlocks(formBlocks);
      setSelectedArticleId(article.id);
      setEditingArticle(article);
      setOriginalPublishedAt(article.published_at);
      
      // Scroll to form
      setTimeout(() => {
        const formElement = document.querySelector('.admin-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to load article' });
    } finally {
      setLoading(false);
    }
  };

  const resetArticleForm = () => {
    setBlocks([]);
    setCategory('energy');
    setSubcategory('');
    setSelectedArticleId(null);
    setEditingArticle(null);
    setOriginalPublishedAt(null);
  };

  const handleDeleteArticle = async (articleId: string, articleTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${articleTitle}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Delete article blocks first (they have foreign key constraint)
      const { error: blocksError } = await supabase
        .from('article_blocks')
        .delete()
        .eq('article_id', articleId);

      if (blocksError) throw blocksError;

      // Then delete the article
      const { error: articleError } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId);

      if (articleError) throw articleError;

      setMessage({ type: 'success', text: 'Article deleted successfully!' });
      
      // Reset form if deleting the currently edited article
      if (selectedArticleId === articleId) {
        resetArticleForm();
      }
      
      // Refresh articles list
      await fetchArticles();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete article' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Event deleted successfully!' });
      
      // Reset form if deleting the currently edited event
      if (selectedEventId === eventId) {
        resetEventForm();
      }
      
      // Refresh events list
      await fetchEvents();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete event' });
    } finally {
      setLoading(false);
    }
  };

  const loadEventForEditing = (event: any) => {
    const eventDate = new Date(event.event_date);
    const month = (eventDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = eventDate.getUTCDate().toString().padStart(2, '0');
    
    setEventMonth(month);
    setEventDay(day);
    setEventType(event.event_type);
    setEventTitle(event.title);
    setEventSummary(event.summary);
    setEventAddress(event.address);
    setEventTimeFrom(event.time_from);
    setEventTimeTo(event.time_to || '');
    setEventRsvpLink(event.rsvp_link || '');
    setEventFeatured(event.featured);
    setSelectedEventId(event.id);
    setEditingEvent(event);
  };

  const resetEventForm = () => {
    setEventMonth('');
    setEventDay('');
    setEventType('Dinner');
    setEventTitle('');
    setEventSummary('');
    setEventAddress('');
    setEventTimeFrom('');
    setEventTimeTo('');
    setEventRsvpLink('');
    setEventFeatured(false);
    setSelectedEventId(null);
    setEditingEvent(null);
  };

  const categories = {
    energy: ['oil', 'natural-gas', 'power'],
    metals: ['gold', 'silver', 'copper', 'nickel', 'iron-ore', 'rare-earth'],
    agriculture: ['wheat', 'coffee', 'sugar', 'soybeans', 'corn'],
    strategies: ['macro-focus', 'curve-analysis', 'commodity-specific', 'spread-analysis']
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
      if (selectedArticleId && editingArticle) {
        // Update existing article - preserve original published_at date
        const { error: articleError } = await supabase
          .from('articles')
          .update({
            title: blocks.find(b => b.type === 'title')?.content || 'Untitled',
            subtitle: blocks.find(b => b.type === 'subtitle')?.content || null,
            category,
            subcategory,
            published_at: originalPublishedAt, // Keep original publication date
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedArticleId);

        if (articleError) throw articleError;

        // Delete old blocks
        const { error: deleteBlocksError } = await supabase
          .from('article_blocks')
          .delete()
          .eq('article_id', selectedArticleId);

        if (deleteBlocksError) throw deleteBlocksError;

        // Insert updated blocks
        const blocksToInsert = blocks.map((block, index) => ({
          article_id: selectedArticleId,
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

        setMessage({ type: 'success', text: 'Article updated successfully!' });
      } else {
        // Create new article
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
      }

      // Reset form and refresh articles list
      resetArticleForm();
      await fetchArticles();
      
      setTimeout(() => {
        navigate('/news');
      }, 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to publish article' });
    } finally {
      setLoading(false);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!eventMonth || !eventDay || !eventTitle || !eventSummary || !eventAddress || !eventTimeFrom) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Parse date from month and day using UTC to avoid timezone issues
      const currentYear = new Date().getFullYear();
      const dateString = `${currentYear}-${eventMonth.padStart(2, '0')}-${eventDay.padStart(2, '0')}`;
      // Create date in UTC to avoid timezone shifts
      const [year, month, day] = dateString.split('-').map(Number);
      const eventDateObj = new Date(Date.UTC(year, month - 1, day));
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      // Check if event is in the past
      const isPast = eventDateObj < now;

      if (selectedEventId && editingEvent) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update({
            event_date: dateString,
            event_type: eventType,
            title: eventTitle,
            summary: eventSummary,
            address: eventAddress,
            time_from: eventTimeFrom,
            time_to: eventTimeTo || null,
            rsvp_link: eventRsvpLink || null,
            featured: eventFeatured,
            is_past: isPast,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedEventId);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Event updated successfully!' });
      } else {
        // Create new event
        const { error } = await supabase
          .from('events')
          .insert({
            event_date: dateString,
            event_type: eventType,
            title: eventTitle,
            summary: eventSummary,
            address: eventAddress,
            time_from: eventTimeFrom,
            time_to: eventTimeTo || null,
            rsvp_link: eventRsvpLink || null,
            featured: eventFeatured,
            is_past: isPast,
            author_email: user.email
          });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Event created successfully!' });
      }
      
      // Reset form and refresh events list
      resetEventForm();
      await fetchEvents();
      
      setTimeout(() => {
        navigate('/events');
      }, 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to create event' });
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

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Panel</h1>
            <p className="admin-subtitle">Welcome, {user.name}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'article' ? 'active' : ''}`}
            onClick={() => setActiveTab('article')}
          >
            Create Article
          </button>
          <button
            className={`admin-tab ${activeTab === 'event' ? 'active' : ''}`}
            onClick={() => setActiveTab('event')}
          >
            Create Event
          </button>
        </div>

        {message && (
          <div className={`admin-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Article Form */}
        {activeTab === 'article' && (
          <>
            {/* Manage Existing Articles Section */}
            {articles.length > 0 && (
              <div className="form-section" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h3 className="section-title">Manage Articles</h3>
                <p className="form-hint" style={{ marginBottom: 'var(--spacing-md)' }}>
                  Click an article to edit it, or use the delete button to remove it. You can also create a new article below.
                </p>
                <div className="articles-list" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                  gap: 'var(--spacing-md)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  {articles.map(article => {
                    const articleDate = new Date(article.published_at);
                    const dateStr = articleDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    });
                    const getCategoryDisplayName = (cat: string) => {
                      if (cat === 'precious-metals' || cat === 'base-metals' || cat === 'metals') {
                        return 'Metals';
                      }
                      return cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                    };
                    const categoryName = getCategoryDisplayName(article.category);
                    return (
                      <div 
                        key={article.id} 
                        className={`article-manage-card ${selectedArticleId === article.id ? 'selected' : ''}`}
                        style={{
                          padding: 'var(--spacing-md)',
                          border: `2px solid ${selectedArticleId === article.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          borderRadius: '8px',
                          backgroundColor: selectedArticleId === article.id ? 'var(--color-bg-light)' : 'var(--color-bg)',
                          transition: 'all var(--transition-fast)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--spacing-sm)'
                        }}
                      >
                        <div 
                          onClick={() => loadArticleForEditing(article)}
                          style={{ cursor: 'pointer', flex: 1 }}
                        >
                          <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
                            {article.title}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                            {categoryName} • {article.subcategory.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                            Published: {dateStr}
                          </div>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          gap: 'var(--spacing-xs)',
                          marginTop: 'var(--spacing-sm)',
                          paddingTop: 'var(--spacing-sm)',
                          borderTop: '1px solid var(--color-border-light)'
                        }}>
                          <button
                            type="button"
                            onClick={() => loadArticleForEditing(article)}
                            className="btn btn-outline btn-sm"
                            style={{ flex: 1, fontSize: '0.85rem', padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteArticle(article.id, article.title);
                            }}
                            className="btn btn-danger btn-sm"
                            style={{ flex: 1, fontSize: '0.85rem', padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {editingArticle && (
                  <button
                    type="button"
                    onClick={resetArticleForm}
                    className="btn btn-outline"
                    style={{ marginBottom: 'var(--spacing-lg)' }}
                  >
                    Create New Article Instead
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-section">
            <h3 className="section-title">{editingArticle ? 'Edit Article' : 'Category & Subcategory'}</h3>
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
                  <option value="metals">Metals</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="strategies">Research</option>
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
              {loading ? (editingArticle ? 'Updating...' : 'Publishing...') : (editingArticle ? 'Update Article' : 'Publish Article')}
            </button>
            {editingArticle && (
              <button
                type="button"
                onClick={resetArticleForm}
                className="btn btn-secondary"
                style={{ marginLeft: 'var(--spacing-md)' }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
          </>
        )}

        {/* Event Form */}
        {activeTab === 'event' && (
          <>
            {/* Edit/Delete Future Events Section */}
            {events.length > 0 && (
              <div className="form-section" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h3 className="section-title">Manage Future Events</h3>
                <p className="form-hint" style={{ marginBottom: 'var(--spacing-md)' }}>
                  Click an event to edit it, or use the delete button to remove it. You can also create a new event below.
                </p>
                <div className="events-list" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                  gap: 'var(--spacing-md)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  {events.map(event => {
                    const eventDate = new Date(event.event_date);
                    const dateStr = eventDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    });
                    return (
                      <div 
                        key={event.id} 
                        className={`event-edit-card ${selectedEventId === event.id ? 'selected' : ''}`}
                        style={{
                          padding: 'var(--spacing-md)',
                          border: `2px solid ${selectedEventId === event.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          borderRadius: '8px',
                          backgroundColor: selectedEventId === event.id ? 'var(--color-bg-light)' : 'var(--color-bg)',
                          transition: 'all var(--transition-fast)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--spacing-sm)'
                        }}
                      >
                        <div 
                          onClick={() => loadEventForEditing(event)}
                          style={{ cursor: 'pointer', flex: 1 }}
                        >
                          <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
                            {event.title}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                            {dateStr} • {event.event_type}
                          </div>
                          {event.featured && (
                            <div style={{ 
                              fontSize: '0.75rem', 
                              color: 'var(--color-primary)', 
                              fontWeight: 600,
                              marginTop: 'var(--spacing-xs)'
                            }}>
                              ⭐ Featured Event
                            </div>
                          )}
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          gap: 'var(--spacing-xs)',
                          marginTop: 'var(--spacing-sm)',
                          paddingTop: 'var(--spacing-sm)',
                          borderTop: '1px solid var(--color-border-light)'
                        }}>
                          <button
                            type="button"
                            onClick={() => loadEventForEditing(event)}
                            className="btn btn-outline btn-sm"
                            style={{ flex: 1, fontSize: '0.85rem', padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEvent(event.id, event.title);
                            }}
                            className="btn btn-danger btn-sm"
                            style={{ flex: 1, fontSize: '0.85rem', padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {editingEvent && (
                  <button
                    type="button"
                    onClick={resetEventForm}
                    className="btn btn-outline"
                    style={{ marginBottom: 'var(--spacing-lg)' }}
                  >
                    Create New Event Instead
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleEventSubmit} className="admin-form">
              <div className="form-section">
                <h3 className="section-title">{editingEvent ? 'Edit Event Details' : 'Event Details'}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Month *</label>
                  <select
                    value={eventMonth}
                    onChange={(e) => setEventMonth(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">Select Month</option>
                    {months.map((month, index) => (
                      <option key={month} value={(index + 1).toString().padStart(2, '0')}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Day *</label>
                  <select
                    value={eventDay}
                    onChange={(e) => setEventDay(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">Select Day</option>
                    {days.map(day => (
                      <option key={day} value={day.toString().padStart(2, '0')}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Event Type *</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="Dinner">Dinner</option>
                    <option value="Speaker Event">Speaker Event</option>
                    <option value="Company Visit">Company Visit</option>
                    <option value="Members Meeting">Members Meeting</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="form-input"
                  placeholder="Event title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Event Summary *</label>
                <textarea
                  value={eventSummary}
                  onChange={(e) => setEventSummary(e.target.value)}
                  className="block-textarea"
                  rows={6}
                  placeholder="Describe the event..."
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Location & Time</h3>
              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  value={eventAddress}
                  onChange={(e) => setEventAddress(e.target.value)}
                  className="form-input"
                  placeholder="📍 Event location address"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Time From *</label>
                  <input
                    type="text"
                    value={eventTimeFrom}
                    onChange={(e) => setEventTimeFrom(e.target.value)}
                    className="form-input"
                    placeholder="e.g., 6:00 PM"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time To</label>
                  <input
                    type="text"
                    value={eventTimeTo}
                    onChange={(e) => setEventTimeTo(e.target.value)}
                    className="form-input"
                    placeholder="e.g., 9:00 PM (optional)"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">RSVP & Options</h3>
              <div className="form-group">
                <label>RSVP Link</label>
                <input
                  type="url"
                  value={eventRsvpLink}
                  onChange={(e) => setEventRsvpLink(e.target.value)}
                  className="form-input"
                  placeholder="https://... or mailto:events@..."
                />
                <small className="form-hint">Enter a URL or email link (mailto:email@example.com)</small>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={eventFeatured}
                    onChange={(e) => setEventFeatured(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span>Mark as Featured (Next Event)</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                {loading ? (editingEvent ? 'Updating...' : 'Creating...') : (editingEvent ? 'Update Event' : 'Create Event')}
              </button>
              {editingEvent && (
                <button
                  type="button"
                  onClick={resetEventForm}
                  className="btn btn-secondary"
                  style={{ marginLeft: 'var(--spacing-md)' }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;

