import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OceanResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [animate, setAnimate] = useState(false);
  const [calcData, setCalcData] = useState(location.state?.calculation || null);

  // Start animation when calcData is ready
  useEffect(() => {
    if (calcData) {
      const timer = setTimeout(() => setAnimate(true), 100);
      return () => clearTimeout(timer);
    }
  }, [calcData]);

  // Fetch from backend if no route state (wait for auth to initialize)
  useEffect(() => {
    if (calcData) return;

    // Wait for auth to finish initializing
    if (authLoading) return;

    const fetchResults = async () => {
      const token = user?.token || localStorage.getItem('ocean_token');
      if (!token) {
        navigate('/auth');
        return;
      }
      try {
        const res = await fetch('/api/v1/tests/completed', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
          if (res.status === 401) {
            navigate('/auth');
          } else {
            // No completed test found or other server error
            navigate('/test-intro');
          }
          return;
        }
        const data = await res.json();
        const result = data.calculation || (data.scores ? data : null);
        if (result) {
          setCalcData(result);
        } else {
          navigate('/test-intro');
        }
      } catch (e) {
        console.error('Failed to fetch results:', e);
        navigate('/dashboard');
      }
    };
    fetchResults();
  }, [calcData, navigate, authLoading, user]);

  // Loading state: true while auth is loading or no calcData yet
  const isLoading = authLoading || !calcData;

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[48px]">progress_activity</span>
      </div>
    );
  }

  if (!calcData) return null;

  const { scores = {}, archetype = {}, traitDetails = {} } = calcData;

  return (
    <div className="bg-background min-h-screen flex flex-col font-body-md text-on-background">
      {/* Top App Bar */}
      <header className="w-full sticky top-0 z-50 bg-background">
        <div className="flex items-center justify-between px-margin-mobile py-4 max-w-container-max mx-auto">
          <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer active:opacity-70">
            <span className="material-symbols-outlined text-primary text-[24px]">psychology</span>
            <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary font-bold">OCEAN</span>
          </Link>
          <nav className="hidden md:flex items-center gap-gutter">
            <Link to="/dashboard" className="text-primary font-bold cursor-pointer hover:text-primary transition-colors duration-200">Home</Link>
            <span className="text-outline cursor-pointer hover:text-primary transition-colors duration-200">Explore</span>
            <span className="text-outline cursor-pointer hover:text-primary transition-colors duration-200">Compare</span>
            <span className="text-outline cursor-pointer hover:text-primary transition-colors duration-200">Profile</span>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-container-max mx-auto px-margin-mobile w-full py-stack-lg">
        {/* Hero Section */}
        <section className="mb-stack-lg">
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background mb-stack-sm font-bold">
            Your OCEAN Profile
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Based on your recent assessment, here is your unique psychological fingerprint. These scores represent your preferences and tendencies across five core personality dimensions.
          </p>
        </section>

        {/* Bento Grid Assessment Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
          
          {/* Main Results Column */}
          <div className="md:col-span-8 space-y-gutter">
            <div className="bg-surface border border-primary/10 rounded-xl p-stack-md shadow-sm">
              <div className="space-y-stack-lg">
                
                {/* Traits mapping */}
                {[
                  { id: 'O', name: 'Openness', color: 'bg-secondary-container' },
                  { id: 'C', name: 'Conscientiousness', color: 'bg-primary' },
                  { id: 'E', name: 'Extraversion', color: 'bg-primary' },
                  { id: 'A', name: 'Agreeableness', color: 'bg-secondary-container' },
                  { id: 'N', name: 'Neuroticism', color: 'bg-primary' },
                ].map((trait, index) => (
                  <div key={trait.id}>
                    <div className="flex justify-between items-end mb-stack-sm">
                      <div>
                        <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest font-bold">Trait 0{index + 1}</span>
                        <h3 className="font-headline-md text-headline-md font-bold">{trait.name}</h3>
                      </div>
                      <span className="font-display-lg-mobile text-display-lg-mobile text-primary font-bold">{scores[trait.id]}%</span>
                    </div>
                    <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${trait.color} transition-all duration-1000 ease-out`}
                        style={{ width: animate ? `${scores[trait.id]}%` : '0%' }}
                      ></div>
                    </div>
                    {traitDetails && traitDetails[trait.id] && (
                      <p className="mt-stack-sm font-body-md text-body-md text-on-surface-variant">
                        Key insight: {traitDetails[trait.id].level} - {traitDetails[trait.id].bullets[0]}
                      </p>
                    )}
                  </div>
                ))}
                
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-gutter pt-stack-md">
              <button className="flex-1 bg-primary text-on-primary py-4 px-6 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hover:bg-on-surface transition-colors active:scale-[0.98] font-bold">
                Trait Details
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex-1 border border-primary text-primary py-4 px-6 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hover:bg-surface-container-low transition-colors active:scale-[0.98] font-bold"
              >
                Go to Dashboard
              </button>
            </div>
          </div>

          {/* Side Card for Context */}
          <aside className="md:col-span-4 space-y-gutter">
            <div className="bg-surface-container-low border border-primary/5 rounded-xl p-stack-md shadow-sm">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-stack-md">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Abstract art"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ059hb8ccG527YLNKD0g65vksOFFnVa2m94KAiZj4GO2cKdeteRKgshY8GYapsW5HBC2VJNXA9dcqVdqxzFTrdZSLjJdZ4qKioALXOwUoztB9IKhjHzB7VDocqwW9xSrePZps16DzXAK07G4iaYWqyeyx1Ppv_5OEZSEBngaT8VOuTliGRnD3E3ffFDHTKo7_XSeBhiiVgoynr6K9NZYr9_RMLqTlHMAZtasZcGedIC3ujRwCtQJN4IbCi9VLnJjqW8Lo5TDYcpk"
                />
              </div>
              <h4 className="font-headline-md text-headline-md mb-stack-sm font-bold">Insight Summary</h4>
              <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
                Your profile indicates a "{archetype.title}" archetype. {archetype.description}
              </p>
              
              {archetype.strengths && (
                <div className="mb-4">
                  <h5 className="font-label-sm uppercase tracking-widest text-outline mb-2 font-bold">Strengths</h5>
                  <ul className="space-y-2">
                    {archetype.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-center gap-2 font-body-md text-on-surface">
                        <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        {str}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

        </div>
      </main>
      
      {/* Spacer for mobile nav */}
      <div className="h-24 md:hidden"></div>

      {/* Bottom Nav Bar (Mobile) */}
      <footer className="md:hidden fixed bottom-0 w-full z-50 border-t border-outline/10 bg-surface">
        <div className="flex justify-around items-center h-16 px-4">
          <Link to="/dashboard" className="flex flex-col items-center justify-center text-primary font-bold active:scale-95 duration-150 cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
            <span className="font-label-sm text-[11px] mt-1">Home</span>
          </Link>
          <div className="flex flex-col items-center justify-center text-outline hover:bg-surface-container-low transition-all active:scale-95 duration-150 cursor-pointer p-2 rounded">
            <span className="material-symbols-outlined">group</span>
            <span className="font-label-sm text-[11px] mt-1">Explore</span>
          </div>
          <div className="flex flex-col items-center justify-center text-outline hover:bg-surface-container-low transition-all active:scale-95 duration-150 cursor-pointer p-2 rounded">
            <span className="material-symbols-outlined">compare_arrows</span>
            <span className="font-label-sm text-[11px] mt-1">Compare</span>
          </div>
          <div className="flex flex-col items-center justify-center text-outline hover:bg-surface-container-low transition-all active:scale-95 duration-150 cursor-pointer p-2 rounded">
            <span className="material-symbols-outlined">account_circle</span>
            <span className="font-label-sm text-[11px] mt-1">Profile</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
