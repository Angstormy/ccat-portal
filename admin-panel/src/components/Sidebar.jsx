import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="glass-card" style={{ 
      width: '250px', 
      height: '100vh', 
      position: 'fixed', 
      top: 0, 
      left: 0,
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderBottom: 'none',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px'
    }}>
      <h2 className="text-gradient" style={{ marginBottom: '40px', textAlign: 'center' }}>Admin Panel</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Link to="/">
          <button className="btn-primary" style={{ width: '100%', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--text-main)' }}>Dashboard</button>
        </Link>
        <Link to="/upload">
          <button className="btn-primary" style={{ width: '100%', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--text-main)' }}>Upload PDF</button>
        </Link>
        <div style={{ marginTop: 'auto' }}>
          <button onClick={handleLogout} className="btn-primary" style={{ width: '100%', background: '#e74c3c', color: '#fff' }}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
