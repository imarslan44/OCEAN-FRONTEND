import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

const AGE_RANGES = [
  '16–20', '21–25', '26–30', '31–35',
  '36–40', '41–50', '51+'
];

const COUNTRIES = [
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CA', name: 'Canada' },
  { code: 'CN', name: 'China' },
  { code: 'DE', name: 'Germany' },
  { code: 'DK', name: 'Denmark' },
  { code: 'EG', name: 'Egypt' },
  { code: 'ES', name: 'Spain' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IN', name: 'India' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KR', name: 'South Korea' },
  { code: 'MX', name: 'Mexico' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NO', name: 'Norway' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'RU', name: 'Russia' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SE', name: 'Sweden' },
  { code: 'SG', name: 'Singapore' },
  { code: 'US', name: 'United States' },
  { code: 'ZA', name: 'South Africa' },
];

const GOALS = [
  { id: 'self', icon: 'self_improvement', label: 'Self-understanding' },
  { id: 'growth', icon: 'trending_up', label: 'Personal growth' },
  { id: 'relationships', icon: 'group', label: 'Better relationships' },
  { id: 'career', icon: 'work', label: 'Career insight' },
  { id: 'curiosity', icon: 'lightbulb', label: 'Just curious' },
];

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user, updateUser, getUserNextStep } = useAuth();

  const [ageRange, setAgeRange] = useState('');
  const [country, setCountry] = useState('');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [step, setStep] = useState(1); // 1 = age + country, 2 = goals

  // Initialize form from existing user data and redirect if already complete
  useEffect(() => {
    if (!user) return;

    // Check if profile is already complete
    if (user?.profile?.profileSetupComplete) {
      const next = getUserNextStep(user);
      navigate(next);
      return;
    }

    // Initialize form with existing data if available
    if (user?.profile?.ageRange) {
      setAgeRange(user.profile.ageRange);
    }
    if (user?.profile?.country) {
      setCountry(user.profile.country);
    }
    if (user?.profile?.goals?.length > 0) {
      setSelectedGoals(user.profile.goals);
    }
  }, [user, navigate, getUserNextStep]);

  const toggleGoal = (goalId) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(g => g !== goalId)
        : prev.length < 3 ? [...prev, goalId] : prev
    );
  };

  const handleComplete = async () => {
    await updateUser({
      ageRange,
      country,
      goals: selectedGoals,
      profileSetupComplete: true,
    });
    const next = getUserNextStep(user);
    navigate(next);
  };

  const userName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="bg-background min-h-screen flex flex-col items-center">
      {/* Top Navbar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-sm border-b border-primary/10 flex items-center px-margin-mobile md:px-gutter h-16">
        <div className="flex items-center gap-2 max-w-container-max mx-auto w-full">
          <span className="material-symbols-outlined text-primary !text-[24px]">psychology</span>
          <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary font-bold">
            OCEAN
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center w-full px-margin-mobile pt-24 pb-stack-lg max-w-container-max">
        <div className="w-full max-w-lg flex flex-col gap-stack-md">

          {/* Welcome Header */}
          <div className="text-center mb-stack-sm">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary-container mb-stack-sm">
              <span className="material-symbols-outlined text-on-secondary-container !text-[28px]">waving_hand</span>
            </div>
            <h1 className="font-display-lg-mobile text-display-lg-mobile md:text-[36px] text-on-surface font-bold mb-2">
              Hey, {userName}.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-sm mx-auto">
              {step === 1
                ? 'A few quick things before we begin — helps us calibrate your experience.'
                : 'What are you hoping to discover about yourself?'}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-3 mb-stack-sm">
            <div className={`h-1 rounded-full transition-all duration-500 ${step >= 1 ? 'w-10 bg-primary' : 'w-6 bg-surface-container-highest'}`}></div>
            <div className={`h-1 rounded-full transition-all duration-500 ${step >= 2 ? 'w-10 bg-primary' : 'w-6 bg-surface-container-highest'}`}></div>
          </div>

          {/* Step 1: Age Range + Country */}
          {step === 1 && (
            <Card className="w-full p-gutter md:p-stack-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold text-lg mb-1">
                Age range
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-stack-md">
                Used anonymously to contextualise your results within your demographic.
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {AGE_RANGES.map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setAgeRange(range)}
                    className={`px-4 py-3 rounded-lg font-label-sm text-label-sm transition-all cursor-pointer border text-center
                      ${ageRange === range
                        ? 'bg-primary text-on-primary border-primary font-bold scale-[1.02]'
                        : 'bg-surface-container-low border-outline-variant/40 text-on-surface hover:border-primary/50 hover:bg-surface-container'
                      }`}
                  >
                    {range}
                  </button>
                ))}
              </div>

              <div className="mt-stack-lg">
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold text-lg mb-1">
                  Country
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-stack-md">
                  Helps us provide region-relevant benchmarks.
                </p>

                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-0 px-4 py-3 font-body-md transition-colors outline-none rounded-lg"
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="mt-stack-lg flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => setStep(2)}
                  disabled={!ageRange || !country}
                  icon="arrow_forward"
                >
                  Continue
                </Button>
              </div>
            </Card>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <Card className="w-full p-gutter md:p-stack-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold text-lg mb-1">
                Your goals
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-stack-md">
                Pick up to 3. This won't affect your test — just tailors the experience.
              </p>

              <div className="flex flex-col gap-2">
                {GOALS.map((goal) => {
                  const isSelected = selectedGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => toggleGoal(goal.id)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-lg font-label-sm text-label-sm transition-all cursor-pointer border text-left
                        ${isSelected
                          ? 'bg-primary-fixed border-primary/30 text-on-primary-fixed font-bold'
                          : 'bg-surface-container-low border-outline-variant/40 text-on-surface hover:border-primary/50 hover:bg-surface-container'
                        }`}
                    >
                      <span className={`material-symbols-outlined !text-[20px] transition-colors ${isSelected ? 'text-primary' : 'text-outline'}`}>
                        {goal.icon}
                      </span>
                      <span className="flex-grow">{goal.label}</span>
                      {isSelected && (
                        <span className="material-symbols-outlined !text-[18px] text-primary">check_circle</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-stack-lg flex items-center justify-between">
                <Button
                  variant="secondary"
                  onClick={() => setStep(1)}
                  icon="arrow_back"
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleComplete}
                  disabled={selectedGoals.length === 0}
                  icon="arrow_forward"
                >
                  Continue
                </Button>
              </div>
            </Card>
          )}

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-2 opacity-50 mt-stack-sm">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span className="font-label-sm text-label-sm text-[11px]">
              Your profile data is securely stored and private.
            </span>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ProfileSetup;
