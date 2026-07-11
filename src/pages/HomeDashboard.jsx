import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardWaitingCard from './compare/DashboardWaitingCard';

export default function HomeDashboard() {
  const { user, hasCompletedTest } = useAuth();
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [invites, setInvites] = useState([]);
  const [insightData, setInsightData] = useState(null);
  const [showAllComparisons, setShowAllComparisons] = useState(false);

  const profile = user?.profile || {};
  const result = profile.personalityResult || null;
  const completedTest = hasCompletedTest(user) || Boolean(insightData);
  const userName = user?.username || user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 200);

    if (hasCompletedTest(user)) {
      const token = localStorage.getItem('ocean_token') || localStorage.getItem('token');

      if (token) {
        void (async () => {
          try {
            const [inviteRes, insightRes] = await Promise.all([
              fetch('http://localhost:5000/api/v1/invites/me', {
                headers: { 'Authorization': `Bearer ${token}` }
              }),
              fetch('/api/v1/tests/completed', {
                headers: { 'Authorization': `Bearer ${token}` }
              })
            ]);

            const inviteData = await inviteRes.json();
            if (inviteData.invites) setInvites(inviteData.invites);

            if (insightRes.ok) {
              const insightResponse = await insightRes.json();
              if (insightResponse?.calculation) {
                setInsightData(insightResponse.calculation);
              }
            }
          } catch (err) {
            console.error(err);
          }
        })();
      }
    }

    return () => clearTimeout(timer);
  }, [user, hasCompletedTest]);

  const handleRemoveInvite = async (token) => {
    try {
      const accessToken = localStorage.getItem('ocean_token') || localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/v1/invites/${token}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (res.ok) {
        setInvites(prev => prev.filter(invite => invite.token !== token));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const scores = insightData?.scores ? {
    O: insightData.scores.O || 0,
    C: insightData.scores.C || 0,
    E: insightData.scores.E || 0,
    A: insightData.scores.A || 0,
    N: insightData.scores.N || 0
  } : result ? {
    O: result.openness || 0,
    C: result.conscientiousness || 0,
    E: result.extraversion || 0,
    A: result.agreeableness || 0,
    N: result.neuroticism || 0
  } : { O: 0, C: 0, E: 0, A: 0, N: 0 };

  const topCombinations = Array.isArray(insightData?.topCombinations)
    ? insightData.topCombinations
    : Array.isArray(result?.topCombinations)
      ? result.topCombinations
      : [];

  // The main profile card will feature their #1 combination (or fallback to archetype)
  const primaryCombo = topCombinations.length > 0 ? topCombinations[0] : null;
  const archetypeTitle = completedTest
    ? (primaryCombo ? primaryCombo.title : (insightData?.archetype?.title || result.personalityType || 'Your profile is ready'))
    : 'Take the test to complete your profile';

  // The carousel will feature all 4 top combinations
  const carouselCombos = topCombinations.slice(0, 4);

  return (
    <div className="bg-background min-h-screen pb-24 font-body-md text-on-background">
      <main className="max-w-container-max mx-auto   px-margin-mobile pt-stack-md space-y-stack-lg">
        {/* Greeting & Next Test Badge */}
        <section className="space-y-stack-sm relative">
          <div className="flex justify-between items-center
           ">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-background font-bold text-xl">Hey, {userName}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {completedTest ? 'Your clarity journey continues.' : 'Take your test to complete your profile.'}
              </p>
            </div>
            {/* <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-2 font-bold shadow-sm">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              Next Test: Sep 6  
              
            </div> */}
            <button
              onClick={() => navigate('/test-intro')}
              className=" absolute top-0 right-0 transparent   text-primary bg-surface-container px-2 py-1 rounded-sm font-label-sm text-label-sm flex items-center gap-0 font-semibold  hover:bg-primary/90 hover:text-on-primary transition-all active:scale-95 cursor-pointer text-nowrap"
            >
              <span className="material-symbols-outlined text-[14px] ">play_arrow</span>
              {completedTest ? 'Take New Test' : 'Start Test'}
            </button>
          </div>
        </section>

        {!completedTest && (
          <section className="rounded-lg border border-primary/10 bg-primary text-on-primary p-gutter shadow-sm">
            <div className="flex flex-col gap-stack-md md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <div className="mb-2 flex items-center gap-2 opacity-90">
                  <span className="material-symbols-outlined !text-[20px]">assignment</span>
                  <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest">Profile incomplete</span>
                </div>
                <h3 className="font-headline-md text-2xl font-bold">Your insights are waiting on your baseline.</h3>
                <p className="mt-2 font-body-md text-body-md opacity-80">
                  You can use Learn right now. Results and Compare unlock after the Big Five assessment.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/test-intro')}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-on-primary px-5 py-3 font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined !text-[18px]">play_arrow</span>
                Take Test
              </button>
            </div>
          </section>
        )}

        {/* OCEAN Summary Card (Updated to feature #1 Combo) */}
        <section className="bg-surface-container-lowest p-gutter rounded-xl border border-primary/10 transition-all hover:border-primary/20 shadow-sm cursor-pointer group" onClick={() => navigate(completedTest ? '/results' : '/test-intro')}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-md relative">
            <div className="space-y-unit w-full md:w-[60%] relative">
              <h3 className="font-headline-md text-headline-md font-bold">
                {completedTest ? 'Your Core Dynamic' : 'Complete Your Baseline'}
              </h3>
              <p className="font-display-sm text-primary font-bold mt-1">
                {archetypeTitle}
              </p>
              {primaryCombo && completedTest && (
                <p className="font-body-md text-on-surface-variant max-w-md mt-2 italic">
                  "{primaryCombo.summary}"
                </p>
              )}
              {!completedTest && (
                <p className="font-body-md text-on-surface-variant max-w-md mt-2">
                  The assessment unlocks your results story, trait scores, and comparison readiness.
                </p>
              )}

              {/* positioning this button to top right of the card */}
              <button className="mt-4 text-secondary font-label-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all absolute -top-4 right-[0px]">

                {completedTest ? 'View Full Story' : 'Take Test'}
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

        {invites.length > 0 && (
          <section className="space-y-stack-md">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-label-sm uppercase tracking-widest text-outline font-bold">Compare Invites</h3>
              {invites.length > 2 && (
                <button
                  type="button"
                  onClick={() => setShowAllComparisons(prev => !prev)}
                  className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <span>{showAllComparisons ? 'Show Less' : 'Show All'}</span>
                  <span className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${showAllComparisons ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
              )}
            </div>
            <div className="flex flex-col gap-4">
              {invites.slice(0, showAllComparisons ? invites.length : 2).map(invite => (
                <DashboardWaitingCard
                  key={invite._id}
                  invite={invite}
                  currentUserId={user?.id}
                  onRemove={() => handleRemoveInvite(invite.token)}
                />
              ))}
            </div>
          </section>
        )}

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
            <button
              onClick={() => navigate(completedTest ? '/compare/intro' : '/test-intro')}
              className={`group flex items-center justify-between p-stack-md bg-surface-container-high border border-outline/10 text-on-surface rounded-lg transition-all active:scale-[0.98] text-left ${completedTest ? 'hover:bg-surface-dim' : 'opacity-75'}`}
            >
              <div className="flex items-center gap-stack-md">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/5 rounded-full text-primary">
                  <span className="material-symbols-outlined text-[28px]">compare_arrows</span>
                </div>
                <div>
                  <span className="block font-headline-md text-[18px] font-bold mb-1">
                    {completedTest ? 'Compare with Someone' : 'Compare Locked'}
                  </span>
                  <span className="block font-body-md text-sm text-on-surface-variant">
                    {completedTest ? 'Analyze relationship dynamics' : 'Take your test to compare profiles'}
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">
                {completedTest ? 'chevron_right' : 'lock'}
              </span>
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
              <button
                type="button"
                onClick={() => navigate('/test-intro')}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-primary"
              >
                <span className="material-symbols-outlined !text-[18px]">quiz</span>
                Take Test
              </button>
            </div>
          )}
        </section>
      </main>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
