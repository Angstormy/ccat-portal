import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Send, Mail, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo text-gradient-glow" id="footer-logo-link" style={{ textShadow: 'none' }}>
              <BookOpen size={24} color="var(--accent)" style={{ marginRight: '8px' }} />
              CCAT Portal
            </Link>
            <p className="footer-desc">
              Your one-stop destination for curated CDAC/CCAT study resources. High-quality notes, question banks, and reference materials delivered directly to your Telegram chat instantly.
            </p>
            <div className="footer-socials">
              <a
                href={`https://t.me/${(import.meta.env.VITE_BOT_USERNAME || 'bot').replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="footer-social-icon"
                title="Telegram Bot"
                id="footer-bot-link"
              >
                <Send size={18} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-icon"
                title="GitHub Repository"
                id="footer-github-link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-github"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a
                href="mailto:support@ccatportal.com"
                className="footer-social-icon"
                title="Email Support"
                id="footer-email-link"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/" className="footer-link" id="footer-home-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/section/ccat-notes-&-practice#section-a" className="footer-link" id="footer-section-a-link">
                  Section A (English, QA, Reasoning)
                </Link>
              </li>
              <li>
                <Link to="/section/ccat-notes-&-practice#section-b" className="footer-link" id="footer-section-b-link">
                  Section B (CS Fundamentals)
                </Link>
              </li>
              <li>
                <Link to="/section/ccat-notes-&-practice#section-c" className="footer-link" id="footer-section-c-link">
                  Section C (Electronics)
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Resources</h4>
            <ul className="footer-links-list">
              <li>
                <a
                  href={`https://t.me/${(import.meta.env.VITE_BOT_USERNAME || 'bot').replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link"
                  id="footer-tg-bot-resource"
                >
                  Telegram Bot Download
                </a>
              </li>
              <li>
                <Link to="/" className="footer-link" id="footer-faq-link">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/" className="footer-link" id="footer-tips-link">
                  CCAT Preparation Tips
                </Link>
              </li>
              <li>
                <Link to="/" className="footer-link" id="footer-syllabus-link">
                  Official Syllabus
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {currentYear} CCAT Portal. All rights reserved.
          </p>
          <p className="footer-credit">
            Made with <Heart size={14} className="heart-icon" /> for CDAC Candidates.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
