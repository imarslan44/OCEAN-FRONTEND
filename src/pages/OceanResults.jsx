import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function OceanResults() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [animate, setAnimate] = useState(false);
  const [calcData, setCalcData] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [isCheckingResults, setIsCheckingResults] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [expandedTraits, setExpandedTraits] = useState({});
  const [activeWatchOut, setActiveWatchOut] = useState(null);
  const [isDeepDiveVisible, setIsDeepDiveVisible] = useState(false);

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
            setNoResults(true);
          }
          return;
        }
        const data = await res.json();
        if (data?.calculation) {
          setCalcData(data.calculation);
        } else {
          setNoResults(true);
        }
      } catch (e) {
        console.error('Failed to fetch results:', e);
        setNoResults(true);
      } finally {
        setIsCheckingResults(false);
      }
    };
    fetchResults();
  }, [navigate, authLoading, user]);

  useEffect(() => {
    if (!calcData) return;
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, [calcData]);

  if (authLoading || isCheckingResults) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[48px]">progress_activity</span>
      </div>
    );
  }

  if (noResults || !calcData) {
    return (
      <div className="bg-background min-h-screen flex flex-col font-body-md text-on-background pb-24">
        <header className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-margin-mobile py-4 max-w-container-max mx-auto">
            <Link to="/home" className="flex items-center gap-2 cursor-pointer active:opacity-70">
              <span className="material-symbols-outlined text-primary text-[24px]">psychology</span>
              <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary font-bold">OCEAN</span>
            </Link>
          </div>
        </header>

        <main className="flex flex-grow items-center justify-center px-margin-mobile py-stack-lg">
          <section className="w-full max-w-lg rounded-lg border border-primary/10 bg-surface p-gutter text-center shadow-sm">
            <div className="mx-auto mb-stack-md flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed">
              <span className="material-symbols-outlined !text-[32px]">lock_open</span>
            </div>
            <h1 className="font-headline-md text-2xl font-bold text-on-surface">Take your test to get insights.</h1>
            <p className="mt-3 font-body-md text-body-md leading-relaxed text-on-surface-variant">
              Your results page will show your OCEAN scores, core dynamic, and trait-level story once your baseline assessment is complete.
            </p>
            <div className="mt-stack-lg flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => navigate('/test-intro')}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-primary transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined !text-[18px]">quiz</span>
                Take Test
              </button>
              <button
                type="button"
                onClick={() => navigate('/learn')}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary px-5 py-3 font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined !text-[18px]">school</span>
                Learn
              </button>
            </div>
          </section>
        </main>
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

  const currentCard = storyCards[currentCardIndex] || storyCards[0];

  return (
    <div className={`min-h-screen flex flex-col font-body-md pb-24 transition-colors duration-500 ease-in-out ${currentCard.color} ${currentCard.textColor}`}>
      {/* Top App Bar */}
      <header className="w-full sticky top-0 z-50 bg-black/5 backdrop-blur-md border-b border-black/5">
        {/* A back button pointing to home */}
        <Link to="/home" className="absolute top-4 left-4 flex items-center gap-2 cursor-pointer active:opacity-70 z-50">
          <span className="material-symbols-outlined text-gray-600 text-[24px]">arrow_back</span>
        </Link>
        <div className="flex items-center justify-center px-margin-mobile py-4 max-w-container-max mx-auto">
          <Link to="/home" className="flex items-center gap-2 cursor-pointer active:opacity-70">
            <span className="material-symbols-outlined text-gray-600 text-[24px]">psychology</span>
            <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-gray-600 font-bold">OCEAN</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow w-full mx-auto">
        
        {/* ABOVE THE FOLD: The Swipeable Story */}
        <section className="relative w-full h-[84vh] md:h-[600px] flex items-center justify-center overflow-hidden">
          {storyCards.map((card, idx) => {
            const isCurrent = currentCardIndex === idx;
            const isPrev = idx < currentCardIndex;
            const isNext = idx > currentCardIndex;
            
            return (
              <div 
                key={idx}
                className={`absolute w-full h-full rounded-none md:w-[90%] md:max-w-md md:h-[85%] md:rounded-2xl p-6 md:p-8 pt-16 md:pt-8 flex flex-col justify-center shadow-xl transition-all duration-500 ease-in-out cursor-pointer overflow-hidden ${card.color} ${card.textColor}
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
                  <>
                    <div className="flex flex-col h-full pb-6 pt-4">
                      <div className="flex justify-between items-center opacity-80 border-b border-black/10 pb-2 mb-4">
                        <span className="font-label-sm uppercase tracking-widest font-bold">Dynamic</span>
                        <span className="font-label-sm font-bold tracking-widest">{card.pair}</span>
                      </div>
                      <div className="mb-4">
                        <h2 className="font-headline-lg text-3xl font-bold leading-tight mb-2">{card.title}</h2>
                        <p className="font-body-lg text-xl font-medium opacity-90">{card.summary}</p>
                      </div>
                      <div className="flex-grow overflow-y-auto pr-2 pb-10 hide-scrollbar">
                        <p className="font-body-md opacity-85 leading-relaxed">
                          {card.detail}
                        </p>
                      </div>
                      
                      {card.watch_out && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveWatchOut(idx); }}
                          className="absolute bottom-6 right-6 flex items-center justify-center gap-1.5 bg-black/10 hover:bg-black/20 text-gray-700 py-2 px-3 rounded-xl font-label-sm uppercase font-bold tracking-widest transition-colors z-20 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[18px]">warning</span>
                          Watch Out
                        </button>
                      )}
                    </div>

                    {/* Card-specific Watchout Modal */}
                    <AnimatePresence>
                      {activeWatchOut === idx && (
                        <>
                          <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="absolute inset-0 bg-black/40 z-30"
                            onClick={(e) => { e.stopPropagation(); setActiveWatchOut(null); }}
                          />
                          <motion.div 
                            initial={{ y: '100%' }} 
                            animate={{ y: 0 }} 
                            exit={{ y: '100%' }} 
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className={`absolute bottom-0 left-0 w-full h-[70%] p-8 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] overflow-y-auto ${card.color} ${card.textColor}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex justify-between items-center mb-6">
                              <div className="flex items-center gap-2 opacity-90">
                                <span className="material-symbols-outlined">warning</span>
                                <span className="font-label-lg uppercase tracking-widest font-bold">Watch Out</span>
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setActiveWatchOut(null); }} 
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                              </button>
                            </div>
                            <p className="font-body-lg leading-relaxed opacity-90">{card.watch_out}</p>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            );
          })}
          
          {/* Desktop Navigation Controls */}
          <div className="hidden md:flex absolute bottom-4 w-full justify-center gap-3 px-8 max-w-md z-30 pointer-events-none">
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

        {/* Mobile Navigation Controls (Under the cards in document flow) */}
        <div className="flex md:hidden w-full flex-col gap-6 px-6 py-0">
          <div className="flex justify-center items-center gap-4 sm:gap-6 w-full">
            {/* Prev Button */}
            <button 
              className={`w-14 h-14 flex items-center justify-center rounded-full bg-white/30 text-black shadow-sm border border-black/5 backdrop-blur-sm transition-all ${currentCardIndex === 0 ? 'opacity-50 pointer-events-none' : 'opacity-100 active:scale-95'}`}
              onClick={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1))}
            >
              <span className="material-symbols-outlined text-[24px]">replay</span>
            </button>
            
            {/* Cross Button (Reject / Next) */}
            <button 
              className={`w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-lg text-gray-700 border border-black/5 transition-all ${currentCardIndex === storyCards.length - 1 ? 'opacity-50 pointer-events-none' : 'opacity-100 active:scale-95 hover:scale-105'}`}
              onClick={() => setCurrentCardIndex(Math.min(storyCards.length - 1, currentCardIndex + 1))}
            >
              <span className="material-symbols-outlined text-[32px] font-bold">close</span>
            </button>

            {/* Heart Button (Accept / Next) */}
            <button 
              className={`w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-lg text-red-500 border border-black/5 transition-all ${currentCardIndex === storyCards.length - 1 ? 'opacity-50 pointer-events-none' : 'opacity-100 active:scale-95 hover:scale-105'}`}
              onClick={() => setCurrentCardIndex(Math.min(storyCards.length - 1, currentCardIndex + 1))}
            >
              <span className="material-symbols-outlined text-[32px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            </button>

            {/* Next Button */}
            <button 
              className={`w-14 h-14 flex items-center justify-center rounded-full bg-white/30 text-black shadow-sm border border-black/5 backdrop-blur-sm transition-all ${currentCardIndex === storyCards.length - 1 ? 'opacity-50 pointer-events-none' : 'opacity-100 active:scale-95'}`}
              onClick={() => setCurrentCardIndex(Math.min(storyCards.length - 1, currentCardIndex + 1))}
            >
              <span className="material-symbols-outlined text-[24px]">skip_next</span>
            </button>
          </div>
          <button
            className="w-full flex items-center justify-center gap-2 bg-black/10 text-gray-500 py-3 rounded-xl font-label-sm uppercase font-bold tracking-widest transition-colors active:bg-black/20"
            onClick={() => {
              if (isDeepDiveVisible) {
                setIsDeepDiveVisible(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                setIsDeepDiveVisible(true);
                setTimeout(() => {
                  const deepDiveEl = document.getElementById('deep-dive');
                  if (deepDiveEl) {
                    const y = deepDiveEl.getBoundingClientRect().top + window.scrollY + 820;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }, 100);
              }
            }}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isDeepDiveVisible ? 'keyboard_double_arrow_up' : 'keyboard_double_arrow_down'}
            </span>
            {isDeepDiveVisible ? 'Close Deep Dive' : 'Deep Dive'}
          </button>
        </div>

        {/* BELOW THE FOLD: The Deep Dive */}
        <section 
          id="deep-dive" 
          className={`max-w-3xl mx-auto px-margin-mobile transition-all duration-700 ease-in-out overflow-hidden ${
            isDeepDiveVisible ? 'max-h-[5000px] py-stack-lg opacity-100' : 'max-h-0 py-0 opacity-0'
          }`}
        >
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

          <div className="flex justify-center gap-4 pt-8">
            <button 
              onClick={() => navigate('/test-intro')}
              className="bg-surface-container-high text-primary border border-primary/20 py-2 px-4 rounded-full font-label-lg font-bold tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-sm"
            >
              Take New Test
            </button>
            <button 
              onClick={() => navigate('/home')}
              className="bg-primary text-on-primary py-2 px-4 rounded-full font-label-lg font-bold tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-lg"
            >
              Go to Dashboard
            </button>
          </div>
        </section>

      </main>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
