import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const STEPS = [
  "Analyzing behavioral profile...",
  "Matching behavioral dimensions...",
  "Finding similarities...",
  "Finding differences...",
  "Generating insights...",
  "Preparing personalized recommendations..."
];

export default function CompareProcessing() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // 6 steps over ~4.5 seconds (750ms per step)
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 750);

    const redirectTimer = setTimeout(() => {
      navigate(`/compare/report/${token}`);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(redirectTimer);
    };
  }, [navigate, token]);

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-gutter relative overflow-hidden">
      {/* Background ambient effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute w-[200px] h-[200px] bg-secondary/10 rounded-full blur-[80px] animate-pulse delay-700"></div>
      </div>

      <div className="z-10 flex flex-col items-center max-w-sm text-center">
        {/* Animated spinner/rings */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-outline/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 border-4 border-secondary rounded-full border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary">psychology</span>
        </div>

        <h2 className="font-headline-md text-2xl font-bold mb-4">Building Comparison</h2>
        
        <div className="h-6 relative w-full overflow-hidden">
          {STEPS.map((step, idx) => (
            <p 
              key={idx}
              className={`absolute inset-0 text-on-surface-variant font-medium transition-all duration-500 ease-out ${
                idx === currentStep 
                  ? 'opacity-100 translate-y-0' 
                  : idx < currentStep 
                    ? 'opacity-0 -translate-y-full' 
                    : 'opacity-0 translate-y-full'
              }`}
            >
              {step}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
