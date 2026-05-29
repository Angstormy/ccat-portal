import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Announcement from './components/Announcement';
import Footer from './components/Footer';
import Home from './pages/Home';
import SectionPage from './pages/SectionPage';
import SubjectPage from './pages/SubjectPage';
import NotFound from './pages/NotFound';

const MainLayout = () => (
  <>
    <Navbar />
    <Announcement />
    <main style={{ marginTop: '140px', paddingBottom: '80px', flex: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Website Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/section/:sectionId" element={<SectionPage />} />
          <Route path="/section/:sectionId/subject/:subjectId" element={<SubjectPage />} />
          
          {/* Redirect old Mini App link to main layout so it looks exactly like original */}
          <Route path="/miniapp" element={<Navigate to="/" replace />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
