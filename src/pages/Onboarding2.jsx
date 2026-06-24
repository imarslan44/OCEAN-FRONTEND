import React from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding2 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      {/* Top Navigation */}
      <header className="flex items-center justify-center px-margin-mobile md:px-gutter h-16 w-full fixed top-0 z-50">
        <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary font-bold">OCEAN</span>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile pt-20 pb-32">
        <div className="w-full max-w-container-max flex flex-col md:flex-row md:items-center md:gap-stack-lg">
          
          {/* Illustration Section */}
          <div className="w-full md:w-1/2 flex flex-col items-start mb-stack-lg md:mb-0">
            <div className="relative w-full h-[200px] bg-surface-container/30 border border-primary/5 rounded-lg mb-stack-md flex items-center justify-around overflow-hidden px-4">
              <div className="absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-primary/5 border-dashed border-t"></div>
              
              {/* Historical Data Timeline Points */}
              <div className="flex flex-col items-center z-10 transition-transform hover:scale-105">
                <div className="w-10 h-10 rounded-full border border-primary/20 bg-surface flex items-center justify-center mb-unit text-[18px]">
                  <span className="material-symbols-outlined !text-[18px]">history</span>
                </div>
                <span className="font-label-sm text-[10px] text-outline uppercase tracking-widest">Dec '25</span>
              </div>
              <div className="flex flex-col items-center z-10 transition-transform hover:scale-105">
                <div className="w-10 h-10 rounded-full border border-primary/20 bg-surface flex items-center justify-center mb-unit text-[18px]">
                  <span className="material-symbols-outlined !text-[18px]">update</span>
                </div>
                <span className="font-label-sm text-[10px] text-outline uppercase tracking-widest">Mar '26</span>
              </div>
              <div className="flex flex-col items-center z-10 transition-transform hover:scale-105">
                <div className="w-10 h-10 rounded-full border border-primary/20 bg-primary text-on-primary flex items-center justify-center mb-unit text-[18px]">
                  <span className="material-symbols-outlined !text-[18px]">today</span>
                </div>
                <span className="font-label-sm text-[10px] text-primary uppercase font-semibold tracking-widest">Jun '26</span>
              </div>
            </div>
            {/* Supplemental Minimalist Visual */}
            <div className="hidden md:block w-full h-[300px] rounded-lg overflow-hidden border border-primary/10">
              <img 
                className="w-full h-full object-cover grayscale opacity-80" 
                alt="Swirling plumes of navy and amber representing fluid thoughts" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdE9WJK6BZAv3REXpUiRLOppEL6efYyVkQwh3D56a2dCuQ0D8kYV7MSZT7pO4tu7YJljxbjsjQ26isS51Igotg6bM5erJPF4oq9saRWxEHmh0rzeNoFtDz1C6zJs-cw4q7iP-12_NzMKdi6tA0-7r2NH7PHzyYDQ4U7zV_Dq5Rbqa1WPT6-Y-iWggRrZRykML1g1U1kciXev-LJex5F7x1NulnfUR3q3xlsJB7fJD9CTalhA-bMj5PluHywYmXL7LJrTJ7dY0yG8Q"
              />
            </div>
          </div>

          {/* Narrative Section */}
          <div className="w-full md:w-1/2 flex flex-col items-start">
            <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-surface mb-stack-sm max-w-md">
              You change. Your data should too.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg max-w-md leading-relaxed">
              Every 90 days, retake the assessment. See what shifted, what grew, what stayed the same.
            </p>
            {/* Action Group */}
            <div className="w-full flex items-center gap-4">
              <button 
                onClick={() => navigate('/onboarding/1')}
                className="px-6 py-3 bg-surface-container text-on-surface font-label-sm text-label-sm rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back
              </button>
              <button 
                onClick={() => navigate('/onboarding/3')}
                className="px-6 py-3 bg-primary text-on-primary font-label-sm text-label-sm rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
            <div className="h-full w-2/3 bg-primary transition-all duration-500"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-surface-container-highest"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-surface-container-highest"></div>
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant opacity-50">
            02 / 03
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Onboarding2;
