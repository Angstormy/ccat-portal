import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { 
  Zap, 
  ShieldCheck, 
  Send, 
  BookOpen, 
  Layers, 
  ArrowRight, 
  Calendar, 
  Info, 
  Coins, 
  CheckCircle
} from 'lucide-react';



const PG_COURSES = [
  { name: 'PGCP-AC', full: 'Advanced Computing', mode: 'Online or Physical', min: '55%', cat: 'Category II' },
  { name: 'PGCP-BDA', full: 'Big Data Analytics', mode: 'Online or Physical', min: '55%', cat: 'Category II' },
  { name: 'PGCP-AI', full: 'Artificial Intelligence', mode: 'Online or Physical', min: '60%', cat: 'Category II' },
  { name: 'PGCP-MC', full: 'Mobile Computing', mode: 'Fully Physical', min: '55%', cat: 'Category II' },
  { name: 'PGCP-ITISS', full: 'IT Infrastructure, Systems & Security', mode: 'Fully Physical', min: '55%', cat: 'Category II' },
  { name: 'PGCP-ASSD', full: 'Advanced Secure Software Development', mode: 'Fully Physical', min: '55%', cat: 'Category II' },
  { name: 'PGCP-HPCSA', full: 'HPC System Administration', mode: 'Fully Physical', min: '55%', cat: 'Category II' },
  { name: 'PGCP-FBD', full: 'FinTech & Blockchain Development', mode: 'Fully Online Only', min: '55%', cat: 'Category II' },
  { name: 'PGCP-CSF', full: 'Cyber Security & Forensics', mode: 'Fully Online Only', min: '55%', cat: 'Category II' },
  { name: 'PGCP-RAT', full: 'Robotics & Allied Technologies', mode: 'Fully Physical', min: '55%', cat: 'Category II' },
  { name: 'PGCP-ESD', full: 'Embedded Systems Design', mode: 'Fully Physical', min: '55%', cat: 'Category III' },
  { name: 'PGCP-VLSI', full: 'VLSI Design', mode: 'Fully Physical', min: '55%', cat: 'Category III' },
];

const Home = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');


  useEffect(() => {
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

  const scrollToBrowse = () => {
    document.getElementById('browse-sections')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="hero-blob blob-1"></div>
      <div className="hero-blob blob-2"></div>

      {/* HERO SECTION */}
      <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', paddingTop: 'clamp(80px, 15vw, 120px)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="animate-fade-up">
            <h1 style={{ fontSize: 'clamp(2rem, 8vw, 5.5rem)', letterSpacing: '-0.03em', marginBottom: '24px', wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>
              Master your exam with{' '}
              <span className="text-gradient-glow">Instant Telegram Delivery.</span>
            </h1>
          </div>
          
          <div className="animate-fade-up delay-100">
            <p style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', color: 'var(--text-main)', maxWidth: '600px', margin: '0 auto 40px auto' }}>
              Stop wrestling with shady ad-links and broken downloads. Get premium, high-quality CCAT study materials sent directly to your phone in seconds.
            </p>
          </div>

          <div className="animate-fade-up delay-200" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={scrollToBrowse}>
              Start Browsing Now
            </button>
            <a href={`https://t.me/${import.meta.env.VITE_BOT_USERNAME || ''}`} target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Open Bot <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.5rem)' }}>Why use CCAT Portal?</h2>
            <p style={{ color: 'var(--text-main)' }}>Built for speed, security, and an unparalleled user experience.</p>
          </div>

          <div className="grid-3">
            <div className="glass-card">
              <Zap size={32} color="var(--accent)" style={{ marginBottom: '20px' }} />
              <h3>Lightning Fast</h3>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>Bypass slow, rate-limited file servers. Our bot pushes files directly to you using Telegram's massive edge network.</p>
            </div>
            
            <div className="glass-card">
              <Send size={32} color="#0077ff" style={{ marginBottom: '20px' }} />
              <h3>Direct to Telegram</h3>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>No need to clutter your phone's downloads folder. Keep all your study materials neatly organized in your Telegram chat history.</p>
            </div>

            <div className="glass-card">
              <ShieldCheck size={32} color="#7000ff" style={{ marginBottom: '20px' }} />
              <h3>Secure & Ad-Free</h3>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>Every download generates a secure, single-use token. No pop-ups, no tracking scripts, just pure knowledge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="section">
        <div className="container">
          <h2 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.5rem)', textAlign: 'center', marginBottom: '60px' }}>How it works</h2>
          
          <div className="grid-3" style={{ gap: '48px' }}>
            <div style={{ position: 'relative' }}>
              <div className="step-number">1</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Find your subject</h3>
              <p style={{ color: 'var(--text-main)' }}>Browse our extensive library of notes, practice problems, and previous year questions categorized by section.</p>
            </div>
            
            <div style={{ position: 'relative' }}>
              <div className="step-number">2</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Generate a Token</h3>
              <p style={{ color: 'var(--text-main)' }}>Click download to automatically generate a secure, cryptographic token linking directly to the PDF file.</p>
            </div>

            <div style={{ position: 'relative' }}>
              <div className="step-number">3</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Claim in Telegram</h3>
              <p style={{ color: 'var(--text-main)' }}>We will automatically redirect you to our Telegram Bot. Just hit "Start" and the file is yours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* C-DAC C-CAT INFO GUIDE */}
      <section className="section info-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>C-DAC PG Diploma &amp; C-CAT Guide</h2>
            <p style={{ color: 'var(--text-main)', maxWidth: '700px', margin: '12px auto 0 auto' }}>
              Official details on course eligibility, C-CAT test syllabus, offered specializations, and admission schedules.
            </p>
          </div>

          <div className="info-tabs-container">
            <div className="info-tab-scroll-wrapper">
              <div className="info-tab-buttons">
                <button 
                  className={`info-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <Coins size={20} /> Registration & Fees
                </button>
                <button 
                  className={`info-tab-btn ${activeTab === 'syllabus' ? 'active' : ''}`}
                  onClick={() => setActiveTab('syllabus')}
                >
                  <BookOpen size={20} /> Syllabus & Books
                </button>
                <button 
                  className={`info-tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
                  onClick={() => setActiveTab('courses')}
                >
                  <Layers size={20} /> Offered PG Courses
                </button>
                <button 
                  className={`info-tab-btn ${activeTab === 'counseling' ? 'active' : ''}`}
                  onClick={() => setActiveTab('counseling')}
                >
                  <CheckCircle size={20} /> Counseling & Ranks
                </button>
                <button 
                  className={`info-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                  onClick={() => setActiveTab('timeline')}
                >
                  <Calendar size={20} /> Admission Timeline
                </button>
              </div>

              {/* Dot indicators — visible only on mobile */}
              <div className="tab-dot-indicators">
                {['overview', 'syllabus', 'courses', 'counseling', 'timeline'].map(tab => (
                  <button
                    key={tab}
                    className={`tab-dot ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                    aria-label={`Switch to ${tab} tab`}
                  />
                ))}
              </div>
            </div>

            <div className="info-tab-content">
              {activeTab === 'overview' && (
                <div style={{ animation: 'fadeIn 0.4s ease-out forwards' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-highlight)' }}>How to Register & Application Fees</h3>
                  <p style={{ color: 'var(--text-main)', marginBottom: '20px' }}>
                    Candidates must register online at the official C-DAC website. During registration, you will choose your qualifying degree, category of courses, and preferred cities for the exam.
                  </p>
                  
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '12px', color: 'var(--text-highlight)' }}>C-CAT Fee Structure</h4>
                  <div className="info-table-wrapper" style={{ marginBottom: '24px' }}>
                    <table className="info-table">
                      <thead>
                        <tr>
                          <th>Category</th>
                          <th>Applicable Sections</th>
                          <th>PG Diploma Course Options</th>
                          <th>Registration Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Category I</strong></td>
                          <td>Section A</td>
                          <td>PG Diploma in Geoinformatics (PG-DGi)</td>
                          <td>₹ 1,350/-</td>
                        </tr>
                        <tr>
                          <td><strong>Category II</strong></td>
                          <td>Section A + B</td>
                          <td>Advanced Computing (DAC), Big Data (DBDA), AI (DAI), Mobile (DMC), IT Security (DITISS), IoT (DIoT), Cyber Security (DCSF), etc.</td>
                          <td>₹ 1,550/-</td>
                        </tr>
                        <tr>
                          <td><strong>Category III</strong></td>
                          <td>Section A + B + C</td>
                          <td>Embedded Systems Design (DESD), VLSI Design (DVLSI), Robotics (DRAT), etc.</td>
                          <td>₹ 1,750/-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="helper-alert-box">
                    <Info size={20} color="var(--accent)" className="helper-alert-box-icon" />
                    <div className="helper-alert-box-content">
                      <h5>Important Fee Notes</h5>
                      <p>The registration fee is non-refundable and must be paid online using credit/debit cards or net banking. Candidates choosing Category III can also write Category I and II exams without extra fees if they are eligible.</p>
                    </div>
                  </div>


                </div>
              )}

              {activeTab === 'syllabus' && (
                <div style={{ animation: 'fadeIn 0.4s ease-out forwards' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-highlight)' }}>C-CAT Syllabus Structure</h3>
                  <p style={{ color: 'var(--text-main)', marginBottom: '24px' }}>
                    The C-DAC Common Admission Test (C-CAT) is divided into three test sections. Each section contains 50 objective-type multiple-choice questions (MCQs) and is 1 hour in duration.
                  </p>

                  <div className="syllabus-grid" style={{ marginBottom: '40px' }}>
                    <div className="syllabus-card">
                      <h4>Section A</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--accent)', marginBottom: '12px', fontWeight: '500' }}>
                        Required for All Courses • 1 Hour (50 Questions)
                      </p>
                      <ul>
                        <li>English Language & Grammar</li>
                        <li>Quantitative Aptitude & Mathematics</li>
                        <li>Reasoning Ability & Critical Logic</li>
                        <li>Computer Fundamentals & Concepts of Programming</li>
                      </ul>
                    </div>
                    <div className="syllabus-card">
                      <h4>Section B</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--accent)', marginBottom: '12px', fontWeight: '500' }}>
                        Required for Category II & III • 1 Hour (50 Questions)
                      </p>
                      <ul>
                        <li>C Programming Language</li>
                        <li>Data Structures & Algorithms</li>
                        <li>Object Oriented Programming (C++)</li>
                        <li>Operating Systems (Linux / Unix)</li>
                        <li>Computer Networks</li>
                      </ul>
                    </div>
                    <div className="syllabus-card">
                      <h4>Section C</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--accent)', marginBottom: '12px', fontWeight: '500' }}>
                        Required for Category III Only • 1 Hour (50 Questions)
                      </p>
                      <ul>
                        <li>Computer Architecture & Organization</li>
                        <li>Digital Electronics</li>
                        <li>Microprocessors & Microcontrollers</li>
                      </ul>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--text-highlight)' }}>Recommended Reference Books</h4>
                  <div className="books-grid">
                    <div className="book-item-card">
                      <div>
                        <div className="book-title">Quantitative Aptitude for Competitive Examinations</div>
                        <div className="book-author">R.S. Aggarwal</div>
                      </div>
                      <span className="book-topic-tag">Section A: Aptitude</span>
                    </div>
                    <div className="book-item-card">
                      <div>
                        <div className="book-title">Test of Reasoning & Critical Thinking</div>
                        <div className="book-author">Edgar Thorpe</div>
                      </div>
                      <span className="book-topic-tag">Section A: Reasoning</span>
                    </div>
                    <div className="book-item-card">
                      <div>
                        <div className="book-title">Let Us C / Test Your C Skills</div>
                        <div className="book-author">Yashavant Kanetkar</div>
                      </div>
                      <span className="book-topic-tag">Section A & B: C Programming</span>
                    </div>
                    <div className="book-item-card">
                      <div>
                        <div className="book-title">Data Structures Through C in Depth</div>
                        <div className="book-author">S.K. Srivastava / Deepali Srivastava</div>
                      </div>
                      <span className="book-topic-tag">Section B: Data Structures</span>
                    </div>
                    <div className="book-item-card">
                      <div>
                        <div className="book-title">Object Oriented Programming with C++</div>
                        <div className="book-author">E. Balagurusamy</div>
                      </div>
                      <span className="book-topic-tag">Section B: C++ OOP</span>
                    </div>
                    <div className="book-item-card">
                      <div>
                        <div className="book-title">Operating System Concepts (10th Edition)</div>
                        <div className="book-author">Silberschatz, Galvin, and Gagne</div>
                      </div>
                      <span className="book-topic-tag">Section B: Operating Systems</span>
                    </div>
                    <div className="book-item-card">
                      <div>
                        <div className="book-title">Digital Design (6th Edition)</div>
                        <div className="book-author">M. Morris Mano</div>
                      </div>
                      <span className="book-topic-tag">Section C: Digital Electronics</span>
                    </div>
                    <div className="book-item-card">
                      <div>
                        <div className="book-title">Microprocessor Architecture, Programming & Apps</div>
                        <div className="book-author">Ramesh S. Gaonkar</div>
                      </div>
                      <span className="book-topic-tag">Section C: Hardware</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'courses' && (
                <div style={{ animation: 'fadeIn 0.4s ease-out forwards' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-highlight)' }}>Specialized PG Diploma Courses</h3>
                  <p style={{ color: 'var(--text-main)', marginBottom: '24px' }}>
                    C-DAC offers a wide range of specialized post-graduate diplomas. Candidates are eligible to apply based on their qualifying degrees and C-CAT scores.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '24px', marginBottom: '40px' }}>
                    {PG_COURSES.map((course) => {
                      const isOnline = course.mode.toLowerCase().includes('online');
                      const isPhysical = course.mode.toLowerCase().includes('physical');
                      return (
                        <div key={course.name} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '200px' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <h4 style={{ color: 'var(--accent)', fontSize: '1.25rem', margin: 0 }}>{course.name}</h4>
                              <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: '600' }}>{course.cat}</span>
                            </div>
                            <p style={{ fontWeight: '600', color: 'var(--text-highlight)', fontSize: '1rem', marginBottom: '12px' }}>{course.full}</p>
                          </div>
                          <div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                              {isOnline && <span className="badge-custom badge-online">Online</span>}
                              {isPhysical && <span className="badge-custom badge-physical">Physical</span>}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>Min Academic Marks:</span>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-highlight)', fontWeight: '700' }}>{course.min}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="glass-card" style={{ padding: '32px' }}>
                    <h4 style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'var(--text-highlight)' }}>Minimum Academic Qualifications</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyle: 'none', padding: 0 }}>
                      <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span>
                        <span style={{ color: 'var(--text-main)' }}>
                          <strong>Engineering Graduate:</strong> Graduate in Engineering or Technology (4-year B.E. / B.Tech or 3-year Diploma + 3-year degree) in IT, Computer Science, Electronics, Electrical, Telecommunications, or Instrumentation.
                        </span>
                      </li>
                      <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span>
                        <span style={{ color: 'var(--text-main)' }}>
                          <strong>Postgraduate degree:</strong> M.Sc. / M.S. in Computer Science, IT, or Electronics, or MCA / MCM.
                        </span>
                      </li>
                      <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span>
                        <span style={{ color: 'var(--text-main)' }}>
                          <strong>Alternative fields:</strong> Post Graduate Degree in Physics, Mathematics, or Statistics (eligible for certain courses).
                        </span>
                      </li>
                      <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', borderTop: '1px solid var(--glass-border)', paddingTop: '16px', marginTop: '8px' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>ℹ</span>
                        <span style={{ color: 'var(--text-main)' }}>
                          <strong>Final Year Students:</strong> Students in their final year of qualifying degree can apply provisionally, provided they submit proof of passing with the required marks before the course starts.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}



              {activeTab === 'counseling' && (
                <div style={{ animation: 'fadeIn 0.4s ease-out forwards' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-highlight)' }}>Counseling & Seat Allocation</h3>
                  <p style={{ color: 'var(--text-main)', marginBottom: '24px' }}>
                    Ranks are declared based on candidate performance. Seat allocation is managed online via a centralized multi-round counseling process.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '24px', marginBottom: '32px' }}>
                    <div className="glass-card" style={{ padding: '24px' }}>
                      <h4 style={{ color: 'var(--accent)', fontSize: '1.2rem', marginBottom: '12px' }}>How Ranks are Declared</h4>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                        Depending on the sections attempted (A, B, or C), candidates receive individual ranks:
                      </p>
                      <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        <li><strong>Rank A:</strong> Eligible for Category I courses</li>
                        <li><strong>Rank B:</strong> Eligible for Category I & II courses</li>
                        <li><strong>Rank C:</strong> Eligible for Category I, II & III courses</li>
                      </ul>
                    </div>

                    <div className="glass-card" style={{ padding: '24px' }}>
                      <h4 style={{ color: 'var(--accent)', fontSize: '1.2rem', marginBottom: '12px' }}>Locking vs Freezing Seats</h4>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                        When a seat is allocated, you must pay a caution deposit of ₹10,000 + GST to secure it. Then you can:
                      </p>
                      <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        <li><strong>Freeze Choice:</strong> Opt out of further seat upgradations to lock the current training center.</li>
                        <li><strong>Keep Open:</strong> Allow the system to upgrade your seat in the next round if high-priority choices open up.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-highlight)' }}>Official C-CAT Tie-Breaker Rules</h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '12px' }}>
                      In case two or more candidates secure the same total marks, the following checks are run sequentially to determine rank:
                    </p>
                    <div className="info-table-wrapper">
                      <table className="info-table">
                        <thead>
                          <tr>
                            <th>Priority</th>
                            <th>Rule Condition</th>
                            <th>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>Section A Score</td>
                            <td>Candidate with higher marks in Section A gets the better rank.</td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>Section B Score</td>
                            <td>If Section A marks are identical, candidate with higher Section B marks gets preference (for Category II/III).</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>Section C Score</td>
                            <td>If Section A & B are identical, candidate with higher Section C marks gets preference (for Category III).</td>
                          </tr>
                          <tr>
                            <td>4</td>
                            <td>Qualifying Degree %</td>
                            <td>Candidate with a higher aggregate percentage in their qualifying degree receives a better rank.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div style={{ 
                  animation: 'fadeIn 0.4s ease-out forwards',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '60px 20px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '20px',
                  border: '1px dashed var(--glass-border)',
                  minHeight: '300px'
                }}>
                  <Calendar size={48} color="var(--accent)" style={{ marginBottom: '24px', opacity: 0.8 }} />
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--text-highlight)', fontWeight: '600' }}>
                    Admission Timeline & Phases
                  </h3>
                  <p style={{ 
                    color: 'var(--text-main)', 
                    fontSize: '1.1rem', 
                    maxWidth: '500px', 
                    margin: '0 auto',
                    lineHeight: '1.6'
                  }}>
                    Will be Updated Soon for New Batch
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC SECTIONS LISTING */}
      <section id="browse-sections" className="section" style={{ paddingBottom: 'clamp(40px, 8vw, 80px)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
            <Layers size={32} color="var(--accent)" />
            <h2 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.5rem)', margin: 0 }}>Available Collections</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-main)', padding: '40px 0' }}>
              <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid rgba(0, 229, 255, 0.3)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ marginTop: '16px' }}>Loading collections...</p>
            </div>
          ) : (
            <div className="grid-3">
              {sections.map(section => (
                <Link key={section.id} to={`/section/${section.id}`}>
                  <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                      <BookOpen size={28} color="rgba(255,255,255,0.8)" />
                      <div style={{ background: 'rgba(0, 229, 255, 0.1)', color: 'var(--accent)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                        Free Access
                      </div>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', textTransform: 'capitalize' }}>
                      {section.name || section.id.replace(/-/g, ' ')}
                    </h3>
                    <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '24px', flex: 1 }}>
                      Explore all subjects, handwritten notes, and comprehensive practice tests in this module.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-highlight)', fontWeight: '600', fontSize: '0.95rem' }}>
                      Browse Collection <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
              {sections.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px dashed var(--glass-border)' }}>
                  <p style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>No collections published yet. Check back soon!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      
      {/* SPINNER ANIMATION FOR LOADING STATE */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default Home;
