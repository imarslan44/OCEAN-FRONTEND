import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Onboarding3 = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  useEffect(() => {
    updateUser({ onboardingComplete: true });
  }, [updateUser]);

  const handleNext = () => {
    if (user?.profile?.personalityResult) {
      navigate('/dashboard');
    } else {
      navigate('/test-intro');
    }
  };

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
            {/* Supplemental Minimalist Visual */}
            <div className="hidden md:block w-full h-[300px] rounded-lg overflow-hidden border border-primary/10">
              <img 
                className="w-full h-full object-cover grayscale opacity-80" 
                alt="Radar charts comparison illustration" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCorHt0fJqxmOrM3Ez-EucpRQCK1QxneoPioJ2AR3Fefmllm1wD3Vb3Tn3G5yRowhsgqv2WXbaK_6ZESUu-zDgfCpX1aYdSxpS0q4JRMiPa6kZqkb8YpbyVkWvosXSgjDj9F2zIqTzAQCLWXl23gM151IczNhdUk-IFcVfkkwyUntZt0uuHWcbwhpAfzMnFPqwU27fLnYWRnDMxSvCWTX7pr3eBAU12hz7SqMehBAORIBd5c0stF_wKW4a7zOVxJScVrteytVJ0EB0"
              />
            </div>
          </div>

          {/* Narrative Section */}
          <div className="w-full md:w-1/2 flex flex-col items-start">
            <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-surface mb-stack-sm max-w-md">
              See yourself through real people.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg max-w-md leading-relaxed">
              Compare your exact scores with others on the app. No archetypes. Real numbers. Real people.
            </p>
            {/* Action Group */}
            <div className="w-full flex items-center gap-4">
              <button 
                onClick={() => navigate('/onboarding/2')}
                className="px-6 py-3 bg-surface-container text-on-surface font-label-sm text-label-sm rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back
              </button>
              <button 
               onClick={handleNext}
                className="px-6 py-3 bg-primary text-on-primary font-label-sm text-label-sm rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Get Started
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
            <div className="h-full w-full bg-primary transition-all duration-500"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-surface-container-highest"></div>
            <div className="w-2 h-2 rounded-full bg-surface-container-highest"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant opacity-50">
            03 / 03
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Onboarding3;
