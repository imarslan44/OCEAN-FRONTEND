import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCombinationInsights } from '../data/ocean-insights-v2.js';

export default function HomeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const profile = user?.profile || {};
  const result = profile.personalityResult || {};

  const scores = result ? {
    O: result.openness || 0,
    C: result.conscientiousness || 0,
    E: result.extraversion || 0,
    A: result.agreeableness || 0,
    N: result.neuroticism || 0
  } : { O: 0, C: 0, E: 0, A: 0, N: 0 };

  // Use the new topCombinations from the v2 engine if available, otherwise generate them dynamically
  let topCombinations = result.topCombinations;
  if (!topCombinations || topCombinations.length === 0) {
    if (result && Object.keys(scores).some(k => scores[k] > 0)) {
      const combinationInsights = getCombinationInsights(scores);
      topCombinations = combinationInsights.default;
    } else {
      topCombinations = [];
    }
  }

  // The main profile card will feature their #1 combination (or fallback to archetype)
  const primaryCombo = topCombinations.length > 0 ? topCombinations[0] : null;
  const archetypeTitle = primaryCombo ? primaryCombo.title : (result.personalityType || 'Take the test to discover your archetype');

  // The carousel will feature all 4 top combinations
  const carouselCombos = topCombinations.slice(0, 4);

  return (
    <div className="bg-background min-h-screen pb-24 font-body-md text-on-background">
      {/* Top App Bar */}
      <header className="w-full sticky top-0 z-50 bg-background/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-margin-mobile py-4 max-w-container-max mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">psychology</span>
            <h1 className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary font-bold">OCEAN</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">notifications</span>
            <Link to="/profile" className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border border-outline/10 cursor-pointer">
              <img
                alt="Profile"
                className="w-full h-full object-cover"
                src={profile.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuA8VuXlM7MElcwFl-O4wIJnYJbONCtYFRKfkbNCN--H-QaRZEa34Tv-5FuCgR505YjWRzVwaACJxfBLyA8bluOvNzrhqSFZH2Xw330XR7X0T_jgRIx4ceThrAnukS9QItfox2cUSgGcPsGv98JLRJdGSqVCB1ReJvjqB7CmQnMCPNRge4o_uWAHcMbZlE8fmKEOSHzl-HurD7W7ONXhuQ28zJT2dD3YGwEnmh-9IFIuxisO3LjBcjSu9UUUO8zVVKarpXdbVdXtdRM"}
              />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-margin-mobile pt-stack-md space-y-stack-lg">
        {/* Greeting & Next Test Badge */}
        <section className="space-y-stack-sm ">
          <div className="flex justify-between items-center
           ">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-background font-bold">Hey, {user?.username || 'Guest'}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Your clarity journey continues.</p>
            </div>
            {/* <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-2 font-bold shadow-sm">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              Next Test: Sep 6  
              
            </div> */}
            <button
              onClick={() => navigate('/test-intro')}
              className=" transparent border border-primary/20 text-primary/70 px-4 py-2 rounded-xl font-label-sm text-label-sm flex items-center gap-2 font-bold  hover:bg-primary/90 transition-all active:scale-95 cursor-pointer text-nowrap"
            >
              <span className="material-symbols-outlined text-[16px] text-nowrap">play_arrow</span>
              Take New Test
            </button>
          </div>
        </section>

        {/* OCEAN Summary Card (Updated to feature #1 Combo) */}
        <section className="bg-surface-container-lowest p-gutter rounded-xl border border-primary/10 transition-all hover:border-primary/20 shadow-sm cursor-pointer group" onClick={() => navigate('/results')}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-md relative">
            <div className="space-y-unit w-full md:w-[60%] relative">
              <h3 className="font-headline-md text-headline-md font-bold">Your Core Dynamic</h3>
              <p className="font-display-sm text-primary font-bold mt-1">
                {archetypeTitle}
              </p>
              {primaryCombo && (
                <p className="font-body-md text-on-surface-variant max-w-md mt-2 italic">
                  "{primaryCombo.summary}"
                </p>
              )}

              {/* positioning this button to top right of the card */}
              <button className="mt-4 text-secondary font-label-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all absolute -top-4 right-[0px]">

                View Full Story
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            {/* Mini Vertical Bar Chart */}
            <div className="flex items-end gap-4 h-32 px-4 md:border-l border-outline/10 pt-4 md:pt-0">
              {[
                { label: 'O', val: scores.O, active: true },
                { label: 'C', val: scores.C, active: true },
                { label: 'E', val: scores.E, active: false },
                { label: 'A', val: scores.A, active: true },
                { label: 'N', val: scores.N, active: false },
              ].map((trait, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="h-24 w-11 md:w-11 bg-surface-container-high rounded-t-sm overflow-hidden flex flex-col justify-end">
                    <div
                      className={`w-full bg-primary rounded-t-sm ${!trait.active ? 'opacity-40' : ''} transition-all duration-1000 ease-out`}
                      style={{ height: animate ? `${trait.val || 5}%` : '0%' }}
                    ></div>
                  </div>
                  <span className="font-label-sm text-[11px] font-bold">{trait.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="space-y-stack-md">
          <h3 className="font-label-sm uppercase tracking-widest text-outline font-bold">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {/* Action 1 */}
            <button className="group flex items-center justify-between p-stack-md bg-primary text-on-primary rounded-lg transition-all active:scale-[0.98] text-left shadow-md hover:bg-primary/90">
              <div className="flex items-center gap-stack-md">
                <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full">
                  <span className="material-symbols-outlined text-[28px]">explore</span>
                </div>
                <div>
                  <span className="block font-headline-md text-[18px] font-bold mb-1">Explore People</span>
                  <span className="block font-body-md text-sm opacity-70">Find compatible archetypes</span>
                </div>
              </div>
              <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
            </button>
            {/* Action 2 */}
            <button className="group flex items-center justify-between p-stack-md bg-surface-container-high border border-outline/10 text-on-surface rounded-lg transition-all hover:bg-surface-dim active:scale-[0.98] text-left">
              <div className="flex items-center gap-stack-md">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/5 rounded-full text-primary">
                  <span className="material-symbols-outlined text-[28px]">compare_arrows</span>
                </div>
                <div>
                  <span className="block font-headline-md text-[18px] font-bold mb-1">Compare with Someone</span>
                  <span className="block font-body-md text-sm text-on-surface-variant">Analyze relationship dynamics</span>
                </div>
              </div>
              <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Dynamic Insights Carousel */}
        <section className="space-y-stack-md pb-12">
          <h3 className="font-label-sm uppercase tracking-widest text-outline font-bold">Your Insights</h3>

          {carouselCombos.length > 0 ? (
            <div className="flex gap-gutter overflow-x-auto hide-scrollbar pb-4 -mx-margin-mobile px-margin-mobile">
              {carouselCombos.map((combo, idx) => {
                const bgColors = ['bg-tertiary-fixed', 'bg-primary-fixed', 'bg-secondary-fixed'];
                const textColors = ['text-[#1e1b14]', 'text-[#0f1c2c]', 'text-[#2a1a1f]'];
                const subTextColors = ['text-[#4a463d]', 'text-[#3a4859]', 'text-[#4a353c]'];

                return (
                  <div key={idx} onClick={() => navigate('/results')} className={`flex-shrink-0 w-72 h-48 ${bgColors[idx % 3]} rounded-xl p-stack-md flex flex-col justify-end relative overflow-hidden group cursor-pointer shadow-sm`}>
                    {/* Background abstract shape pattern */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>

                    <span className="relative z-10 font-label-sm uppercase tracking-widest opacity-70 mb-2 font-bold">{combo.pair}</span>
                    <span className={`relative z-10 font-headline-md text-[20px] font-bold ${textColors[idx % 3]}`}>{combo.title}</span>
                    <span className={`relative z-10 font-body-md ${subTextColors[idx % 3]} mt-1 leading-snug text-sm line-clamp-2`}>{combo.summary}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-surface-container-low p-6 rounded-xl text-center border border-outline/10">
              <p className="text-on-surface-variant">Complete a test to unlock personalized insights.</p>
            </div>
          )}
        </section>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full z-50 border-t border-outline/10 bg-surface h-16 flex justify-around items-center px-4">
        <Link to="/dashboard" className="flex flex-col items-center justify-center text-primary font-bold active:scale-95 duration-150">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
          <span className="font-label-sm text-[11px] mt-1">Home</span>
        </Link>
        <Link to="#" className="flex flex-col items-center justify-center text-outline hover:bg-surface-container-low transition-all active:scale-95 duration-150 p-2 rounded">
          <span className="material-symbols-outlined">group</span>
          <span className="font-label-sm text-[11px] mt-1">Explore</span>
        </Link>
        <Link to="/results" className="flex flex-col items-center justify-center text-outline hover:bg-surface-container-low transition-all active:scale-95 duration-150 p-2 rounded">
          <span className="material-symbols-outlined">psychology</span>
          <span className="font-label-sm text-[11px] mt-1">Results</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center justify-center text-outline hover:bg-surface-container-low transition-all active:scale-95 duration-150 p-2 rounded">
          <span className="material-symbols-outlined">account_circle</span>
          <span className="font-label-sm text-[11px] mt-1">Profile</span>
        </Link>
      </nav>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
