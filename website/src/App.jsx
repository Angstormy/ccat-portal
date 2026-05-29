import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SectionPage from './pages/SectionPage';
import SubjectPage from './pages/SubjectPage';
import NotFound from './pages/NotFound';
import MiniAppLayout from './pages/MiniAppLayout';
import MiniAppHome from './pages/MiniAppHome';
import MiniAppSection from './pages/MiniAppSection';
import MiniAppSubject from './pages/MiniAppSubject';

const MainLayout = () => (
  <>
    <Navbar />
    <main style={{ marginTop: '80px', paddingBottom: '80px', flex: 1 }}>
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
        </Route>

        {/* Telegram Mini App Routes */}
        <Route path="/miniapp" element={<MiniAppLayout />}>
          <Route index element={<MiniAppHome />} />
          <Route path="section/:sectionId" element={<MiniAppSection />} />
          <Route path="section/:sectionId/subject/:subjectId" element={<MiniAppSubject />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
