import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1 className="text-gradient" style={{ fontSize: '5rem' }}>404</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Page Not Found</p>
      <Link to="/">
        <button className="btn-primary">Go Home</button>
      </Link>
    </div>
  );
};

export default NotFound;
