import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function RevealProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isRevealing, setIsRevealing] = useState(false);
  const [entranceActive, setEntranceActive] = useState(false);
  
  const calculation = location.state?.calculation;

  useEffect(() => {
    if (!calculation) {
      // Redirect back if accessed directly
      navigate('/test-intro');
      return;
    }
    
    // Trigger entrance animation delay
    const timer = setTimeout(() => {
      setEntranceActive(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [calculation, navigate]);

  const handleReveal = () => {
    setIsRevealing(true);
    
    // Animate scale up, blur, and fade out
    setTimeout(() => {
      navigate('/results', { state: { calculation } });
    }, 800);
  };

  if (!calculation) return null;

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col items-center justify-center overflow-hidden relative select-none">
      
      {/* Top Header Placeholder for Alignment */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-center h-16 bg-transparent">
        <div className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary/10 select-none font-bold">
          OCEAN
        </div>
      </header>

      <main className="relative w-full max-w-container-max px-margin-mobile md:px-gutter flex flex-col items-center justify-center flex-1 py-stack-lg z-10">
        
        {/* The Reveal Card Container */}
        <div 
          className={`w-full max-w-[480px] transition-all duration-1000 ease-out transform ${
            entranceActive 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          } ${
            isRevealing 
              ? 'scale-105 blur-lg opacity-0 pointer-events-none' 
              : ''
          }`}
        >
          {/* Dashed Border Container */}
          <div className="relative p-2 rounded-xl border-2 border-dashed border-primary/20 bg-surface-container-low transition-all hover:border-primary/40 duration-500">
            
            {/* Inner Card Surface */}
            <div className="bg-surface p-stack-md md:p-stack-lg rounded-lg border border-primary/5 flex flex-col items-start gap-stack-md shadow-sm">
              
              {/* Psychology Circle Icon */}
              <div className="w-12 h-12 flex items-center justify-center bg-primary-container rounded-full mb-2">
                <span className="material-symbols-outlined text-on-primary text-2xl">psychology</span>
              </div>
              
              {/* Typography Heading */}
              <div className="space-y-stack-sm">
                <h1 className="font-headline-md text-headline-md-mobile md:text-headline-md text-primary tracking-tight font-bold">
                  Your OCEAN profile is ready.
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[320px] leading-relaxed">
                  Ready to see who you really are?
                </p>
              </div>

              {/* Abstract Identity Visual (Animated bar skeletons) */}
              <div className="w-full h-32 bg-surface-container rounded-lg overflow-hidden relative flex items-center justify-center border border-primary/5">
                <div 
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.5) 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }}
                ></div>
                
                {/* Horizontal skeleton preview bars that animate/pulse */}
                <div className="flex gap-3.5 items-end h-16 z-10 w-[70%] justify-center">
                  <div className="w-4.5 bg-primary/10 rounded-t-lg h-[40%] animate-pulse"></div>
                  <div className="w-4.5 bg-primary/20 rounded-t-lg h-[70%] animate-pulse [animation-delay:150ms]"></div>
                  <div className="w-4.5 bg-primary/30 rounded-t-lg h-[55%] animate-pulse [animation-delay:300ms]"></div>
                  <div className="w-4.5 bg-primary/15 rounded-t-lg h-[90%] animate-pulse [animation-delay:450ms]"></div>
                  <div className="w-4.5 bg-primary/25 rounded-t-lg h-[30%] animate-pulse [animation-delay:600ms]"></div>
                </div>

                {/* Shimmer overlay effect */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 3s infinite'
                  }}
                ></div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleReveal}
                className="group relative w-full h-14 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-2 overflow-hidden transition-all active:scale-[0.98] cursor-pointer font-bold uppercase tracking-wider"
              >
                <span className="relative z-10">Reveal My Profile</span>
                <span className="material-symbols-outlined relative z-10 transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              {/* Secure note */}
              <div className="w-full flex justify-center mt-1">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 font-bold">
                  Secure Assessment Data
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Subtitle Accents */}
          <div className="mt-stack-md flex justify-between items-center px-4 w-full text-on-surface-variant/30">
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-30"></div>
            </div>
            <span className="font-label-sm text-[9px] tracking-tighter uppercase font-bold">
              Est. 1992 OCEAN Framework
            </span>
          </div>
        </div>
      </main>

      {/* Background Subtle Color Circle */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none overflow-hidden">
        <div className="w-[500px] h-[500px] rounded-full bg-secondary-fixed-dim filter blur-[120px] mix-blend-multiply animate-pulse [animation-duration:8s]"></div>
      </div>
    </div>
  );
}
