import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OceanResults() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [animate, setAnimate] = useState(false);
  const [calcData, setCalcData] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [expandedTraits, setExpandedTraits] = useState({});

  // Fetch from backend (source of truth for calculations)
  useEffect(() => {
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
            navigate('/test-intro');
          }
          return;
        }
        const data = await res.json();
        if (data?.calculation) {
          setCalcData(data.calculation);
        } else {
          navigate('/test-intro');
        }
      } catch (e) {
        console.error('Failed to fetch results:', e);
        navigate('/dashboard');
      }
    };
    fetchResults();
  }, [navigate, authLoading, user]);

  useEffect(() => {
    if (!calcData) return;
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, [calcData]);

  if (authLoading || !calcData) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[48px]">progress_activity</span>
      </div>
    );
  }

  const { scores = {}, archetype = {}, traitInsights = {}, topCombinations = [] } = calcData;

  const toggleTrait = (traitId) => {
    setExpandedTraits(prev => ({ ...prev, [traitId]: !prev[traitId] }));
  };

  // Build the Swipeable Stack Array
  // Card 0 is the Cover (Archetype)
  // Cards 1-4 are the topCombinations
  const storyCards = [
    {
      type: 'cover',
      title: archetype.title || 'Your Profile',
      summary: archetype.description || 'Here is your psychological fingerprint.',
      color: 'bg-primary-fixed',
      textColor: 'text-on-primary-fixed'
    },
    ...topCombinations.map((combo, idx) => ({
      type: 'combo',
      title: combo.title,
      summary: combo.summary,
      detail: combo.detail,
      watch_out: combo.watch_out,
      pair: combo.pair,
      color: idx % 2 === 0 ? 'bg-secondary-container' : 'bg-tertiary-container',
      textColor: idx % 2 === 0 ? 'text-on-secondary-container' : 'text-on-tertiary-container'
    }))
  ];

  return (
    <div className="bg-background min-h-screen flex flex-col font-body-md text-on-background pb-24">
      {/* Top App Bar */}
      <header className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-margin-mobile py-4 max-w-container-max mx-auto">
          <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer active:opacity-70">
            <span className="material-symbols-outlined text-primary text-[24px]">psychology</span>
            <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary font-bold">OCEAN</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow w-full mx-auto">
        
        {/* ABOVE THE FOLD: The Swipeable Story */}
        <section className="relative w-full h-[70vh] md:h-[600px] flex items-center justify-center bg-surface-container-lowest overflow-hidden">
          {storyCards.map((card, idx) => {
            const isCurrent = currentCardIndex === idx;
            const isPrev = idx < currentCardIndex;
            const isNext = idx > currentCardIndex;
            
            return (
              <div 
                key={idx}
                className={`absolute w-[90%] max-w-md h-[85%] rounded-2xl p-8 flex flex-col justify-center shadow-xl transition-all duration-500 ease-in-out cursor-pointer ${card.color} ${card.textColor}
                  ${isCurrent ? 'translate-x-0 opacity-100 scale-100 z-20' : ''}
                  ${isPrev ? '-translate-x-[110%] opacity-0 scale-95 z-10' : ''}
                  ${isNext ? 'translate-x-[110%] opacity-0 scale-95 z-10' : ''}
                `}
                onClick={() => {
                  if (isCurrent && currentCardIndex < storyCards.length - 1) {
                    setCurrentCardIndex(idx + 1);
                  }
                }}
              >
                <div className="absolute top-4 left-0 w-full flex justify-center gap-1 px-8">
                  {storyCards.map((_, dotIdx) => (
                    <div 
                      key={dotIdx} 
                      className={`h-1 flex-1 rounded-full bg-white/30 ${currentCardIndex >= dotIdx ? 'bg-white/90' : ''}`}
                    />
                  ))}
                </div>

                {card.type === 'cover' && (
                  <div className="text-center space-y-6">
                    <span className="material-symbols-outlined text-[64px] opacity-80">fingerprint</span>
                    <h2 className="font-display-lg text-4xl font-bold leading-tight">{card.title}</h2>
                    <p className="font-body-lg text-lg opacity-90">{card.summary}</p>
                    <div className="mt-8 opacity-70 animate-bounce flex justify-center">
                      <span className="material-symbols-outlined text-[32px]">swipe_left</span>
                    </div>
                  </div>
                )}

                {card.type === 'combo' && (
                  <div className="space-y-6 overflow-y-auto hide-scrollbar pb-8 pt-4">
                    <div className="flex justify-between items-center opacity-80 border-b border-black/10 pb-2">
                      <span className="font-label-sm uppercase tracking-widest font-bold">Dynamic</span>
                      <span className="font-label-sm font-bold tracking-widest">{card.pair}</span>
                    </div>
                    <div>
                      <h2 className="font-headline-lg text-3xl font-bold leading-tight mb-2">{card.title}</h2>
                      <p className="font-body-lg text-xl font-medium opacity-90">{card.summary}</p>
                    </div>
                    <p className="font-body-md opacity-85 leading-relaxed">{card.detail}</p>
                    
                    {card.watch_out && (
                      <div className="bg-black/10 p-4 rounded-xl border-l-4 border-black/40 mt-4">
                        <span className="block font-label-sm uppercase font-bold tracking-widest mb-1 opacity-80">Watch Out</span>
                        <p className="font-body-md font-medium opacity-90">{card.watch_out}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Navigation Controls */}
          <div className="absolute bottom-4 w-full flex justify-between px-8 max-w-md z-30 pointer-events-none">
            <button 
              className={`w-12 h-12 rounded-full bg-black/20 text-white flex items-center justify-center backdrop-blur-sm pointer-events-auto transition-opacity ${currentCardIndex === 0 ? 'opacity-0' : 'opacity-100 hover:bg-black/40'}`}
              onClick={(e) => { e.stopPropagation(); setCurrentCardIndex(Math.max(0, currentCardIndex - 1)); }}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button 
              className={`w-12 h-12 rounded-full bg-black/20 text-white flex items-center justify-center backdrop-blur-sm pointer-events-auto transition-opacity ${currentCardIndex === storyCards.length - 1 ? 'opacity-0' : 'opacity-100 hover:bg-black/40'}`}
              onClick={(e) => { e.stopPropagation(); setCurrentCardIndex(Math.min(storyCards.length - 1, currentCardIndex + 1)); }}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </section>

        {/* BELOW THE FOLD: The Deep Dive */}
        <section className="max-w-3xl mx-auto px-margin-mobile py-stack-lg space-y-stack-lg">
          <div className="text-center mb-8">
            <h3 className="font-headline-lg text-headline-lg font-bold">The Deep Dive</h3>
            <p className="text-on-surface-variant mt-2">Explore the raw data behind your personality dynamics.</p>
          </div>

          <div className="space-y-4">
            {[
              { id: 'O', name: 'Openness', color: 'bg-primary' },
              { id: 'C', name: 'Conscientiousness', color: 'bg-secondary' },
              { id: 'E', name: 'Extraversion', color: 'bg-tertiary' },
              { id: 'A', name: 'Agreeableness', color: 'bg-primary' },
              { id: 'N', name: 'Neuroticism', color: 'bg-secondary' },
            ].map((trait, index) => {
              const insight = traitInsights[trait.id];
              if (!insight) return null;
              
              const isExpanded = expandedTraits[trait.id];

              return (
                <div key={trait.id} className="bg-surface border border-outline/10 rounded-xl overflow-hidden shadow-sm transition-all hover:border-primary/30">
                  <div 
                    className="p-6 cursor-pointer flex flex-col gap-4"
                    onClick={() => toggleTrait(trait.id)}
                  >
                    {/* Header Row */}
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="font-label-sm text-outline uppercase tracking-widest font-bold">Trait 0{index + 1}</span>
                        <h4 className="font-headline-md font-bold flex items-center gap-2">
                          {trait.name}
                          <span className="bg-surface-container text-[12px] px-2 py-0.5 rounded-full text-on-surface-variant border border-outline/10">
                            {insight.range === 'H' ? 'High' : insight.range === 'L' ? 'Low' : 'Mid'}
                          </span>
                        </h4>
                      </div>
                      <span className="font-display-sm text-primary font-bold">{scores[trait.id]}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${trait.color} transition-all duration-1000 ease-out`}
                        style={{ width: animate ? `${scores[trait.id]}%` : '0%' }}
                      />
                    </div>

                    {/* Summary & Expand Icon */}
                    <div className="flex justify-between items-start gap-4 mt-2">
                      <p className="font-body-md text-on-surface font-medium italic">"{insight.summary}"</p>
                      <span className={`material-symbols-outlined text-outline transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <div className={`transition-all duration-300 ease-in-out bg-surface-container-lowest border-t border-outline/5 overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-6 space-y-6">
                      <div>
                        <span className="font-label-sm uppercase tracking-widest text-outline font-bold mb-2 block">The Details</span>
                        <p className="font-body-md leading-relaxed text-on-surface-variant">{insight.detail}</p>
                      </div>
                      
                      {insight.watch_out && (
                        <div className="bg-error/10 border-l-4 border-error p-4 rounded-r-lg">
                          <span className="font-label-sm uppercase tracking-widest text-error font-bold mb-1 block">Watch Out</span>
                          <p className="font-body-md text-on-surface leading-relaxed">{insight.watch_out}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-8">
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-on-primary py-4 px-8 rounded-full font-label-lg font-bold tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-lg"
            >
              Go to Dashboard
            </button>
          </div>
        </section>

      </main>
      
      {/* Spacer for mobile nav */}
      <div className="h-24 md:hidden"></div>

      {/* Bottom Nav Bar (Mobile) */}
      <footer className="md:hidden fixed bottom-0 w-full z-50 border-t border-outline/10 bg-surface">
        <div className="flex justify-around items-center h-16 px-4">
          <Link to="/dashboard" className="flex flex-col items-center justify-center text-outline hover:text-primary transition-all active:scale-95 duration-150 p-2">
            <span className="material-symbols-outlined">grid_view</span>
            <span className="font-label-sm text-[11px] mt-1">Home</span>
          </Link>
          <div className="flex flex-col items-center justify-center text-primary font-bold active:scale-95 duration-150 p-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            <span className="font-label-sm text-[11px] mt-1">Results</span>
          </div>
        </div>
      </footer>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
