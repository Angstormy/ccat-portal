import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo text-gradient-glow" style={{ textShadow: 'none' }}>
          <img src="/logo.png" alt="CDAC Logo" className="nav-logo-img" />
          <span className="hide-on-mobile">CCAT</span><span className="hide-on-mobile"> Portal</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link hide-on-mobile">Home</Link>
          <Link to="/announcements" className="nav-link nav-link-announcements">
            Announcements <span className="nav-badge-new">New</span>
          </Link>
          <a
            href={`https://t.me/${(import.meta.env.VITE_BOT_USERNAME || 'bot').replace('@', '')}`}
            target="_blank"
            rel="noreferrer"
            className="nav-btn"
          >
            <Send size={16} color="var(--accent)" /> Bot
          </a>
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark'
              ? <Sun size={18} color="#f6c90e" />
              : <Moon size={18} color="#0077ff" />
            }
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
