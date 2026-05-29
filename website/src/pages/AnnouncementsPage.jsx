import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import announcementsData from '../data/announcements.json';
import './AnnouncementsPage.css';

const AnnouncementsPage = () => {
  const [filter, setFilter] = useState('All');
  
  // Extract unique categories from data
  const categories = ['All', ...new Set(announcementsData.map(item => item.category))];
  
  const filteredAnnouncements = announcementsData.filter(
    item => filter === 'All' || item.category === filter
  );

  const pinnedAnnouncements = filteredAnnouncements.filter(item => item.isPinned);
  const regularAnnouncements = filteredAnnouncements.filter(item => !item.isPinned);

  return (
    <div className="announcements-page">
      <div className="announcements-header">
        <h1>Announcements & Updates</h1>
        <p>Stay informed with the latest news, exam dates, and resources.</p>
      </div>

      <div className="announcements-container">
        {/* Filters */}
        <div className="announcements-filters">
          {categories.map((cat) => (
            <button 
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="announcements-content">
          {/* Pinned Section */}
          {pinnedAnnouncements.length > 0 && (
            <div className="pinned-section">
              <h2 className="section-title">
                <span className="icon">📌</span> Pinned
              </h2>
              <div className="cards-grid">
                {pinnedAnnouncements.map(item => (
                  <AnnouncementCard key={item.id} item={item} isPinned={true} />
                ))}
              </div>
            </div>
          )}

          {/* Regular Feed */}
          {regularAnnouncements.length > 0 && (
            <div className="regular-section">
              <h2 className="section-title">Latest Updates</h2>
              <div className="cards-list">
                {regularAnnouncements.map(item => (
                  <AnnouncementCard key={item.id} item={item} isPinned={false} />
                ))}
              </div>
            </div>
          )}
          
          {filteredAnnouncements.length === 0 && (
            <div className="no-results">
              <p>No announcements found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AnnouncementCard = ({ item, isPinned }) => {
  // Format date
  const dateObj = new Date(item.date);
  const dateString = dateObj.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <div className={`announcement-card ${isPinned ? 'pinned-card' : ''}`}>
      <div className="card-meta">
        <span className="card-category">{item.category}</span>
        <span className="card-date">{dateString}</span>
      </div>
      <h3 className="card-title">{item.title}</h3>
      <p className="card-excerpt">{item.content}</p>
      
      {item.link && (
        item.link.startsWith('http') ? (
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="card-link">
            Read More <span className="arrow">→</span>
          </a>
        ) : (
          <Link to={item.link} className="card-link">
            Read More <span className="arrow">→</span>
          </Link>
        )
      )}
    </div>
  );
};

export default AnnouncementsPage;
