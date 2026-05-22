import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', marginTop: '-80px' }}>
      <form onSubmit={handleLogin} className="glass-card" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 className="text-gradient" style={{ textAlign: 'center' }}>Admin Login</h2>
        
        {error && <div style={{ color: '#e74c3c', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--glass-border)' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--glass-border)' }}
            required
          />
        </div>

        <button type="submit" className="btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
