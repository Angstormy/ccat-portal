import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SectionPage from './pages/SectionPage';
import SubjectPage from './pages/SubjectPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ marginTop: '80px', paddingBottom: '80px', flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/section/:sectionId" element={<SectionPage />} />
          <Route path="/section/:sectionId/subject/:subjectId" element={<SubjectPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
