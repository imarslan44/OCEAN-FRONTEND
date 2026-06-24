import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import Splash from './pages/Splash';
import AuthPage from './pages/AuthPage';

import Onboarding1 from './pages/Onboarding1';
import Onboarding2 from './pages/Onboarding2';
import Onboarding3 from './pages/Onboarding3';

import ProfileSetup from './pages/ProfileSetup';
import ProfilePage from './pages/ProfilePage';
import TestIntro from './pages/TestIntro';
import TestQuestions from './pages/TestQuestions';
import TestResume from './pages/TestResume';
import CalculatingProfile from './pages/CalculatingProfile';
import RevealProfile from './pages/RevealProfile';
import OceanResults from './pages/OceanResults';
import HomeDashboard from './pages/HomeDashboard';

function SplashRoute() {
  return <Splash />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-on-background font-sans selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/splash" element={<SplashRoute />} />

        <Route path="/onboarding/1" element={<Onboarding1 />} />
        <Route path="/onboarding/2" element={<Onboarding2 />} />
        <Route path="/onboarding/3" element={<Onboarding3 />} />

        <Route path="/auth" element={<AuthPage />} />

        <Route path="/profile/setup" element={<ProfileSetup />} />

        <Route path="/test-intro" element={<TestIntro />} />
        <Route path="/test" element={<TestQuestions />} />
        <Route path="/test-resume" element={<TestResume />} />

        <Route path="/calculating" element={<CalculatingProfile />} />
        <Route path="/reveal" element={<RevealProfile />} />

        {/* Routes with the main layout */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomeDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/results" element={<OceanResults />} />
        </Route>

        {/* fallback to splash for unknown routes */}
        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>
    </div>
  );
}
