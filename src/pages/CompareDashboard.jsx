import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardWaitingCard from './compare/DashboardWaitingCard';

export default function CompareDashboard() {
  const { user, hasCompletedTest } = useAuth();
  const navigate = useNavigate();
  const [invites, setInvites] = useState([]);
  const [showAllComparisons, setShowAllComparisons] = useState(false);

  const completedTest = hasCompletedTest(user);

  useEffect(() => {
    if (completedTest) {
      const token = localStorage.getItem('ocean_token') || localStorage.getItem('token');
      if (token) {
        fetch('http://localhost:5000/api/v1/invites/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.invites) setInvites(data.invites);
          })
          .catch(err => console.error(err));
      }
    }
  }, [completedTest]);

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

  return (
    <div className="bg-background min-h-screen pb-24 font-body-md text-on-background">
      <main className="max-w-container-max mx-auto px-margin-mobile pt-stack-md space-y-stack-lg">
        
        <section className="space-y-stack-sm relative">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-background font-bold text-xl">Compare</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              See how your dynamic aligns with others.
            </p>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="space-y-stack-md">
          <button
            onClick={() => navigate(completedTest ? '/compare/intro' : '/test-intro')}
            className={`w-full group flex items-center justify-between p-stack-md bg-surface-container-high border border-outline/10 text-on-surface rounded-lg transition-all active:scale-[0.98] text-left ${completedTest ? 'hover:bg-surface-dim' : 'opacity-75'}`}
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
                  {completedTest ? 'Analyze relationship dynamics by generating an invite' : 'Take your test to compare profiles'}
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">
              {completedTest ? 'chevron_right' : 'lock'}
            </span>
          </button>
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

      </main>
    </div>
  );
}
