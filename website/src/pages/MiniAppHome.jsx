import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import WebApp from '@twa-dev/sdk';

const MiniAppHome = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    WebApp.BackButton.hide();
    
    const fetchSections = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'sections'));
        const fetchedSections = [];
        querySnapshot.forEach((doc) => {
          fetchedSections.push({ id: doc.id, ...doc.data() });
        });
        setSections(fetchedSections);
      } catch (error) {
        console.error("Error fetching sections: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Study Materials</h1>
      <p style={{ color: 'var(--tg-theme-hint-color, #999)', marginBottom: '24px', fontSize: '14px' }}>
        Select a section to browse PDFs and notes.
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sections.map(section => (
            <Link 
              key={section.id} 
              to={`/miniapp/section/${section.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: 'var(--tg-theme-secondary-bg-color, rgba(255,255,255,0.05))',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <h3 style={{ 
                  color: 'var(--tg-theme-text-color, #fff)', 
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  textTransform: 'capitalize'
                }}>
                  {section.name || section.id.replace(/-/g, ' ')}
                </h3>
                <span style={{ color: 'var(--tg-theme-link-color, #2481cc)', fontSize: '14px', fontWeight: '500' }}>
                  Browse &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MiniAppHome;
