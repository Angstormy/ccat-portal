import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import WebApp from '@twa-dev/sdk';

const formatSubjectName = (name) => {
  if (!name) return '';
  if (name.toLowerCase() === 'misc') return 'Previous Year Questions';
  let formatted = name.toLowerCase()
    .replace(/\b(ai|oop|os|pdf|pyq|c-cat|ccat)\b/g, (match) => match.toUpperCase())
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return formatted;
};

const MiniAppSection = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (WebApp.BackButton) {
      WebApp.BackButton.show();
      const handleBack = () => navigate('/miniapp');
      WebApp.BackButton.onClick(handleBack);
      
      return () => {
        WebApp.BackButton.offClick(handleBack);
      };
    }
  }, [navigate]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'sections', sectionId, 'subjects'));
        const fetchedSubjects = [];
        querySnapshot.forEach((doc) => {
          fetchedSubjects.push({ id: doc.id, ...doc.data() });
        });
        setSubjects(fetchedSubjects);
      } catch (error) {
        console.error("Error fetching subjects: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [sectionId]);

  return (
    <div>
      <h1 style={{ fontSize: '24px', marginBottom: '16px', fontWeight: 'bold', textTransform: 'capitalize' }}>
        {sectionId.replace(/-/g, ' ')}
      </h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading subjects...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {subjects.map(subject => (
            <Link 
              key={subject.id} 
              to={`/miniapp/section/${sectionId}/subject/${subject.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: 'var(--tg-theme-secondary-bg-color, rgba(255,255,255,0.05))',
                borderRadius: '12px',
                padding: '16px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <span style={{ 
                  color: 'var(--tg-theme-text-color, #fff)', 
                  fontSize: '15px',
                  fontWeight: '600'
                }}>
                  {formatSubjectName(subject.name || subject.id)}
                </span>
              </div>
            </Link>
          ))}
          {subjects.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: 'var(--tg-theme-hint-color)' }}>
              No subjects found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MiniAppSection;
