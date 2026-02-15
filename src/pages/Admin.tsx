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
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
    } else {
      setUser(authService.getCurrentUser());
      if (activeTab === 'event') {
        fetchEvents();
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
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
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
    'precious-metals': ['gold', 'silver', 'copper'],
    'base-metals': ['aluminum', 'zinc-lead', 'nickel'],
    agriculture: ['grains', 'soft-commodities'],
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
              {loading ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        </form>
        )}

        {/* Event Form */}
        {activeTab === 'event' && (
          <>
            {/* Edit Previous Events Section */}
            {events.length > 0 && (
              <div className="form-section" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h3 className="section-title">Edit Previous Events</h3>
                <p className="form-hint" style={{ marginBottom: 'var(--spacing-md)' }}>
                  Select an event below to edit its details, or create a new event.
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
                        onClick={() => loadEventForEditing(event)}
                        style={{
                          padding: 'var(--spacing-md)',
                          border: `2px solid ${selectedEventId === event.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: selectedEventId === event.id ? 'var(--color-bg-light)' : 'var(--color-bg)',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
                          {event.title}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                          {dateStr} • {event.event_type}
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

