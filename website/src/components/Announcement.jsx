import React from 'react';
import { Link } from 'react-router-dom';
import './Announcement.css';
import announcementsData from '../data/announcements.json';

const Announcement = () => {
  // Get the first pinned announcement, or the latest one if none are pinned
  const latestAnnouncement = announcementsData.find(a => a.isPinned) || announcementsData[0];

  if (!latestAnnouncement) return null;

  const content = (
    <div className="marquee-content-wrapper">
      <span className="announcement-badge">New</span>
      <p className="marquee-text">{latestAnnouncement.title}</p>
    </div>
  );

  return (
    <div className="announcement-bar">
      <div className="announcement-content">
        <div className="marquee-container">
          <Link to="/announcements" className="marquee-link">
            {content}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
