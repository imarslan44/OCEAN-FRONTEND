import React, { useEffect, useState } from 'react';
 import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const navigate = useNavigate();
  const [driftOffset, setDriftOffset] = useState({ x: 0, y: 0 });

   useEffect(() => {
    // Navigate after 2.5 seconds based on auth state
    const timer = setTimeout(() => {
      const storedToken = localStorage.getItem('ocean_token');
      const storedUserStr = localStorage.getItem('ocean_user');

      if (storedToken && storedUserStr) {
        try {
          const storedUser = JSON.parse(storedUserStr);
          if (storedUser?.profile?.personalityResult) {
            navigate('/dashboard');
            return;
          }
        } catch (e) {
          console.error('Error parsing stored user', e);
        }
      }
      navigate('/test-intro');
    }, 2500);

    // Mouse movement micro-interaction
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setDriftOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
   }, [navigate]);

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center p-margin-mobile md:p-gutter bg-primary text-surface overflow-hidden">
      {/* Background Atmospheric Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-fixed blur-[120px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-on-primary-container blur-[100px]"></div>
      </div>

      {/* Central Identity Cluster */}
      <div 
        className="z-10 text-center animate-drift"
        style={{
          transform: `translate(${driftOffset.x}px, ${driftOffset.y}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="mb-stack-sm opacity-90">
          <span className="material-symbols-outlined !text-[48px] md:!text-[64px]">psychology</span>
        </div>
        <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg tracking-tighter text-surface uppercase">
          OCEAN
        </h1>
        <p className="font-body-md text-body-md md:font-body-lg md:text-body-lg text-surface-dim mt-stack-sm tracking-wide max-w-xs md:max-w-md mx-auto">
          Understand yourself. Track your growth.
        </p>
      </div>

      {/* Tactile Decorative Element */}
      <div className="absolute bottom-stack-lg w-full max-w-[200px] flex flex-col items-center gap-unit animate-fade-in">
        <div className="h-[1px] w-full bg-surface-variant/20"></div>
        <div className="flex justify-between w-full font-label-sm text-label-sm opacity-40 uppercase tracking-[0.2em]">
          <span>0.00</span>
          <span>1.00</span>
        </div>
      </div>

      {/* Ambient Loading Indicator */}
      <div className="mt-stack-lg flex gap-unit animate-fade-in absolute bottom-12">
        <div className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse [animation-delay:200ms]"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse [animation-delay:400ms]"></div>
      </div>

      {/* Visual Anchor */}
      <div className="fixed top-gutter left-gutter z-20 opacity-20">
        <div className="font-label-sm text-label-sm border-l border-surface/30 pl-unit py-1">
          VER 1.0.4<br />CORE ASSESSMENT
        </div>
      </div>
    </main>
  );
};

export default Splash;
