import React from 'react';
import Button from '../components/Button';

export default function Onboarding3View({ onNext, onBack, onSkip }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background">
      {/* Top Navigation */}
      <header className="flex items-center justify-between px-margin-mobile md:px-gutter h-16 w-full fixed top-0 z-50">
        <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary font-bold">
          OCEAN
        </span>
        <button 
          onClick={onSkip}
          className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors py-2 px-4 cursor-pointer"
        >
          Skip
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile pt-20 pb-32">
        <div className="w-full max-w-container-max flex flex-col md:flex-row md:items-center md:gap-stack-lg">
          
          {/* Illustration Section */}
          <div className="w-full md:w-1/2 flex flex-col items-start mb-stack-lg md:mb-0">
            <div className="relative w-full h-[200px] bg-surface-container/30 border border-primary/5 rounded-lg mb-stack-md flex flex-col justify-center gap-stack-sm p-4 overflow-hidden">
              {/* Mock User Comparison Cards */}
              <div className="flex items-center gap-3 bg-surface p-2.5 rounded-lg border border-primary/5">
                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex-shrink-0"></div>
                <div className="flex-grow">
                  <div className="h-2 w-12 bg-primary/20 rounded mb-1.5"></div>
                  <div className="h-1.5 w-24 bg-outline-variant/30 rounded"></div>
                </div>
                <span className="font-label-sm text-[10px] text-secondary font-bold uppercase">You</span>
              </div>
              <div className="flex items-center gap-3 bg-surface p-2.5 rounded-lg border border-primary/5 opacity-70">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex-shrink-0"></div>
                <div className="flex-grow">
                  <div className="h-2 w-16 bg-primary/10 rounded mb-1.5"></div>
                  <div className="h-1.5 w-20 bg-outline-variant/30 rounded"></div>
                </div>
                <span className="font-label-sm text-[10px] text-outline uppercase">Sara K.</span>
              </div>
            </div>
            
            {/* Ambient minimalist photo */}
            <div className="hidden md:block w-full h-[280px] rounded-lg overflow-hidden border border-primary/10">
              <img 
                className="w-full h-full object-cover grayscale opacity-95" 
                alt="Radar charts comparison illustration"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCorHt0fJqxmOrM3Ez-EucpRQCK1QxneoPioJ2AR3Fefmllm1wD3Vb3Tn3G5yRowhsgqv2WXbaK_6ZESUu-zDgfCpX1aYdSxpS0q4JRMiPa6kZqkb8YpbyVkWvosXSgjDj9F2zIqTzAQCLWXl23gM151IczNhdUk-IFcVfkkwyUntZt0uuHWcbwhpAfzMnFPqwU27fLnYWRnDMxSvCWTX7pr3eBAU12hz7SqMehBAORIBd5c0stF_wKW4a7zOVxJScVrteytVJ0EB0" 
              />
            </div>
          </div>

          {/* Narrative Section */}
          <div className="w-full md:w-1/2 flex flex-col items-start md:pl-stack-md">
            <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-[40px] text-on-surface mb-stack-sm max-w-md font-bold leading-tight">
              See yourself through real people.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg max-w-md leading-relaxed text-[17px]">
              Compare your exact scores with others on the app. No archetypes. Real numbers. Real people.
            </p>
            
            {/* Action Group */}
            <div className="w-full flex items-center gap-4">
              <Button 
                onClick={onBack}
                variant="secondary"
                icon="arrow_back"
              >
                Back
              </Button>
              <Button 
                onClick={onNext}
                variant="primary"
                icon="arrow_forward"
              >
                Get Started
              </Button>
            </div>
          </div>
          
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="fixed bottom-0 left-0 w-full px-margin-mobile pb-12 pt-6 bg-gradient-to-t from-surface to-transparent pointer-events-none">
        <div className="max-w-container-max mx-auto flex items-center justify-center gap-4 pointer-events-auto">
          <div className="h-1 w-12 rounded-full bg-surface-container-highest overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '100%' }}></div>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-surface-container-highest"></div>
            <div className="w-2 h-2 rounded-full bg-surface-container-highest"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
          </div>
          <div className="font-label-sm text-[11px] text-on-surface-variant opacity-50 tracking-wider">
            03 / 05
          </div>
        </div>
      </footer>
    </div>
  );
}
