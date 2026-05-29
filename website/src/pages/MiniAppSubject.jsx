import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import WebApp from '@twa-dev/sdk';

const formatSubjectName = (name) => {
  if (!name) return '';
  if (name.toLowerCase() === 'misc') return 'Previous Year Questions';
  let formatted = name.toLowerCase()
    .replace(/\b(ai|oop|os|pdf|pyq|c-cat|ccat)\b/g, (match) => match.toUpperCase())
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return formatted;
};

const MiniAppSubject = () => {
  const { sectionId, subjectId } = useParams();
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    WebApp.BackButton.show();
    const handleBack = () => navigate(`/miniapp/section/${sectionId}`);
    WebApp.BackButton.onClick(handleBack);
    
    return () => {
      WebApp.BackButton.offClick(handleBack);
    };
  }, [navigate, sectionId]);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const pdfsRef = collection(db, 'sections', sectionId, 'subjects', subjectId, 'pdfs');
        const querySnapshot = await getDocs(pdfsRef);
        const fetchedPdfs = [];
        querySnapshot.forEach((doc) => {
          fetchedPdfs.push({ id: doc.id, ...doc.data() });
        });
        setPdfs(fetchedPdfs);
      } catch (error) {
        console.error("Error fetching PDFs: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPdfs();
  }, [sectionId, subjectId]);

  const generateTokenString = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 6; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  };

  const handleDownload = async (pdfObj) => {
    setDownloadingId(pdfObj.id);
    WebApp.HapticFeedback.impactOccurred('light');

    // Inside Telegram, we can skip the countdown or keep it very short.
    // Let's just generate the token and send it immediately.
    try {
      const tokenString = generateTokenString();
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + 10);

      await setDoc(doc(db, 'tokens', tokenString), {
        pdf_id: pdfObj.id,
        telegram_file_id: pdfObj.telegram_file_id || "MISSING_ID",
        created_at: new Date(),
        expires_at: expiryDate,
        used: false
      });

      WebApp.HapticFeedback.notificationOccurred('success');
      
      // Close WebApp and trigger bot with start payload
      const botUsername = import.meta.env.VITE_BOT_USERNAME || '';
      if (botUsername) {
        WebApp.openTelegramLink(`https://t.me/${botUsername.replace('@', '')}?start=${tokenString}`);
      } else {
        alert("Bot username not configured.");
      }
      
    } catch (error) {
      console.error("Token generation failed:", error);
      WebApp.HapticFeedback.notificationOccurred('error');
      WebApp.showAlert("Failed to prepare download. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', marginBottom: '24px', fontWeight: 'bold' }}>
        {formatSubjectName(subjectId.replace(/-/g, ' '))}
      </h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading PDFs...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pdfs.map(pdf => (
            <div key={pdf.id} style={{
              background: 'var(--tg-theme-secondary-bg-color, rgba(255,255,255,0.05))',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div>
                <h3 style={{ 
                  color: 'var(--tg-theme-text-color, #fff)', 
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  {pdf.name}
                </h3>
                <span style={{ color: 'var(--tg-theme-hint-color, #999)', fontSize: '12px' }}>
                  {pdf.downloads || 0} downloads
                </span>
              </div>
              
              <button 
                onClick={() => handleDownload(pdf)}
                disabled={downloadingId === pdf.id}
                style={{
                  background: 'var(--tg-theme-button-color, #2481cc)',
                  color: 'var(--tg-theme-button-text-color, #ffffff)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  opacity: downloadingId === pdf.id ? 0.7 : 1
                }}
              >
                {downloadingId === pdf.id ? 'Preparing...' : 'Download via Bot'}
              </button>
            </div>
          ))}
          {pdfs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--tg-theme-hint-color)' }}>
              No materials available.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MiniAppSubject;
