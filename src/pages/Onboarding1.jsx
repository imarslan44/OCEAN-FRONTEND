import React from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding1 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      {/* Top Navigation */}
      <header className="flex items-center justify-between px-margin-mobile md:px-gutter h-16 w-full fixed top-0 z-50">
        <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary font-bold">OCEAN</span>
        <button 
          onClick={() => navigate('/test-intro')} 
          className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors py-2 px-4 cursor-pointer"
        >
          Skip
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile pt-20 pb-32">
        <div className="w-full max-w-container-max flex flex-col md:flex-row md:items-center md:gap-stack-lg">
          
          {/* Illustration Section */}
          <div className="w-full md:w-1/2 flex flex-col items-start mb-stack-lg md:mb-0">
            <div className="spectrum-container bg-surface-container/30 border border-primary/5 rounded-lg mb-stack-md flex items-center justify-center w-full relative h-[200px] overflow-hidden">
              <div className="spectrum-line absolute top-1/2 left-0 right-0 h-px bg-black/10"></div>
              <div className="spectrum-trail absolute top-1/2 left-[15%] w-[70%] h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent -translate-y-1/2"></div>
              <div className="spectrum-point absolute top-1/2 w-3 h-3 bg-secondary rounded-full -translate-x-1/2 -translate-y-1/2 animate-shift"></div>
              {/* Decorative Spectrum Labels */}
              <span className="absolute left-4 top-[58%] font-label-sm text-label-sm opacity-30">Analytical</span>
              <span className="absolute right-4 top-[58%] font-label-sm text-label-sm opacity-30">Creative</span>
            </div>
            {/* Supplemental Minimalist Visual */}
            <div className="hidden md:block w-full h-[300px] rounded-lg overflow-hidden border border-primary/10">
              <img 
                className="w-full h-full object-cover grayscale opacity-80" 
                alt="A minimalist balanced river stone on warm sand" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGfDXP3MBHaWLjNjPv8yKJyHnUsQyOApIfvFXVUgcuNPAtBwxzDxzJrn59KURm1tRECJD2AzrzEe7RFIsc65SKGiIuY9T38fTtQzqA911Ml7-_tFMURjJS9e8HOZsDFcSK02xYcHWYqbSJz16NtLpInQE_8mklXSFSpZWUC1uAeDD3E9B4cimvEu74O58Px1nesnbkGKq0wD0bsAOSqIGwbRua7Wwq6RHa2BbkhQpcMFyPCFe6Kpd0tqh5C5POJ_oOpHGsBxOLU8U"
              />
            </div>
          </div>

          {/* Narrative Section */}
          <div className="w-full md:w-1/2 flex flex-col items-start">
            <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-surface mb-stack-sm max-w-md">
              You are not a fixed type.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg max-w-md leading-relaxed">
              Big Five measures where you sit on 5 real psychological spectrums. Not a label — a position that shifts as you grow.
            </p>
            {/* Action Group */}
            <div className="w-full flex flex-col gap-unit">
              <button 
                onClick={() => navigate('/onboarding/2')}
                className="w-full md:w-auto px-6 py-3 bg-primary text-on-primary font-label-sm text-label-sm rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Next
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Controls */}
      <footer className="fixed bottom-0 left-0 w-full px-margin-mobile pb-12 pt-6 bg-gradient-to-t from-surface to-transparent">
        <div className="max-w-container-max mx-auto flex items-center justify-center gap-4">
          <div className="h-1 w-8 rounded-full bg-surface-container-highest overflow-hidden">
            <div className="h-full w-1/3 bg-primary transition-all duration-500"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-surface-container-highest"></div>
            <div className="w-2 h-2 rounded-full bg-surface-container-highest"></div>
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant opacity-50">
            01 / 03
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Onboarding1;
