import React from 'react';
import TestResume from './pages/TestResume';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import SplashView from './views/SplashView';
import Onboarding1View from './views/Onboarding1View';
import Onboarding2View from './views/Onboarding2View';
import Onboarding3View from './views/Onboarding3View';
import AuthView from './views/AuthView';
import ProfileSetup from './pages/ProfileSetup';
import ProfilePage from './pages/ProfilePage';
import TestIntro from './pages/TestIntro';
import TestQuestions from './pages/TestQuestions';
import CalculatingProfile from './pages/CalculatingProfile';
import RevealProfile from './pages/RevealProfile';
import OceanResults from './pages/OceanResults';
import HomeDashboard from './pages/HomeDashboard';

function SplashRoute() {
  const navigate = useNavigate();
  return <SplashView onComplete={() => navigate('/onboarding/1')} />;
}

function Onboarding1Route() {
  const navigate = useNavigate();
  return <Onboarding1View onNext={() => navigate('/onboarding/2')} onSkip={() => navigate('/auth')} />;
}

function Onboarding2Route() {
  const navigate = useNavigate();
  return <Onboarding2View onNext={() => navigate('/onboarding/3')} onBack={() => navigate('/onboarding/1')} onSkip={() => navigate('/auth')} />;
}

function Onboarding3Route() {
  const navigate = useNavigate();
  return <Onboarding3View onNext={() => navigate('/auth')} onBack={() => navigate('/onboarding/2')} onSkip={() => navigate('/auth')} />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-on-background font-sans selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <Routes>
        <Route path="/" element={<Navigate to="/splash" replace />} />
        <Route path="/splash" element={<SplashRoute />} />
        <Route path="/onboarding/1" element={<Onboarding1Route />} />
        <Route path="/onboarding/2" element={<Onboarding2Route />} />
        <Route path="/onboarding/3" element={<Onboarding3Route />} />
        <Route path="/auth" element={<AuthView />} />
        <Route path="/profile/setup" element={<ProfileSetup />} />
        <Route path="/test-intro" element={<TestIntro />} />
        <Route path="/test" element={<TestQuestions />} />
        <Route path="/test-resume" element={<TestResume />} />
          <Route path="/calculating" element={<CalculatingProfile />} />
        <Route path="/reveal" element={<RevealProfile />} />
        <Route path="/results" element={<OceanResults />} />
        <Route path="/dashboard" element={<HomeDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* fallback to splash for unknown routes */}
        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>
    </div>
  );
}
