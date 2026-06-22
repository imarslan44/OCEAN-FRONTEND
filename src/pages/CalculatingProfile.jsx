import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LOADING_STATUS_STEPS = [
  "Normalizing responses...",
  "Quantifying extroversion metrics...",
  "Mapping neuroticism variance...",
  "Synthesizing openness scores...",
  "Finalizing trait correlations...",
  "Generating personalized report..."
];

export default function CalculatingProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(LOADING_STATUS_STEPS[0]);
  const [activeDot, setActiveDot] = useState(0);
  
  const [apiResult, setApiResult] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Retrieve testData from route state
  const testType = location.state?.testType || 'full';
  const testData = location.state?.testData || [];

  // 1. Fire submit request to backend on mount
  useEffect(() => {
    if (testData.length === 0) {
      // Redirect back if accessed directly
      navigate('/test-intro');
      return;
    }

    const submitAnswers = async () => {
      try {
        const token = user?.token || localStorage.getItem('ocean_token');
        const res = await fetch('/api/v1/tests/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            testType,
            testData,
            timeSpent: 300 // simulated time spent in seconds
          })
        });

        if (!res.ok) {
          if (res.status === 401) {
            // Invalid or expired token, clear cache
            localStorage.removeItem('ocean_token');
            localStorage.removeItem('ocean_user');
            navigate('/auth');
            return;
          }
          const errText = await res.text();
          throw new Error('Failed to compute assessment results: ' + res.status + ' ' + errText);
        }

        const data = await res.json();
        setApiResult(data.calculation);
      } catch (err) {
        console.error(err);
        setApiError(err.message);
      }
    };

    submitAnswers();
  }, [testData, testType, navigate, user]);

  // 2. Animate the dots
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setActiveDot(prev => (prev + 1) % 3);
    }, 400);
    return () => clearInterval(dotInterval);
  }, []);

  // 3. Simulate progress bar percentage and status text
  useEffect(() => {
    let progressTimer;
    
    const updateProgress = () => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }

        // Variable speed increment
        let increment = Math.random() * 8 + 2;
        
        // If API is not completed yet, stall progress at 95%
        if (prev + increment >= 95 && !apiResult && !apiError) {
          return 95;
        }
        
        const nextProgress = Math.min(prev + increment, 100);

        // Update status text based on progress
        const targetStepIndex = Math.floor((nextProgress / 100) * LOADING_STATUS_STEPS.length);
        const nextStatus = LOADING_STATUS_STEPS[Math.min(targetStepIndex, LOADING_STATUS_STEPS.length - 1)];
        setStatusText(nextStatus);

        return nextProgress;
      });
    };

    progressTimer = setInterval(updateProgress, 350 + Math.random() * 300);
    return () => clearInterval(progressTimer);
  }, [apiResult, apiError]);

  // 4. Redirect to reveal page once progress is 100% and apiResult is ready
  useEffect(() => {
    if (progress === 100) {
      if (apiResult) {
        // Backend holds calculations; frontend only animates then navigates.
        const timer = setTimeout(() => {
          navigate('/reveal');
        }, 500);
        return () => clearTimeout(timer);
      } else if (apiError) {
        alert('An error occurred during submission: ' + apiError);
        navigate('/test-intro');
      }
    }
  }, [progress, apiResult, apiError, navigate]);

  return (
    <div className="bg-background text-primary font-body-md overflow-hidden h-screen flex flex-col select-none">
      {/* Top Navbar */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-margin-mobile md:px-gutter h-16 w-full border-b border-primary/10 bg-surface">
        <div className="flex items-center gap-2 max-w-container-max mx-auto w-full">
          <span className="material-symbols-outlined text-primary !text-[24px]">psychology</span>
          <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary font-bold">
            OCEAN
          </span>
        </div>
      </header>

      {/* Main content loader container */}
      <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile text-center">
        <div className="max-w-md w-full flex flex-col items-center">
          
          {/* Pulsing Animated Brain Circle */}
          <div className="relative w-48 h-48 mb-stack-lg flex items-center justify-center">
            
            {/* Spinning/Rotating Outer Ring */}
            <div className="absolute inset-0 border border-primary/5 rounded-full animate-spin [animation-duration:16s]"></div>
            
            {/* Inner Pulsing Ring */}
            <div className="absolute w-[90%] h-[90%] border border-primary/10 rounded-full animate-ping [animation-duration:2.5s]"></div>
            
            {/* Logo Icon and dots */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[64px] text-primary animate-pulse">
                psychology
              </span>
              
              {/* Asymmetric loading indicator dots */}
              <div className="flex gap-2 mt-stack-sm h-1">
                <div className={`w-1.5 h-1.5 rounded-full bg-primary transition-opacity duration-200 ${activeDot === 0 ? 'opacity-100' : 'opacity-20'}`}></div>
                <div className={`w-1.5 h-1.5 rounded-full bg-primary transition-opacity duration-200 ${activeDot === 1 ? 'opacity-100' : 'opacity-20'}`}></div>
                <div className={`w-1.5 h-1.5 rounded-full bg-primary transition-opacity duration-200 ${activeDot === 2 ? 'opacity-100' : 'opacity-20'}`}></div>
              </div>
            </div>
          </div>

          {/* Typography Content */}
          <div className="space-y-stack-sm mb-stack-lg">
            <h1 className="font-headline-md text-headline-md text-primary font-bold">
              Calculating Profile
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-[280px] mx-auto leading-relaxed">
              Analyzing answers... Estimating Big Five dimensions and archetype.
            </p>
          </div>

          {/* Minimalist Progress Bar */}
          <div className="w-full h-[3px] bg-surface-container-highest overflow-hidden relative rounded-full">
            <div 
              className="absolute h-full bg-primary transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Dynamic Status Feedback */}
          <div className="mt-stack-sm h-4">
            <span className="font-label-sm text-label-sm text-on-primary-container opacity-60 font-semibold tracking-wide">
              {statusText} ({Math.round(progress)}%)
            </span>
          </div>

        </div>
      </main>

      {/* Floating Blurred Background Shapes for Modern Aesthetic */}
      <div className="fixed inset-0 -z-10 opacity-30 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-surface-container-high rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-surface-container rounded-full blur-[150px]"></div>
      </div>
    </div>
  );
}
