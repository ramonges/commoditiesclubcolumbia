import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import './Events.css';

interface Event {
  id: string;
  event_date: string;
  event_type: string;
  title: string;
  summary: string;
  address: string;
  time_from: string;
  time_to: string | null;
  rsvp_link: string | null;
  featured: boolean;
  is_past: boolean;
}

const Events = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
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

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;

      const now = new Date();
      const upcoming = (data || []).filter(event => {
        const eventDate = new Date(event.event_date);
        return eventDate >= now && !event.is_past;
      }).sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

      const past = (data || []).filter(event => {
        const eventDate = new Date(event.event_date);
        return eventDate < now || event.is_past;
      });

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    return { month, day };
  };

  const formatTime = (timeFrom: string, timeTo: string | null) => {
    if (timeTo) {
      return `${timeFrom} - ${timeTo}`;
    }
    return timeFrom;
  };

  const getRsvpLink = (rsvpLink: string | null) => {
    if (!rsvpLink) return null;
    
    // If it's a mailto link, return as is
    if (rsvpLink.startsWith('mailto:')) {
      return rsvpLink;
    }
    
    // Otherwise return the URL
    return rsvpLink;
  };

  if (loading) {
    return (
      <>
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">Our Events</h1>
            <p className="page-subtitle">Dinners, speaker events, company visits, and networking opportunities</p>
          </div>
        </section>
        <section className="section section-events-page">
          <div className="container">
            <p>Loading events...</p>
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
          <h1 className="page-title">Our Events</h1>
          <p className="page-subtitle">Dinners, speaker events, company visits, and networking opportunities</p>
        </div>
      </section>

      {/* Events Content */}
      <section className="section section-events-page">
        <div className="container">
          {/* Upcoming Events */}
          <div className="events-section">
            <h2 className="events-section-title">Upcoming Events</h2>
            {upcomingEvents.length === 0 ? (
              <p className="empty-events">No upcoming events scheduled. Check back soon!</p>
            ) : (
              <div className="events-grid">
                {upcomingEvents.map(event => {
                  const { month, day } = formatDate(event.event_date);
                  const rsvpLink = getRsvpLink(event.rsvp_link);
                  
                  return (
                    <article 
                      key={event.id} 
                      className={`event-card ${event.featured ? 'featured' : ''}`}
                      id={event.featured ? 'next-dinner' : undefined}
                    >
                      <div className="event-card-date">
                        <span className="event-card-month">{month}</span>
                        <span className="event-card-day">{day}</span>
                      </div>
                      <div className="event-card-content">
                        <span className="event-card-type">{event.event_type}</span>
                        <h3 className="event-card-title">{event.title}</h3>
                        <p className="event-card-description">{event.summary}</p>
                        <div className="event-card-meta">
                          <span className="event-card-location">📍 {event.address}</span>
                          <span className="event-card-time">{formatTime(event.time_from, event.time_to)}</span>
                        </div>
                        {rsvpLink && (
                          <div className="event-card-cta">
                            <a 
                              href={rsvpLink}
                              className="btn btn-primary"
                              target={rsvpLink.startsWith('http') ? '_blank' : undefined}
                              rel={rsvpLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                              RSVP
                            </a>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div className="events-section">
              <h2 className="events-section-title">Past Events</h2>
              <div className="events-grid">
                {pastEvents.map(event => {
                  const { month, day } = formatDate(event.event_date);
                  
                  return (
                    <article key={event.id} className="event-card past">
                      <div className="event-card-date">
                        <span className="event-card-month">{month}</span>
                        <span className="event-card-day">{day}</span>
                      </div>
                      <div className="event-card-content">
                        <span className="event-card-type">{event.event_type}</span>
                        <h3 className="event-card-title">{event.title}</h3>
                        <p className="event-card-description">{event.summary}</p>
                        <div className="event-card-meta">
                          <span className="event-card-location">📍 {event.address}</span>
                          <span className="event-card-time">Completed</span>
                        </div>
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

export default Events;
