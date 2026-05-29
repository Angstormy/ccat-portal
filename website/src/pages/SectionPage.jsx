import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Search, 
  Code, 
  Cpu, 
  Database, 
  Brain, 
  Network, 
  Languages, 
  Percent, 
  Binary
} from 'lucide-react';

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

const formatSectionName = (id) => {
  if (!id) return '';
  let formatted = id.replace(/-/g, ' ');
  // Title-case first, then force C-CAT to stay fully uppercase
  formatted = formatted.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  formatted = formatted.replace(/\bc-?cat\b/gi, 'C-CAT');
  return formatted;
};

const getSubjectIcon = (subjectId, subjectName, color = 'var(--accent)') => {
  const query = (subjectName || subjectId || '').toLowerCase();
  
  if (query.includes('big data') || query.includes('ai') || query.includes('intelligence')) {
    return <Database size={22} color={color} />;
  }
  if (query.includes('c programming') || query.includes('object oriented') || query.includes('oop') || query.includes('data structure')) {
    return <Code size={22} color={color} />;
  }
  if (query.includes('architecture') || query.includes('microprocessor') || query.includes('electronics')) {
    return <Cpu size={22} color={color} />;
  }
  if (query.includes('fundamental') || query.includes('concept')) {
    return <Binary size={22} color={color} />;
  }
  if (query.includes('english') || query.includes('verbal')) {
    return <Languages size={22} color={color} />;
  }
  if (query.includes('aptitude') || query.includes('quant') || query.includes('mathematics')) {
    return <Percent size={22} color={color} />;
  }
  if (query.includes('reasoning') || query.includes('logic')) {
    return <Brain size={22} color={color} />;
  }
  if (query.includes('network') || query.includes('operating system') || query.includes('os')) {
    return <Network size={22} color={color} />;
  }
  return <BookOpen size={22} color={color} />;
};

const getSubjectCategory = (subject) => {
  const id = subject.id.toLowerCase();
  if (['english', 'quantitative-aptitude', 'reasoning'].includes(id)) {
    return 'Section A';
  }
  if (['digital-electronics', 'microprocessor', 'computer-architecture'].includes(id)) {
    return 'Section C';
  }
  return 'Section B';
};

const SectionPage = () => {
  const { sectionId } = useParams();
  const location = useLocation();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    if (!loading && location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [location.hash, loading]);

  const filteredSubjects = subjects.filter(subject => {
    const name = (subject.name || subject.id).toLowerCase();
    // Support searching by the renamed name too
    const displayName = subject.id.toLowerCase() === 'misc' ? 'previous year questions' : name;
    return displayName.includes(searchQuery.toLowerCase()) || name.includes(searchQuery.toLowerCase());
  });

  const groupedSubjects = {
    'Section A': filteredSubjects.filter(sub => getSubjectCategory(sub) === 'Section A'),
    'Section B': filteredSubjects.filter(sub => getSubjectCategory(sub) === 'Section B'),
    'Section C': filteredSubjects.filter(sub => getSubjectCategory(sub) === 'Section C')
  };

  const hasSectionA = groupedSubjects['Section A'].length > 0;
  const hasSectionB = groupedSubjects['Section B'].length > 0;
  const hasSectionC = groupedSubjects['Section C'].length > 0;

  const renderSubjectCard = (subject, accentColor) => (
    <Link key={subject.id} to={`/section/${sectionId}/subject/${subject.id}`}>
      <div className="subject-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div className="subject-icon-wrapper">
            {getSubjectIcon(subject.id, subject.name, accentColor)}
          </div>
          <span className="card-badge">Subject</span>
        </div>
        
        <div>
          <h3 className="subject-title">
            {formatSubjectName(subject.name || subject.id)}
          </h3>
          
          <div className="card-explore-link">
            Explore Materials <ArrowRight size={14} className="explore-arrow" />
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <>
      <div className="hero-blob blob-1"></div>
      <div className="hero-blob blob-2"></div>

      <div style={{ minHeight: '80vh', paddingTop: '40px' }}>
        <div className="container">
          {/* HEADER SECTION */}
          <div style={{ marginBottom: '40px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', marginBottom: '20px', fontSize: '0.95rem' }} className="back-link">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 className="text-gradient" style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '16px', display: 'block' }}>
              {formatSectionName(sectionId)}
            </h1>
            <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', maxWidth: '700px', lineHeight: '1.6' }}>
              Select a subject below to view and download study materials, handwritten notes, formulas, and practice problem sheets.
            </p>
          </div>

          {/* SEARCH BAR */}
          {!loading && subjects.length > 0 && (
            <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '32px' }}>
              <input 
                type="text" 
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: 'var(--text-highlight)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
              />
              <Search size={18} color="var(--text-main)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.6 }} />
            </div>
          )}

          {/* SUBJECTS GRID */}
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-main)', padding: '80px 0' }}>
              <div style={{ display: 'inline-block', width: '35px', height: '35px', border: '3px solid rgba(0, 229, 255, 0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ marginTop: '20px', fontSize: '1.05rem' }}>Loading subjects...</p>
            </div>
          ) : (
            <>
              {filteredSubjects.length > 0 ? (
                <div className="bento-grid-layout">
                  {/* Section A */}
                  {hasSectionA && (
                    <div id="section-a" className="bento-box section-a-box">
                      <div className="bento-box-header">
                        <span className="category-badge badge-a">Section A</span>
                        <h2 className="category-title">General Aptitude</h2>
                        <p className="category-desc">English, QA & Reasoning</p>
                      </div>
                      <div className="subject-grid">
                        {groupedSubjects['Section A'].map(subject => renderSubjectCard(subject, '#00e5ff'))}
                      </div>
                    </div>
                  )}

                  {/* Section B */}
                  {hasSectionB && (
                    <div id="section-b" className="bento-box section-b-box">
                      <div className="bento-box-header">
                        <span className="category-badge badge-b">Section B</span>
                        <h2 className="category-title">Computer Science</h2>
                        <p className="category-desc">Core CS, Programming & Previous Year Questions</p>
                      </div>
                      <div className="subject-grid">
                        {groupedSubjects['Section B'].map(subject => renderSubjectCard(subject, '#c084fc'))}
                      </div>
                    </div>
                  )}

                  {/* Section C */}
                  {hasSectionC && (
                    <div id="section-c" className="bento-box section-c-box">
                      <div className="bento-box-header">
                        <span className="category-badge badge-c">Section C</span>
                        <h2 className="category-title">Electronics</h2>
                        <p className="category-desc">Digital Electronics & Microprocessors</p>
                      </div>
                      <div className="subject-grid">
                        {groupedSubjects['Section C'].map(subject => renderSubjectCard(subject, '#ffaa00'))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px dashed var(--glass-border)' }}>
                  <p style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>
                    {subjects.length === 0 ? "Will Be Available Soon" : "No subjects match your search query."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .bento-grid-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }
        .bento-box {
          border-radius: 24px;
          padding: 32px;
          box-shadow: var(--glass-shadow);
          transition: all 0.3s ease;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          scroll-margin-top: 110px;
        }
        .bento-box:hover {
          box-shadow: 0 20px 40px -10px rgba(var(--box-accent-rgb), 0.15);
          border-color: rgba(var(--box-accent-rgb), 0.4);
        }
        .section-a-box {
          --box-accent: #00e5ff;
          --box-accent-rgb: 0, 229, 255;
          background: linear-gradient(135deg, rgba(0, 229, 255, 0.02) 0%, rgba(20, 20, 25, 0.6) 100%);
          border: 1px solid rgba(0, 229, 255, 0.15);
        }
        .section-b-box {
          --box-accent: #a855f7;
          --box-accent-rgb: 168, 85, 247;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.02) 0%, rgba(20, 20, 25, 0.6) 100%);
          border: 1px solid rgba(168, 85, 247, 0.15);
          grid-row: span 2;
        }
        .section-c-box {
          --box-accent: #ff7300;
          --box-accent-rgb: 255, 115, 0;
          background: linear-gradient(135deg, rgba(255, 115, 0, 0.02) 0%, rgba(20, 20, 25, 0.6) 100%);
          border: 1px solid rgba(255, 115, 0, 0.15);
        }
        .bento-box-header {
          margin-bottom: 24px;
        }
        .category-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }
        .badge-a {
          background: rgba(0, 229, 255, 0.08);
          color: #00e5ff;
          border: 1px solid rgba(0, 229, 255, 0.15);
        }
        .badge-b {
          background: rgba(168, 85, 247, 0.08);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.15);
        }
        .badge-c {
          background: rgba(255, 115, 0, 0.08);
          color: #ffaa00;
          border: 1px solid rgba(255, 115, 0, 0.15);
        }
        .category-title {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }
        .category-desc {
          color: var(--text-main);
          font-size: 0.95rem;
          opacity: 0.85;
        }
        .subject-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr));
          gap: 16px;
        }
        .subject-card {
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 20px;
          height: 100%;
          min-height: 150px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .subject-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(var(--box-accent-rgb), 0.3);
          transform: translateY(-4px);
          box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.3);
        }
        .subject-icon-wrapper {
          background: rgba(var(--box-accent-rgb), 0.05);
          border: 1px solid rgba(var(--box-accent-rgb), 0.12);
          padding: 10px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .subject-card:hover .subject-icon-wrapper {
          background: rgba(var(--box-accent-rgb), 0.1);
          border-color: rgba(var(--box-accent-rgb), 0.3);
        }
        .card-badge {
          font-size: 0.7rem;
          color: var(--text-main);
          opacity: 0.5;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .subject-title {
          font-size: 1.15rem;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--text-highlight);
          line-height: 1.4;
        }
        .card-explore-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--box-accent);
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .subject-card:hover .card-explore-link {
          color: var(--text-highlight);
        }
        .subject-card:hover .explore-arrow {
          transform: translateX(4px);
        }
        .explore-arrow {
          transition: transform 0.2s ease;
        }
        .back-link:hover {
          color: var(--accent) !important;
          transform: translateX(-4px);
        }
        .back-link {
          transition: all 0.2s ease;
        }
        @media (max-width: 1024px) {
          .bento-grid-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .section-b-box {
            grid-row: auto;
          }
          .bento-box {
            padding: 24px;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default SectionPage;
