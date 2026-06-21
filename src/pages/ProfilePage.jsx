import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const AGE_RANGES = ['16–20', '21–25', '26–30', '31–35', '36–40', '41–50', '51+'];

const GOALS = [
  { id: 'self', label: 'Self-understanding' },
  { id: 'growth', label: 'Personal growth' },
  { id: 'relationships', label: 'Better relationships' },
  { id: 'career', label: 'Career insight' },
  { id: 'curiosity', label: 'Just curious' },
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
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

  const archetypeTitle = personalityResult?.personalityType || 'Unknown';

  return (
    <div className="bg-background min-h-screen pb-16 font-body-md text-on-background">
      <header className="fixed top-0 w-full z-50 bg-surface-container/80 backdrop-blur-sm border-b border-primary/10 flex items-center px-margin-mobile md:px-gutter h-16">
        <div className="flex items-center justify-between max-w-container-max mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">psychology</span>
            <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary font-bold">OCEAN</span>
          </div>
          <Link to="/dashboard" className="text-outline hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </Link>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-margin-mobile pt-20 pb-stack-lg">
        {!editMode && (
          <>
            <div className="flex flex-col items-center mb-stack-lg">
              <div className="w-24 h-24 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary/20 mb-4">
                <img
                  src={profile?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuA8VuXlM7MElcwFl-O4wIJnYJbONCtYFRKfkbNCN--H-QaRZEa34Tv-5FuCgR505YjWRzVwaACJxfBLyA8bluOvNzrhqSFZH2Xw330XR7X0T_jgRIx4ceThrAnukS9QItfox2cUSgGcPsGv98JLRJdGSqVCB1ReJvjqB7CmQnMCPNRge4o_uWAHcMbZlE8fmKEOSHzl-HurD7W7ONXhuQ28zJT2dD3YGwEnmh-9IFIuxisO3LjBcjSu9UUUO8zVVKarpXdbVdXtdRM"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="font-headline-md text-headline-md text-on-surface font-bold">{user?.username || 'Guest'}</h1>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mt-2 ${formState.isPublic ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-[14px]">{formState.isPublic ? 'public' : 'private_connectivity'}</span>
                {formState.isPublic ? 'Public Profile' : 'Private Profile'}
              </span>
            </div>

            <div className="space-y-stack-md">
              {profile?.ageRange && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline">cake</span>
                  <span className="text-on-surface-variant">{profile.ageRange}</span>
                </div>
              )}

              {profile?.bio && (
                <div className="space-y-1">
                  <h3 className="font-label-sm text-label-sm text-outline">Bio</h3>
                  <p className="text-on-surface">{profile.bio}</p>
                </div>
              )}

              {profile?.location && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline">location_on</span>
                  <span className="text-on-surface">{profile.location}</span>
                </div>
              )}

              {profile?.interests?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-label-sm text-label-sm text-outline">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, idx) => (
                      <span key={idx} className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-sm">{interest}</span>
                    ))}
                  </div>
                </div>
              )}

              {profile?.goals?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-label-sm text-label-sm text-outline">Goals</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.goals.map((goalId) => {
                      const goal = GOALS.find(g => g.id === goalId);
                      return (
                        <span key={goalId} className="px-3 py-1 bg-surface-container-high text-on-surface rounded-full text-label-sm">
                          {goal?.label || goalId}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {personalityResult?.openness && (
                <div className="space-y-2">
                  <h3 className="font-label-sm text-label-sm text-outline">OCEAN Traits</h3>
                  <div className="flex items-end gap-4 h-24">
                    {[{ label: 'O', val: scores.O }, { label: 'C', val: scores.C }, { label: 'E', val: scores.E }, { label: 'A', val: scores.A }, { label: 'N', val: scores.N }].map((trait, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="h-16 w-8 bg-surface-container-high rounded-t-sm overflow-hidden flex flex-col justify-end">
                          <div className="w-full bg-primary rounded-t-sm transition-all duration-700" style={{ height: animateChart ? `${trait.val || 5}%` : '0%' }}></div>
                        </div>
                        <span className="font-label-sm text-[10px] mt-1 font-bold">{trait.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {archetypeTitle !== 'Unknown' && (
                <div className="space-y-1">
                  <h3 className="font-label-sm text-label-sm text-outline">Archetype</h3>
                  <p className="text-on-surface font-bold">{archetypeTitle}</p>
                </div>
              )}
            </div>

            <div className="mt-stack-xl flex justify-center">
              <Button variant="secondary" onClick={handleEdit} icon="edit">Edit Profile</Button>
            </div>
          </>
        )}

        {editMode && (
          <div className="space-y-stack-md">
            <div className="flex flex-col items-center mb-stack-md">
              <div className="w-24 h-24 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary/20 mb-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <img src={formState.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuA8VuXlM7MElcwFl-O4wIJnYJbONCtYFRKfkbNCN--H-QaRZEa34Tv-5FuCgR505YjWRzVwaACJxfBLyA8bluOvNzrhqSFZH2Xw330XR7X0T_jgRIx4ceThrAnukS9QItfox2cUSgGcPsGv98JLRJdGSqVCB1ReJvjqB7CmQnMCPNRge4o_uWAHcMbZlE8fmKEOSHzl-HurD7W7ONXhuQ28zJT2dD3YGwEnmh-9IFIuxisO3LjBcjSu9UUUO8zVVKarpXdbVdXtdRM"} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <Button variant="outlined" onClick={() => fileInputRef.current?.click()}>Change Avatar</Button>
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Display Name</label>
              <input type="text" value={formState.username} onChange={e => setFormState({ ...formState, username: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-outline/20 text-on-surface focus:border-primary focus:outline-none" maxLength={20} />
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Bio</label>
              <textarea value={formState.bio} onChange={e => setFormState({ ...formState, bio: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-outline/20 text-on-surface focus:border-primary focus:outline-none resize-none" rows={3} maxLength={500} />
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-outline">Location</label>
              <input type="text" value={formState.location} onChange={e => setFormState({ ...formState, location: e.target.value })} placeholder="City, Country" className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-outline/20 text-on-surface focus:border-primary focus:outline-none" />
            </div>

            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-outline">Age Range</label>
              <div className="grid grid-cols-4 gap-2">
                {AGE_RANGES.map(range => (
                  <button key={range} type="button" onClick={() => setFormState({ ...formState, ageRange: range })} className={`px-3 py-2 rounded-lg text-label-sm transition-all ${formState.ageRange === range ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-low border border-outline/20 text-on-surface hover:border-primary/50'}`}>
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-outline">Interests</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formState.interests.map(interest => (
                  <span key={interest} className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-sm flex items-center gap-1">
                    {interest}
                    <button type="button" onClick={() => removeInterest(interest)} className="text-on-secondary-container/70 hover:text-on-secondary-container">
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </span>
                ))}
              </div>
              <input type="text" placeholder="Type and press Enter to add interests" onKeyDown={handleInterestKeyDown} className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-outline/20 text-on-surface focus:border-primary focus:outline-none" />
            </div>

            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-outline">Goals (max 3)</label>
              <p className="text-body-sm text-on-surface-variant">When public, others can see your OCEAN trait scores and archetype. When private, only your interests and goals are visible.</p>
              <div className="flex flex-col gap-2 mt-2">
                {GOALS.map(goal => {
                  const isSelected = formState.goals.includes(goal.id);
                  return (
                    <button key={goal.id} type="button" onClick={() => toggleGoal(goal.id)} className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${isSelected ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-low text-on-surface'}`}>
                      <span>{goal.label}</span>
                      {isSelected && <span className="material-symbols-outlined text-primary">check_circle</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-outline">Profile Visibility</label>
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline/20">
                <div>
                  <p className="text-on-surface font-semibold">{formState.isPublic ? 'Public' : 'Private'}</p>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    {formState.isPublic ? 'Others can see your OCEAN traits and archetype' : 'Only interests and goals visible to others'}
                  </p>
                </div>
                <button type="button" onClick={() => setFormState({ ...formState, isPublic: !formState.isPublic })} className={`relative w-12 h-6 rounded-full transition-all ${formState.isPublic ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-on-primary rounded-full transition-transform ${formState.isPublic ? 'translate-x-6' : 'translate-x-0.5'}`}></span>
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-stack-lg">
              <Button variant="secondary" onClick={handleCancel} className="flex-1">Cancel</Button>
              <Button variant="primary" onClick={handleSave} className="flex-1">Save</Button>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 w-full z-50 border-t border-outline/10 bg-surface h-16 flex justify-around items-center px-4">
        <Link to="/dashboard" className="flex flex-col items-center justify-center text-outline hover:bg-surface-container-low transition-all active:scale-95 duration-150 p-2 rounded">
          <span className="material-symbols-outlined">grid_view</span>
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
        <Link to="/profile" className="flex flex-col items-center justify-center text-primary font-bold active:scale-95 duration-150">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
          <span className="font-label-sm text-[11px] mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
}