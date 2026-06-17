import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthView() {
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  // Add effect to handle existing token on load
  useEffect(() => {
    const token = localStorage.getItem('ocean_token');
    if (token) {
      (async () => {
        try {
          // 1. Check profile
          const profileRes = await fetch('/api/v1/users/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          let hasProfile = false;
          if (profileRes.ok) {
            try {
              const profileData = await profileRes.json();
              hasProfile = !!profileData?.profile;
            } catch { /* empty body */ }
          }

          // 2. Check in-progress test
          const inProgressRes = await fetch('/api/v1/tests/in-progress', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          let inProgressData = null;
          if (inProgressRes.ok) {
            try {
              inProgressData = await inProgressRes.json();
            } catch { /* empty body */ }
          }

          // 3. Check completed test
          const completedRes = await fetch('/api/v1/tests/completed', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          let hasCompleted = false;
          if (completedRes.ok) {
            try {
              const completedData = await completedRes.json();
              hasCompleted = !!completedData;
            } catch { /* empty body */ }
          }

          if (hasCompleted) {
            navigate('/dashboard');
          } else if (inProgressData) {
            navigate('/test-resume');
          } else if (hasProfile) {
            navigate('/test-intro');
          } else {
            navigate('/profile/setup');
          }
        } catch (e) {
          console.error('Auto-redirect failed:', e);
          // Token may be invalid — stay on auth page
        }
      })();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (activeTab === 'signup') {
        await signup(name, email, password);
      } else {
        await login(email, password);
      }

      const token = localStorage.getItem('ocean_token');

      // 1. Check profile
      const profileRes = await fetch('/api/v1/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      let hasProfile = false;
      if (profileRes.ok) {
        try {
          const profileData = await profileRes.json();
          hasProfile = !!profileData?.profile;
        } catch { /* empty body */ }
      }

      // 2. Check in-progress test
      const inProgressRes = await fetch('/api/v1/tests/in-progress', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      let inProgressData = null;
      if (inProgressRes.ok) {
        try {
          inProgressData = await inProgressRes.json();
        } catch { /* empty body */ }
      }

      // 3. Check completed test
      const completedRes = await fetch('/api/v1/tests/completed', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      let hasCompleted = false;
      if (completedRes.ok) {
        try {
          const completedData = await completedRes.json();
          hasCompleted = !!completedData;
        } catch { /* empty body */ }
      }

      if (hasCompleted) {
        navigate('/dashboard');
      } else if (inProgressData) {
        navigate('/test-resume');
      } else if (hasProfile) {
        navigate('/test-intro');
      } else {
        navigate('/profile/setup');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center">
      {/* Top Navbar Header */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-primary/10 flex items-center justify-between px-margin-mobile md:px-gutter h-16">
        <div className="flex items-center gap-2 max-w-container-max mx-auto w-full">
          <span className="material-symbols-outlined text-primary !text-[24px]">psychology</span>
          <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary font-bold">
            OCEAN
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center w-full px-margin-mobile pt-24 pb-stack-lg max-w-container-max">
        <Card className="w-full max-w-md p-gutter md:p-stack-lg fade-in">
          
          {/* Header Tabs */}
          <div className="mb-stack-lg">
            <div className="flex gap-stack-md mb-stack-sm border-b border-outline-variant/30">
              <button 
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`pb-stack-sm font-label-sm text-label-sm transition-all pb-2 cursor-pointer ${
                  activeTab === 'signup' 
                    ? 'border-b-2 border-primary text-primary font-bold' 
                    : 'text-outline hover:text-primary'
                }`}
              >
                Sign Up
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('login')}
                className={`pb-stack-sm font-label-sm text-label-sm transition-all pb-2 cursor-pointer ${
                  activeTab === 'login' 
                    ? 'border-b-2 border-primary text-primary font-bold' 
                    : 'text-outline hover:text-primary'
                }`}
              >
                Log In
              </button>
            </div>
            
            <h1 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold text-2xl">
              {activeTab === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant text-[15px]">
              {activeTab === 'signup' 
                ? 'Start your journey of self-discovery.' 
                : 'Continue exploring your psychological profile.'}
            </p>
            {error && (
              <div className="mt-2 text-sm text-error">{error}</div>
            )}
          </div>

          {/* Form */}
          <form className="space-y-stack-md flex flex-col gap-4" onSubmit={handleSubmit}>
            {activeTab === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="block font-label-sm text-label-sm text-on-surface-variant text-[13px] font-semibold" htmlFor="name">
                  Name
                </label>
                <input 
                  type="text" 
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-0 px-4 py-3 font-body-md transition-colors outline-none rounded-lg"
                  required
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="block font-label-sm text-label-sm text-on-surface-variant text-[13px] font-semibold" htmlFor="email">
                Email
              </label>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-0 px-4 py-3 font-body-md transition-colors outline-none rounded-lg"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="block font-label-sm text-label-sm text-on-surface-variant text-[13px] font-semibold" htmlFor="password">
                  Password
                </label>
                {activeTab === 'login' && (
                  <a href="#" className="font-label-sm text-label-sm text-primary hover:underline transition-all text-[13px]">
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-0 px-4 py-3 font-body-md transition-colors outline-none rounded-lg pr-10"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-stack-sm mt-2">
              <Button 
                type="submit" 
                variant="primary"
                className="w-full"
              >
                {activeTab === 'signup' ? 'Create Account' : 'Sign In'}
              </Button>
            </div>
          </form>

          {/* Privacy Footnote */}
          <div className="mt-stack-lg pt-stack-md border-t border-outline-variant/20 mt-6">
            <div className="flex items-center justify-center gap-stack-sm opacity-60 text-xs">
              <span className="material-symbols-outlined text-[18px]">shield</span>
              <span className="font-label-sm text-label-sm ml-1.5">Privacy first. Your data is encrypted.</span>
            </div>
          </div>

          {/* Asymmetrical Artistic Detail */}
          <div className="mt-stack-md relative h-32 overflow-hidden mt-6 rounded-lg">
            <img 
              alt="Abstract organic forms" 
              className="w-full h-full object-cover opacity-20 grayscale sepia brightness-110" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8gvAgE7qS1fsXuYiMYu2ZVzDnCseCJ5LgzAt3TBg2ecvymL54pupeYrYMHSMp7DThEYep0T9wIPSUasGb6ySMFQCcW06CINM5jCkgX3aw3N1VxxrDhAY8Qz_jf4Tk_X9mS8t_7-Xg9hL5QwD39dDBewUcmbin82zI1ZbHvT0Tzen5SgVrFD0O3tVyT50mubKdUVkx3v-DGLpnBKWtC4tvVIBt8FmisPcT2Vk_WWnr0jio5LRWwY2QnWfZIfkS9T0Rpxpi5HHPvJA"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
          </div>

        </Card>
      </main>

      {/* Footer copyright */}
      <footer className="w-full py-stack-md px-margin-mobile flex flex-col items-center gap-unit border-t border-primary/5">
        <p className="font-label-sm text-label-sm text-on-surface-variant/50 text-xs">
          © 2024 OCEAN INSIGHTS • EMPATHETIC RIGOR
        </p>
      </footer>
    </div>
  );
}
