import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const AGE_RANGES = ['16–20', '21–25', '26–30', '31–35', '36–40', '41–50'];

const GOALS = [
  { id: 'self', label: 'Self-understanding' },
  { id: 'growth', label: 'Personal growth' },
  { id: 'relationships', label: 'Better relationships' },
  { id: 'career', label: 'Career insight' },
  { id: 'curiosity', label: 'Just curious' },
];

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [animateChart, setAnimateChart] = useState(false);
  const fileInputRef = useRef(null);

  const profile = user?.profile || {};
  const personalityResult = profile?.personalityResult || {};

  const [formState, setFormState] = useState({
    username: user?.username || '',
    bio: profile?.bio || '',
    avatar: profile?.avatar || '',
    location: profile?.location || '',
    ageRange: profile?.ageRange || '',
    interests: profile?.interests || [],
    goals: profile?.goals || [],
    isPublic: profile?.isPublic !== undefined ? profile.isPublic : true,
  });

  const [originalState, setOriginalState] = useState(formState);

  useEffect(() => {
    setAnimateChart(true);
  }, []);

  useEffect(() => {
    if (user) {
      const newState = {
        username: user?.username || '',
        bio: user?.profile?.bio || '',
        avatar: user?.profile?.avatar || '',
        location: user?.profile?.location || '',
        ageRange: user?.profile?.ageRange || '',
        interests: user?.profile?.interests || [],
        goals: user?.profile?.goals || [],
        isPublic: user?.profile?.isPublic !== undefined ? user?.profile?.isPublic : true,
      };
      setFormState(newState);
      setOriginalState(newState);
    }
  }, [user]);

  const handleEdit = () => {
    setOriginalState(formState);
    setEditMode(true);
  };

  const handleCancel = () => {
    setFormState(originalState);
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      await updateUser(formState);
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormState(prev => ({ ...prev, avatar: url }));
    }
  };

  const toggleGoal = (goalId) => {
    setFormState(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : prev.goals.length < 3 ? [...prev.goals, goalId] : prev.goals
    }));
  };

  const handleInterestKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newInterest = e.target.value.trim();
      setFormState(prev => {
        if (!prev.interests.includes(newInterest)) {
          return { ...prev, interests: [...prev.interests, newInterest] };
        }
        return prev;
      });
      e.target.value = '';
    }
  };

  const removeInterest = (interest) => {
    setFormState(prev => ({ ...prev, interests: prev.interests.filter(i => i !== interest) }));
  };

  const scores = {
    O: personalityResult?.openness || 0,
    C: personalityResult?.conscientiousness || 0,
    E: personalityResult?.extraversion || 0,
    A: personalityResult?.agreeableness || 0,
    N: personalityResult?.neuroticism || 0,
  };

  const archetypeTitle = personalityResult?.personalityType || 'Take the test to discover your archetype';

  return (
    <div className="bg-background min-h-screen pb-24 font-body-md text-on-background">
      {/* Top App Bar */}
      <header className="w-full sticky top-0 z-50 bg-background/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-margin-mobile py-4 max-w-container-max mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">psychology</span>
            <h1 className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary font-bold">OCEAN</h1>
          </div>
          <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low border border-outline/10 text-on-surface hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined">close</span>
          </Link>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-margin-mobile pt-stack-sm pb-stack-lg space-y-stack-md">
        {!editMode ? (
          <>
            {/* Header Card */}
            <section className="bg-surface-container-lowest p-gutter rounded-xl border border-primary/10 shadow-sm relative overflow-hidden flex flex-col items-center text-center">
              {/* Decorative Background */}
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-container/20 to-secondary-container/20"></div>
              
              <div className="w-28 h-28 mt-4 rounded-full bg-surface-container-high overflow-hidden border-4 border-surface-container-lowest z-10 shadow-md">
                <img
                  src={profile?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuA8VuXlM7MElcwFl-O4wIJnYJbONCtYFRKfkbNCN--H-QaRZEa34Tv-5FuCgR505YjWRzVwaACJxfBLyA8bluOvNzrhqSFZH2Xw330XR7X0T_jgRIx4ceThrAnukS9QItfox2cUSgGcPsGv98JLRJdGSqVCB1ReJvjqB7CmQnMCPNRge4o_uWAHcMbZlE8fmKEOSHzl-HurD7W7ONXhuQ28zJT2dD3YGwEnmh-9IFIuxisO3LjBcjSu9UUUO8zVVKarpXdbVdXtdRM"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h1 className="font-headline-md text-headline-md text-on-surface font-bold mt-4">{user?.username || 'Guest'}</h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-[12px] mt-2 border ${formState.isPublic ? 'bg-primary/5 text-primary border-primary/20' : 'bg-surface-container-high text-on-surface-variant border-outline/10'}`}>
                <span className="material-symbols-outlined text-[14px]">{formState.isPublic ? 'public' : 'lock'}</span>
                {formState.isPublic ? 'Public Profile' : 'Private Profile'}
              </span>

              <button 
                onClick={handleEdit}
                className="mt-6 border border-outline/20 text-on-surface px-6 py-2 rounded-full font-label-sm font-bold flex items-center gap-2 hover:bg-surface-container-low transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Edit Profile
              </button>
            </section>

            {/* OCEAN Scores Card */}
            <section className="bg-surface-container-lowest p-gutter rounded-xl border border-primary/10 shadow-sm group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-md">
                <div className="space-y-unit w-full md:w-[50%]">
                  <h3 className="font-label-sm uppercase tracking-widest text-outline font-bold">Your Archetype</h3>
                  <p className="font-display-sm text-primary font-bold mt-1 leading-tight">
                    {archetypeTitle}
                  </p>
                  <button onClick={() => navigate('/results')} className="mt-4 text-secondary font-label-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Full Results 
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
                
                {/* Mini Vertical Bar Chart */}
                <div className="flex items-end gap-4 h-32 px-2 md:border-l border-outline/10 pt-4 md:pt-0">
                   {[
                     { label: 'O', val: scores.O, active: true },
                     { label: 'C', val: scores.C, active: true },
                     { label: 'E', val: scores.E, active: true },
                     { label: 'A', val: scores.A, active: true },
                     { label: 'N', val: scores.N, active: true },
                   ].map((trait, idx) => (
                     <div key={idx} className="flex flex-col items-center gap-2">
                       <div className="h-24 w-10 md:w-11 bg-surface-container-high rounded-t-sm overflow-hidden flex flex-col justify-end">
                         <div 
                           className={`w-full bg-primary rounded-t-sm transition-all duration-1000 ease-out`}
                           style={{ height: animateChart ? `${trait.val || 5}%` : '0%' }}
                         ></div>
                       </div>
                       <span className="font-label-sm text-[11px] font-bold">{trait.label}</span>
                     </div>
                   ))}
                 </div>
              </div>
            </section>

            {/* About Card */}
            {(profile?.bio || profile?.location || profile?.ageRange) && (
              <section className="bg-surface-container-lowest p-gutter rounded-xl border border-primary/10 shadow-sm space-y-4">
                <h3 className="font-label-sm uppercase tracking-widest text-outline font-bold mb-4">About</h3>
                
                {profile?.bio && (
                  <p className="text-on-surface leading-relaxed text-sm md:text-base">{profile.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
                  {profile?.location && (
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.ageRange && (
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined text-[18px]">cake</span>
                      <span>{profile.ageRange}</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Interests & Goals */}
            {(profile?.interests?.length > 0 || profile?.goals?.length > 0) && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                {profile?.interests?.length > 0 && (
                  <div className="bg-surface-container-lowest p-gutter rounded-xl border border-primary/10 shadow-sm">
                    <h3 className="font-label-sm uppercase tracking-widest text-outline font-bold mb-4">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-secondary-container text-on-secondary-container font-medium rounded-lg text-sm border border-secondary-container/50">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profile?.goals?.length > 0 && (
                  <div className="bg-surface-container-lowest p-gutter rounded-xl border border-primary/10 shadow-sm">
                    <h3 className="font-label-sm uppercase tracking-widest text-outline font-bold mb-4">Goals</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.goals.map((goalId) => {
                        const goal = GOALS.find(g => g.id === goalId);
                        return (
                          <span key={goalId} className="px-3 py-1.5 bg-surface-container-high text-on-surface font-medium rounded-lg text-sm border border-outline/10 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-primary/60">target</span>
                            {goal?.label || goalId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            )}
            
            {/* Logout section */}
            <div className="pt-4 flex justify-center pb-8">
               <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    navigate('/auth');
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-error/30 text-error hover:bg-error/5 hover:border-error transition-all active:scale-95 cursor-pointer font-bold text-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Logout
                </button>
            </div>
          </>
        ) : (
          /* ━━━━━━━━━━━━━━━━━━━━ EDIT MODE ━━━━━━━━━━━━━━━━━━━━ */
          <div className="bg-surface-container-lowest p-gutter rounded-xl border border-primary/10 shadow-sm max-w-2xl mx-auto space-y-stack-lg">
            
            <div className="flex items-center justify-between border-b border-outline/10 pb-4">
               <h2 className="font-headline-md font-bold text-on-surface">Edit Profile</h2>
               <button onClick={handleCancel} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-outline">
                 <span className="material-symbols-outlined">close</span>
               </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-24 h-24 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary/20">
                  <img src={formState.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuA8VuXlM7MElcwFl-O4wIJnYJbONCtYFRKfkbNCN--H-QaRZEa34Tv-5FuCgR505YjWRzVwaACJxfBLyA8bluOvNzrhqSFZH2Xw330XR7X0T_jgRIx4ceThrAnukS9QItfox2cUSgGcPsGv98JLRJdGSqVCB1ReJvjqB7CmQnMCPNRge4o_uWAHcMbZlE8fmKEOSHzl-HurD7W7ONXhuQ28zJT2dD3YGwEnmh-9IFIuxisO3LjBcjSu9UUUO8zVVKarpXdbVdXtdRM"} alt="Avatar" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="material-symbols-outlined text-white text-[32px] drop-shadow-md">photo_camera</span>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="text-primary font-bold text-sm hover:underline">Change Photo</button>
            </div>

            <div className="space-y-stack-md">
              <div className="space-y-1">
                <label className="font-label-sm text-outline font-bold uppercase tracking-wider text-[11px]">Display Name</label>
                <input type="text" value={formState.username} onChange={e => setFormState({ ...formState, username: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface border border-outline/20 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" maxLength={20} />
              </div>

              <div className="space-y-1">
                <label className="font-label-sm text-outline font-bold uppercase tracking-wider text-[11px]">Bio</label>
                <textarea value={formState.bio} onChange={e => setFormState({ ...formState, bio: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface border border-outline/20 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none" rows={3} maxLength={500} placeholder="Tell us a bit about yourself..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                <div className="space-y-1">
                  <label className="font-label-sm text-outline font-bold uppercase tracking-wider text-[11px]">Location</label>
                  <input type="text" value={formState.location} onChange={e => setFormState({ ...formState, location: e.target.value })} placeholder="City, Country" className="w-full px-4 py-3 rounded-xl bg-surface border border-outline/20 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="font-label-sm text-outline font-bold uppercase tracking-wider text-[11px]">Age Range</label>
                  <select value={formState.ageRange} onChange={e => setFormState({ ...formState, ageRange: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface border border-outline/20 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all">
                    <option value="">Select Age</option>
                    {AGE_RANGES.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2 border-t border-outline/10 pt-stack-md">
                <label className="font-label-sm text-outline font-bold uppercase tracking-wider text-[11px]">Interests</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formState.interests.map(interest => (
                    <span key={interest} className="px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded-lg text-sm flex items-center gap-2">
                      {interest}
                      <button type="button" onClick={() => removeInterest(interest)} className="text-on-secondary-container/60 hover:text-on-secondary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </span>
                  ))}
                </div>
                <input type="text" placeholder="Type an interest and press Enter..." onKeyDown={handleInterestKeyDown} className="w-full px-4 py-3 rounded-xl bg-surface border border-outline/20 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
              </div>

              <div className="space-y-3 border-t border-outline/10 pt-stack-md">
                <div>
                  <label className="font-label-sm text-outline font-bold uppercase tracking-wider text-[11px]">Goals (max 3)</label>
                  <p className="text-[12px] text-on-surface-variant mt-1">What are you hoping to get out of OCEAN?</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {GOALS.map(goal => {
                    const isSelected = formState.goals.includes(goal.id);
                    return (
                      <button key={goal.id} type="button" onClick={() => toggleGoal(goal.id)} className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm font-medium ${isSelected ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-outline/20 text-on-surface hover:border-outline/40'}`}>
                        <span>{goal.label}</span>
                        {isSelected && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 border-t border-outline/10 pt-stack-md">
                <label className="font-label-sm text-outline font-bold uppercase tracking-wider text-[11px]">Privacy Settings</label>
                <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline/20">
                  <div className="pr-4">
                    <p className="text-on-surface font-bold text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">{formState.isPublic ? 'public' : 'lock'}</span>
                      {formState.isPublic ? 'Public Profile' : 'Private Profile'}
                    </p>
                    <p className="text-[12px] text-on-surface-variant mt-1">
                      {formState.isPublic ? 'Others can view your OCEAN traits and archetype on the Explore page.' : 'Your profile is hidden from the Explore page.'}
                    </p>
                  </div>
                  <button type="button" onClick={() => setFormState({ ...formState, isPublic: !formState.isPublic })} className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-all duration-300 ${formState.isPublic ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 left-0 bg-white rounded-full transition-transform shadow-sm duration-300 ${formState.isPublic ? 'translate-x-6' : 'translate-x-0.5'}`}></span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-outline/10">
              <button type="button" onClick={handleCancel} className="flex-1 py-3 rounded-full border border-outline/20 text-on-surface font-bold hover:bg-surface-container transition-all">
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold shadow-md hover:bg-primary/90 transition-all active:scale-95">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full z-50 border-t border-outline/10 bg-surface h-16 flex justify-around items-center px-4">
        <Link to="/dashboard" className="flex flex-col items-center justify-center text-outline hover:bg-surface-container-low transition-all active:scale-95 duration-150 p-2 rounded">
          <span className="material-symbols-outlined">grid_view</span>
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
        <Link to="/profile" className="flex flex-col items-center justify-center text-primary font-bold active:scale-95 duration-150">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
          <span className="font-label-sm text-[11px] mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
}