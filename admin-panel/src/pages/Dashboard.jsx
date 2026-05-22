import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-gradient">Admin Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginTop: '40px' }}>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h2>Total Downloads</h2>
          <p style={{ fontSize: '2rem', color: 'var(--text-highlight)' }}>4,521</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h2>Active Tokens</h2>
          <p style={{ fontSize: '2rem', color: 'var(--text-highlight)' }}>12</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h2>Total PDFs</h2>
          <p style={{ fontSize: '2rem', color: 'var(--text-highlight)' }}>84</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
