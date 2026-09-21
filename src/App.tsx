import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { StoriesPage } from './pages/StoriesPage';
import { StoryDetailPage } from './pages/StoryDetailPage';
import { RadioPage } from './pages/RadioPage';
import { RadioDetailPage } from './pages/RadioDetailPage';
import { InterviewsPage } from './pages/InterviewsPage';
import { InterviewDetailPage } from './pages/InterviewDetailPage';
import { AboutPage } from './pages/AboutPage';
import { GetFeaturedPage } from './pages/GetFeaturedPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminCmsPage } from './pages/AdminCmsPage';

// Helper component to scroll top on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/stories/:id" element={<StoryDetailPage />} />
            <Route path="/radio" element={<RadioPage />} />
            <Route path="/radio/:id" element={<RadioDetailPage />} />
            <Route path="/interviews" element={<InterviewsPage />} />
            <Route path="/interviews/:id" element={<InterviewDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/get-featured" element={<GetFeaturedPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/admin" element={<AdminCmsPage />} />
            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
