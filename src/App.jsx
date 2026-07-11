import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import Splash from './pages/Splash';
import GetStarted from './pages/GetStarted';
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
import LearnDashboard from './pages/LearnDashboard';
import ExerciseContainer from './pages/ExerciseContainer';

import CompareIntro from './pages/compare/CompareIntro';
import InviteLanding from './pages/compare/InviteLanding';
import CompareProcessing from './pages/compare/CompareProcessing';
import CompareReport from './pages/compare/CompareReport';
import { useAuth } from './context/AuthContext';

function SplashRoute() {
  return <Splash />;
}

function RootRedirect() {
  const { user, getUserNextStep } = useAuth();
  return <Navigate to={getUserNextStep(user)} replace />;
}

function RequireAuth({ children, redirectTo = '/auth' }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    if (location.pathname !== '/home') {
      localStorage.setItem('ocean_redirect', `${location.pathname}${location.search}`);
    }
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

function RequireProfileReady({ children }) {
  const { user, hasCompletedProfileSetup, hasCompletedOnboarding } = useAuth();

  if (!hasCompletedProfileSetup(user)) {
    return <Navigate to="/profile/setup" replace />;
  }

  if (!hasCompletedOnboarding(user)) {
    return <Navigate to="/onboarding/1" replace />;
  }

  return children;
}

function RequireProfileSetup({ children }) {
  const { user, hasCompletedProfileSetup } = useAuth();

  if (!hasCompletedProfileSetup(user)) {
    return <Navigate to="/profile/setup" replace />;
  }

  return children;
}

function RequireHomeReady({ children }) {
  const { user, getUserNextStep } = useAuth();
  const next = getUserNextStep(user);

  if (next !== '/home') {
    return <Navigate to={next} replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-on-background font-sans selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/splash" element={<SplashRoute />} />
        <Route path="/get-started" element={<GetStarted />} />

        <Route path="/onboarding/1" element={<RequireAuth><RequireProfileSetup><Onboarding1 /></RequireProfileSetup></RequireAuth>} />
        <Route path="/onboarding/2" element={<RequireAuth><RequireProfileSetup><Onboarding2 /></RequireProfileSetup></RequireAuth>} />
        <Route path="/onboarding/3" element={<RequireAuth><RequireProfileSetup><Onboarding3 /></RequireProfileSetup></RequireAuth>} />

        <Route path="/auth" element={<AuthPage />} />

        <Route path="/profile/setup" element={<RequireAuth><ProfileSetup /></RequireAuth>} />

        <Route path="/test-intro" element={<RequireAuth><RequireProfileReady><TestIntro /></RequireProfileReady></RequireAuth>} />
        <Route path="/test" element={<RequireAuth><RequireProfileReady><TestQuestions /></RequireProfileReady></RequireAuth>} />
        <Route path="/test-resume" element={<RequireAuth><RequireProfileReady><TestResume /></RequireProfileReady></RequireAuth>} />

        <Route path="/calculating" element={<RequireAuth><RequireProfileReady><CalculatingProfile /></RequireProfileReady></RequireAuth>} />
        <Route path="/reveal" element={<RequireAuth><RequireProfileReady><RevealProfile /></RequireProfileReady></RequireAuth>} />

        {/* Compare Flow */}
        <Route path="/compare/intro" element={<RequireAuth><RequireProfileReady><CompareIntro /></RequireProfileReady></RequireAuth>} />
        <Route path="/invite/:token" element={<InviteLanding />} />
        <Route path="/compare/processing/:token" element={<RequireAuth><RequireProfileReady><CompareProcessing /></RequireProfileReady></RequireAuth>} />
        <Route path="/compare/report/:token" element={<RequireAuth><RequireProfileReady><CompareReport /></RequireProfileReady></RequireAuth>} />
        <Route path="/learn/:skillId/level/:levelId" element={<RequireAuth><RequireProfileReady><ExerciseContainer /></RequireProfileReady></RequireAuth>} />

        {/* Routes with the main layout */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<RequireAuth redirectTo="/get-started"><RequireHomeReady><HomeDashboard /></RequireHomeReady></RequireAuth>} />
          <Route path="/learn" element={<RequireAuth><RequireProfileReady><LearnDashboard /></RequireProfileReady></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><RequireProfileReady><ProfilePage /></RequireProfileReady></RequireAuth>} />
          <Route path="/results" element={<RequireAuth><RequireProfileReady><OceanResults /></RequireProfileReady></RequireAuth>} />
        </Route>

        {/* fallback to splash for unknown routes */}
        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>
    </div>
  );
}
