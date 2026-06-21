import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
  

  const scores = user?.profile?.personalityResult ? {
    O: user.profile.personalityResult.openness || 0,
    C: user.profile.personalityResult.conscientiousness || 0,
    E: user.profile.personalityResult.extraversion || 0,
    A: user.profile.personalityResult.agreeableness || 0,
    N: user.profile.personalityResult.neuroticism || 0
  } : { O: 0, C: 0, E: 0, A: 0, N: 0 };
  const archetypeTitle = user?.profile?.personalityResult?.personalityType || 'Unknown';
  
  return (
    <div className="bg-background min-h-screen pb-24 font-body-md text-on-background">
      {/* Top App Bar */}
      <header className="w-full sticky top-0 z-50 bg-background">
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
                src={user?.profile?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuA8VuXlM7MElcwFl-O4wIJnYJbONCtYFRKfkbNCN--H-QaRZEa34Tv-5FuCgR505YjWRzVwaACJxfBLyA8bluOvNzrhqSFZH2Xw330XR7X0T_jgRIx4ceThrAnukS9QItfox2cUSgGcPsGv98JLRJdGSqVCB1ReJvjqB7CmQnMCPNRge4o_uWAHcMbZlE8fmKEOSHzl-HurD7W7ONXhuQ28zJT2dD3YGwEnmh-9IFIuxisO3LjBcjSu9UUUO8zVVKarpXdbVdXtdRM"}
              />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-margin-mobile pt-stack-md space-y-stack-lg">
        {/* Greeting & Next Test Badge */}
        <section className="space-y-stack-sm">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-background font-bold">Hey, {user?.username || 'Guest'}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Your clarity journey continues.</p>
            </div>
            <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-2 font-bold shadow-sm">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              Next Test: Sep 6
            </div>
          </div>
        </section>

        {/* OCEAN Summary Card */}
        <section className="bg-surface-container-lowest p-gutter rounded-xl border border-primary/10 transition-all hover:border-primary/20 shadow-sm cursor-pointer group" onClick={() => navigate('/results')}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-md relative ">
           
            <div className="space-y-unit w-25% ">
              <h3 className="font-headline-md text-headline-md font-bold">Your Profile</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-2">
                Archetype: {archetypeTitle}
              </p>
              <button className="mt-4 max-sm:absolute -right-12 -top-4 text-nowrap  w-[75%] font-label-sm text-label-sm text-secondary flex items-center gap-1 group font-bold transition-all">
                View Detailed Report 
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              
            </div>
            
              
            
{/* Mini Vertical Bar Chart */}
             <div className="flex items-end gap-4 h-32 px-4 border-l border-outline/10">
               {[
                 { label: 'O', val: scores.O, active: true },
                 { label: 'C', val: scores.C, active: true },
                 { label: 'E', val: scores.E, active: false },
                 { label: 'A', val: scores.A, active: true },
                 { label: 'N', val: scores.N, active: false },
               ].map((trait, idx) => (
                 <div key={idx} className="flex flex-col items-center gap-2">
                   <div className="h-24 w-11 bg-surface-container-high rounded-t-sm overflow-hidden flex flex-col justify-end">
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
          <h3 className="font-label-sm text-label-sm uppercase tracking-widest text-outline font-bold">Quick Actions</h3>
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
            {/* Action 3 */}
            <button className="group flex items-center justify-between p-stack-md bg-surface-container-high border border-outline/10 text-on-surface rounded-lg transition-all hover:bg-surface-dim active:scale-[0.98] text-left">
              <div className="flex items-center gap-stack-md">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/5 rounded-full text-primary">
                  <span className="material-symbols-outlined text-[28px]">science</span>
                </div>
                <div>
                  <span className="block font-headline-md text-[18px] font-bold mb-1">Context Test</span>
                  <span className="block font-body-md text-sm text-on-surface-variant">Measure traits in specific settings</span>
                </div>
              </div>
              <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
            </button>
            {/* Action 4 */}
            <button className="group flex items-center justify-between p-stack-md bg-surface-container-high border border-outline/10 text-on-surface rounded-lg transition-all hover:bg-surface-dim active:scale-[0.98] text-left">
              <div className="flex items-center gap-stack-md">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/5 rounded-full text-primary">
                  <span className="material-symbols-outlined text-[28px]">forum</span>
                </div>
                <div>
                  <span className="block font-headline-md text-[18px] font-bold mb-1">Chat with AI</span>
                  <span className="block font-body-md text-sm text-on-surface-variant">Get personalized trait insights</span>
                </div>
              </div>
              <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Insights Carousel */}
        <section className="space-y-stack-md pb-12">
          <h3 className="font-label-sm text-label-sm uppercase tracking-widest text-outline font-bold">Recent Insights</h3>
          <div className="flex gap-gutter overflow-x-auto hide-scrollbar pb-4 -mx-margin-mobile px-margin-mobile">
            <div className="flex-shrink-0 w-72 h-48 bg-tertiary-fixed rounded-xl p-stack-md flex flex-col justify-end relative overflow-hidden group cursor-pointer shadow-sm">
              <div className="absolute inset-0 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <img 
                  alt="Insight Art" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdE9WJK6BZAv3REXpUiRLOppEL6efYyVkQwh3D56a2dCuQ0D8kYV7MSZT7pO4tu7YJljxbjsjQ26isS51Igotg6bM5erJPF4oq9saRWxEHmh0rzeNoFtDz1C6zJs-cw4q7iP-12_NzMKdi6tA0-7r2NH7PHzyYDQ4U7zV_Dq5Rbqa1WPT6-Y-iWggRrZRykML1g1U1kciXev-LJex5F7x1NulnfUR3q3xlsJB7fJD9CTalhA-bMj5PluHywYmXL7LJrTJ7dY0yG8Q"
                />
              </div>
              <span className="relative z-10 font-headline-md text-[20px] font-bold text-[#1e1b14]">Work Ethic</span>
              <span className="relative z-10 font-body-md text-[#4a463d] mt-1 leading-snug text-sm">8% increase in Conscientiousness since June.</span>
            </div>
            
            <div className="flex-shrink-0 w-72 h-48 bg-primary-fixed rounded-xl p-stack-md flex flex-col justify-end relative overflow-hidden group cursor-pointer shadow-sm">
              <div className="absolute inset-0 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <img 
                  alt="Insight Data" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQUds6WhRSldXm6i-gzdsGpXNBoY-QiekguHDL1Y4pDx0m20zWEStLCNSxU8-j8_YXo3Pu9NoSSijGUu4HrKoG4X5sQUdn9jS0bF1W5Df3_qGvvsG_RCHRXhuoPNPxLllNTYDX4w14sKpdqbHEoiLfvFaAmle3yZdzL-9bWInUCHv6r_ZQJV_DHs1X3eHPCl25vXKSf1NHJw64XGND3wA2wX_M1Dl4tS9FWE93uEIg4A7KBmJ9NJ2HDW8bom2kyAmAIDIaLVTxntI"
                />
              </div>
              <span className="relative z-10 font-headline-md text-[20px] font-bold text-[#0f1c2c]">Social Battery</span>
              <span className="relative z-10 font-body-md text-[#3a4859] mt-1 leading-snug text-sm">New data available from your recent meetup.</span>
            </div>
          </div>
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
        <Link to="#" className="flex flex-col items-center justify-center text-outline hover:bg-surface-container-low transition-all active:scale-95 duration-150 p-2 rounded">
          <span className="material-symbols-outlined">compare_arrows</span>
          <span className="font-label-sm text-[11px] mt-1">Compare</span>
        </Link>
        <Link to="#" className="flex flex-col items-center justify-center text-outline hover:bg-surface-container-low transition-all active:scale-95 duration-150 p-2 rounded">
          <span className="material-symbols-outlined">account_circle</span>
          <span className="font-label-sm text-[11px] mt-1">Profile</span>
        </Link>
      </nav>
      
      {/* Hide scrollbar for the horizontal scroll container */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
