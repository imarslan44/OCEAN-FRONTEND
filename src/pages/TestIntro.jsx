import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

const TRAITS = [
  { letter: 'O', name: 'Openness', color: 'text-secondary', description: 'Curiosity, imagination & openness to new experiences' },
  { letter: 'C', name: 'Conscientiousness', color: 'text-primary', description: 'Organization, discipline & goal-directed behavior' },
  { letter: 'E', name: 'Extraversion', color: 'text-secondary', description: 'Social energy, assertiveness & positive emotions' },
  { letter: 'A', name: 'Agreeableness', color: 'text-primary', description: 'Empathy, cooperation & trust in others' },
  { letter: 'N', name: 'Neuroticism', color: 'text-secondary', description: 'Emotional sensitivity, stress reactivity & mood' },
];

const TestIntro = () => {
  const navigate = useNavigate();
  const { user, logout, getUserNextStep } = useAuth();
  const [expandedTrait, setExpandedTrait] = useState(null);
  const [hasInProgress, setHasInProgress] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const next = getUserNextStep(user);
    if (next !== '/test-intro') {
      navigate(next);
      return;
    }

    const fetchInProgress = async () => {
      try {
        const token = user?.token || localStorage.getItem('ocean_token');
        if (!token) {
          setHasInProgress(false);
          return;
        }

        const res = await fetch('/api/v1/tests/in-progress', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setHasInProgress(res.ok);
      } catch (e) {
        console.error('Failed to check in-progress test:', e);
        setHasInProgress(false);
      }
    };

    fetchInProgress();
  }, [user, navigate, getUserNextStep]);

  const ctaLabel = !user ? 'Get Started' : (hasInProgress ? 'Resume Test' : 'Begin Test');
  const ctaIcon = user && hasInProgress ? 'restore' : (user ? 'play_arrow' : 'arrow_forward');
  const ctaTarget = !user ? '/auth' : (hasInProgress ? '/test-resume' : '/test');

  return (
    <div className="bg-background min-h-screen flex flex-col items-center">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-sm border-b border-primary/10 flex items-center px-margin-mobile md:px-gutter h-16">
        <div className="flex items-center gap-2 max-w-container-max mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary !text-[24px]">psychology</span>
            <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary font-bold">
              OCEAN
            </span>
          </div>

          {user?.token && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/profile/setup')}
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors py-2 px-3 cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined !text-[16px]">arrow_back</span>
                Back
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAuthMenuOpen((v) => !v)}
                  className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors py-2 px-3 cursor-pointer"
                  aria-haspopup="menu"
                  aria-expanded={authMenuOpen}
                >
                  <span className="material-symbols-outlined !text-[18px] text-outline">account_circle</span>
                  {user?.username || 'Account'}
                  <span className="material-symbols-outlined !text-[18px] text-outline">expand_more</span>
                </button>

                {authMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-44 bg-surface border border-outline/10 rounded-xl shadow-lg z-50"
                    role="menu"
                  >
                    <button
                      type="button"
                      onClick={async () => {
                        setAuthMenuOpen(false);
                        await logout();
                        navigate('/auth');
                      }}
                      className="w-full text-left px-4 py-3 text-on-surface hover:bg-surface-container-low rounded-xl"
                      role="menuitem"
                    >
                      <span className="material-symbols-outlined !text-[18px] mr-2 align-middle">logout</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center w-full px-margin-mobile pt-24 pb-stack-lg max-w-container-max">
        <div className="w-full max-w-2xl flex flex-col md:flex-row md:items-start md:gap-stack-lg">

          <div className="w-full md:w-1/2 flex flex-col mb-stack-lg md:mb-0">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-surface-container mb-stack-md border border-primary/10">
              <span className="material-symbols-outlined text-primary !text-[28px]">neurology</span>
            </div>

            <h1 className="font-display-lg-mobile text-display-lg-mobile md:text-[36px] text-on-surface font-bold mb-stack-sm leading-tight">
              The Big Five Assessment
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-stack-md max-w-sm">
              You'll rate how strongly you agree or disagree with 50 statements. There are no right or wrong answers — just honest ones.
            </p>

            <div className="flex items-center gap-stack-md mb-stack-lg">
              <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg border border-primary/5">
                <span className="material-symbols-outlined !text-[18px] text-outline">timer</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">8–12 min</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg border border-primary/5">
                <span className="material-symbols-outlined !text-[18px] text-outline">quiz</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">50 questions</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                onClick={() => navigate(ctaTarget)}
                icon={ctaIcon}
                className="px-10"
              >
                {ctaLabel}
              </Button>
            </div>

            {!user && (
              <p className="mt-4 font-body-md text-body-md text-on-surface-variant">
                Already have an account?{' '}
                <button type="button" onClick={() => navigate('/auth')} className="text-primary font-semibold hover:underline cursor-pointer">
                  Log in
                </button>
              </p>
            )}
          </div>

          <div className="w-full md:w-1/2">
            <Card className="p-gutter md:p-stack-md">
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold text-lg mb-1">
                The Five Dimensions
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-stack-md">
                Each measures where you fall on a real psychological spectrum.
              </p>

              <div className="flex flex-col gap-1.5">
                {TRAITS.map((trait) => {
                  const isExpanded = expandedTrait === trait.letter;
                  return (
                    <button
                      key={trait.letter}
                      type="button"
                      onClick={() => setExpandedTrait(isExpanded ? null : trait.letter)}
                      className="flex flex-col w-full text-left px-4 py-3 rounded-lg transition-all cursor-pointer border border-transparent hover:border-primary/10 hover:bg-surface-container-low"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-display-lg-mobile text-display-lg-mobile font-bold ${trait.color} opacity-70 w-6 text-center`}>
                          {trait.letter}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface flex-grow font-semibold">
                          {trait.name}
                        </span>
                        <span className={`material-symbols-outlined !text-[18px] text-outline transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          expand_more
                        </span>
                      </div>
                      {isExpanded && (
                        <p className="font-body-md text-body-md text-on-surface-variant text-[13px] mt-2 ml-9 leading-relaxed">
                          {trait.description}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>

            <div className="mt-stack-md p-4 bg-surface-container-low rounded-lg border border-primary/5 flex items-start gap-3">
              <span className="material-symbols-outlined !text-[20px] text-secondary mt-0.5">info</span>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface font-semibold mb-1">No right or wrong answers</p>
                <p className="font-body-md text-body-md text-on-surface-variant text-[13px] leading-relaxed">
                  Answer instinctively. First reactions tend to be the most accurate reflection of your personality.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default TestIntro;
