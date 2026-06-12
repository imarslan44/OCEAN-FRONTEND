import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import SplashView from './views/SplashView';
import Onboarding1View from './views/Onboarding1View';
import Onboarding2View from './views/Onboarding2View';
import Onboarding3View from './views/Onboarding3View';
import AuthView from './views/AuthView';
import ProfileSetup from './pages/ProfileSetup'

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

function ProfileSetupRoute() {
  return <ProfileSetup />;
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
        <Route path="/profile/setup" element={<ProfileSetupRoute />} />
        {/* fallback to splash for unknown routes */}
        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>
    </div>
  );
}
