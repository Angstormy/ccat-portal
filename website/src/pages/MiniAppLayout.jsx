import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';

const MiniAppLayout = () => {
  useEffect(() => {
    // Initialize Telegram Web App
    WebApp.ready();
    WebApp.expand();
    
    // Apply Telegram theme colors to CSS variables
    document.documentElement.style.setProperty('--tg-theme-bg-color', WebApp.themeParams.bg_color || '#ffffff');
    document.documentElement.style.setProperty('--tg-theme-text-color', WebApp.themeParams.text_color || '#000000');
    document.documentElement.style.setProperty('--tg-theme-hint-color', WebApp.themeParams.hint_color || '#999999');
    document.documentElement.style.setProperty('--tg-theme-link-color', WebApp.themeParams.link_color || '#2481cc');
    document.documentElement.style.setProperty('--tg-theme-button-color', WebApp.themeParams.button_color || '#2481cc');
    document.documentElement.style.setProperty('--tg-theme-button-text-color', WebApp.themeParams.button_text_color || '#ffffff');
    
    // Optional: Hide default navbars from main app since we're in Mini App
    document.body.style.backgroundColor = 'var(--tg-theme-bg-color)';
    document.body.style.color = 'var(--tg-theme-text-color)';
    
    return () => {
      // Cleanup styles if needed
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, []);

  return (
    <div style={{ 
      padding: '16px', 
      minHeight: '100vh',
      background: 'var(--tg-theme-bg-color, #1a1a1a)',
      color: 'var(--tg-theme-text-color, #ffffff)',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <Outlet />
    </div>
  );
};

export default MiniAppLayout;
