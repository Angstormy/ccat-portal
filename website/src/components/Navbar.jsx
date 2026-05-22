import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Send, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo text-gradient-glow" style={{ textShadow: 'none' }}>
          <BookOpen size={26} color="var(--accent)" style={{ marginRight: '4px' }} />
          CCAT Portal
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
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
