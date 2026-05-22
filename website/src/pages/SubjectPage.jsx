import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { ArrowLeft, FileText, Send, Check } from 'lucide-react';

const formatSubjectName = (name) => {
  if (!name) return '';
  if (name.toLowerCase() === 'misc') return 'Previous Year Questions';
  let formatted = name.toLowerCase()
    .replace(/\b(ai|oop|os|pdf|pyq|c-cat|ccat)\b/g, (match) => match.toUpperCase())
    .replace(/\b\w/g, (char) => char.toUpperCase());
  
  const minors = ['And', 'Of', 'In', 'For', 'To', 'With', 'At', 'By', 'The', 'Or', 'As', '&'];
  minors.forEach(word => {
    const regex = new RegExp(`\\s${word}\\b`, 'g');
    formatted = formatted.replace(regex, ` ${word.toLowerCase()}`);
  });
  
  return formatted;
};

const SubjectPage = () => {
  const { sectionId, subjectId } = useParams();
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [countdown, setCountdown] = useState({});
  const [activeTokens, setActiveTokens] = useState({});
  const [copiedId, setCopiedId] = useState(null);

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
        // Fallback to placeholder if not configured
        setPdfs([
          { id: '1', name: 'Synonyms Notes (Placeholder)', downloads: 142 },
          { id: '2', name: 'Antonyms Practice Set (Placeholder)', downloads: 89 }
        ]);
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
    let secondsLeft = 5;
    setCountdown(prev => ({ ...prev, [pdfObj.id]: secondsLeft }));
    
    const interval = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        clearInterval(interval);
        setCountdown(prev => {
          const updated = { ...prev };
          delete updated[pdfObj.id];
          return updated;
        });
        
        executeTokenGeneration(pdfObj);
      } else {
        setCountdown(prev => ({ ...prev, [pdfObj.id]: secondsLeft }));
      }
    }, 1000);
  };

  const executeTokenGeneration = async (pdfObj) => {
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

      setActiveTokens(prev => ({ ...prev, [pdfObj.id]: tokenString }));
      
      let botUsername = import.meta.env.VITE_BOT_USERNAME;
      if (botUsername) {
        window.open(`https://t.me/${botUsername.replace('@', '')}?start=${tokenString}`, '_blank');
      }
      
      setDownloadingId(null);
    } catch (error) {
      console.error("Token generation failed:", error);
      alert("Failed to generate token. Please check Firebase config.");
      setDownloadingId(null);
    }
  };

  const handleCopy = (token, pdfId) => {
    navigator.clipboard.writeText(token);
    setCopiedId(pdfId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <div className="hero-blob blob-1"></div>
      <div className="hero-blob blob-2"></div>

      <div style={{ minHeight: '80vh', paddingTop: '40px' }}>
        <div className="container">
          {/* HEADER SECTION */}
          <div style={{ marginBottom: '40px' }}>
            <Link to={`/section/${sectionId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', marginBottom: '20px', fontSize: '0.95rem' }} className="back-link">
              <ArrowLeft size={16} /> Back to Subjects
            </Link>
            <h1 className="text-gradient" style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '16px', display: 'block' }}>
              {formatSubjectName(subjectId.replace(/-/g, ' '))}
            </h1>
            <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', maxWidth: '700px', lineHeight: '1.6' }}>
              Download specialized study materials, notes, and topic questions. Access keys will be generated and sent straight to your Telegram account.
            </p>
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-main)', padding: '80px 0' }}>
              <div style={{ display: 'inline-block', width: '35px', height: '35px', border: '3px solid rgba(0, 229, 255, 0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ marginTop: '20px', fontSize: '1.05rem' }}>Loading study materials...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {pdfs.map(pdf => (
                <div key={pdf.id} className="glass-card" style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '20px',
                  borderLeft: '4px solid var(--accent)',
                  transition: 'all 0.3s ease'
                }}>
                  <div className="pdf-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ 
                        background: 'rgba(255, 255, 255, 0.03)', 
                        padding: '12px', 
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--glass-border)'
                      }}>
                        <FileText size={28} color="var(--accent)" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '6px', color: 'var(--text-highlight)' }}>{pdf.name}</h3>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', opacity: 0.7 }}>
                          📥 {pdf.downloads || 0} downloads
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      className="pdf-download-btn btn-primary" 
                      onClick={() => handleDownload(pdf)}
                      disabled={downloadingId === pdf.id || activeTokens[pdf.id]}
                      style={{ 
                        padding: '12px 24px', 
                        fontSize: '0.95rem',
                        borderRadius: '10px',
                        minWidth: '160px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                      }}
                    >
                      {downloadingId === pdf.id ? (
                        <>
                          <span className="button-spinner"></span>
                          <span>Wait {countdown[pdf.id] || 5}s</span>
                        </>
                      ) : (
                        activeTokens[pdf.id] ? 'Token Ready' : 'Download PDF'
                      )}
                    </button>
                  </div>

                  {/* TOKEN INFO COMPONENT */}
                  {activeTokens[pdf.id] && (
                    <div className="token-box" style={{ 
                      marginTop: '8px', 
                      background: 'rgba(0, 0, 0, 0.25)', 
                      borderRadius: '12px', 
                      border: '1px dashed rgba(0, 229, 255, 0.4)',
                      animation: 'slideDown 0.3s ease-out forwards'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span className="pulse-green"></span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-highlight)', fontWeight: '500' }}>
                          Secure Token Generated
                        </span>
                      </div>
                      
                      <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                        Your cryptographic download key is active for <strong>10 minutes</strong>. Copy the token or click the button below to retrieve the file directly in Telegram.
                      </p>
                      
                      <div className="token-action-row" style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <input 
                          type="text" 
                          value={activeTokens[pdf.id]} 
                          readOnly 
                          className="token-input"
                          style={{ 
                            padding: '12px', 
                            flex: 1, 
                            minWidth: '150px',
                            borderRadius: '8px', 
                            border: '1px solid rgba(255,255,255,0.08)', 
                            background: 'rgba(255,255,255,0.02)', 
                            color: 'var(--accent)', 
                            textAlign: 'center', 
                            letterSpacing: '4px', 
                            fontWeight: 'bold', 
                            fontSize: '1.25rem',
                            fontFamily: 'monospace',
                            outline: 'none'
                          }} 
                        />
                        <button 
                          onClick={() => handleCopy(activeTokens[pdf.id], pdf.id)} 
                          className="token-copy-btn btn-secondary"
                          style={{ 
                            padding: '12px 20px', 
                            borderRadius: '8px', 
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            minWidth: '110px',
                            justifyContent: 'center'
                          }}
                        >
                          {copiedId === pdf.id ? (
                            <>
                              <Check size={16} /> Copied
                            </>
                          ) : 'Copy'}
                        </button>
                      </div>
                      
                      <a 
                        href={`https://t.me/${(import.meta.env.VITE_BOT_USERNAME || 'your_bot').replace('@', '')}?start=${activeTokens[pdf.id]}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="token-tg-btn btn-primary"
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          textDecoration: 'none', 
                          fontWeight: '600',
                          width: '100%',
                          padding: '14px',
                          borderRadius: '8px',
                          background: '#0088cc',
                          boxShadow: '0 4px 15px rgba(0, 136, 204, 0.3)'
                        }}
                      >
                        <Send size={18} /> Open Telegram Bot
                      </a>
                    </div>
                  )}
                </div>
              ))}
              {pdfs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px dashed var(--glass-border)' }}>
                  <p style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>No PDFs found for this subject yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .back-link:hover {
          color: var(--accent) !important;
          transform: translateX(-4px);
        }
        .back-link {
          transition: all 0.2s ease;
        }
        .button-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
        .pulse-green {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4caf50;
          display: inline-block;
          box-shadow: 0 0 8px #4caf50;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default SubjectPage;
