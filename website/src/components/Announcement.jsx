import React from 'react';
import './Announcement.css';

const Announcement = () => {
  return (
    <div className="announcement-bar">
      <div className="announcement-content">
        <span className="announcement-badge">New</span>
        <p>CDAC CCAT Registration for August / September 2026 batch started</p>
        <a 
          href="https://cdac.in/index.aspx?id=edu_acts_PGDiplomaAdmission" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="announcement-btn"
        >
          Register Now
        </a>
      </div>
    </div>
  );
};

export default Announcement;
