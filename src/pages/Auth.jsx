import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

const Auth = () => {
  const navigate = useNavigate();
  const { signup, login } = useAuth();

  const [activeTab, setActiveTab] = useState('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (activeTab === 'signup') {
        if (!name.trim()) {
          setError('Please enter your name.');
          setIsSubmitting(false);
          return;
        }
        signup(name.trim(), email.trim(), password);
      } else {
        login(email.trim(), password);
      }
      // Navigate to profile setup on success
      navigate('/profile-setup');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center">
      {/* Top Navbar Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-sm border-b border-primary/10 flex items-center justify-between px-margin-mobile md:px-gutter h-16">
        <div className="flex items-center gap-2 max-w-container-max mx-auto w-full">
          <span className="material-symbols-outlined text-primary !text-[24px]">psychology</span>
          <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary font-bold">
            OCEAN
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center w-full px-margin-mobile pt-24 pb-stack-lg max-w-container-max">
        <Card className="w-full max-w-md p-gutter md:p-stack-lg">
          
          {/* Header Tabs */}
          <div className="mb-stack-lg">
            <div className="flex gap-stack-md mb-stack-sm border-b border-outline-variant/30">
              <button 
                type="button"
                onClick={() => { setActiveTab('signup'); setError(''); }}
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
                onClick={() => { setActiveTab('login'); setError(''); }}
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
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-stack-md px-4 py-3 bg-error-container/60 border border-error/20 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-error !text-[18px]">error</span>
              <span className="font-label-sm text-label-sm text-on-error-container">{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-stack-md flex flex-col gap-4" onSubmit={handleSubmit}>
            {activeTab === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="block font-label-sm text-label-sm text-on-surface-variant text-[13px] font-semibold" htmlFor="auth-name">
                  Name
                </label>
                <input 
                  type="text" 
                  id="auth-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-0 px-4 py-3 font-body-md transition-colors outline-none rounded-lg"
                  required
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="block font-label-sm text-label-sm text-on-surface-variant text-[13px] font-semibold" htmlFor="auth-email">
                Email
              </label>
              <input 
                type="email" 
                id="auth-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-0 px-4 py-3 font-body-md transition-colors outline-none rounded-lg"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="block font-label-sm text-label-sm text-on-surface-variant text-[13px] font-semibold" htmlFor="auth-password">
                  Password
                </label>
                {activeTab === 'login' && (
                  <button type="button" className="font-label-sm text-label-sm text-primary hover:underline transition-all text-[13px] cursor-pointer">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="auth-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-0 px-4 py-3 font-body-md transition-colors outline-none rounded-lg pr-10"
                  required
                  minLength={6}
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
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? 'Please wait...' 
                  : (activeTab === 'signup' ? 'Create Account' : 'Sign In')
                }
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

          {/* Decorative Ambient Image */}
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
          © 2026 OCEAN INSIGHTS • EMPATHETIC RIGOR
        </p>
      </footer>
    </div>
  );
};

export default Auth;
