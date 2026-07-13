import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

const AuthPage = () => {
  const navigate = useNavigate();
  const { signup, login, updateUser, getUserNextStep } = useAuth();

  const [mode, setMode] = useState('login');
  const [step, setStep] = useState('A');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setShowPassword(false);
    setError('');
    setIsSubmitting(false);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setStep('A');
    resetForm();
  };

  const validate = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
      
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSignupPanelA = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setError('');
    setIsSubmitting(true);
    try {
      await signup(email.trim(), password);
      setStep('B');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupPanelB = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) {
      setError('Please choose a username.');
      return;
    }
    if (username.trim().length < 3 || username.trim().length > 20) {
      setError('Username must be between 3 and 20 characters long.');
      return;
    }
    setIsSubmitting(true);
    try {
      const updatedUser = await updateUser({ username: username.trim() });
      const redirect = localStorage.getItem('ocean_redirect');
      if (redirect) {
        localStorage.removeItem('ocean_redirect');
        navigate(redirect);
      } else {
        const next = getUserNextStep(updatedUser);
        navigate(next);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setError('');
    setIsSubmitting(true);
    try {
      const loggedInUser = await login(email.trim(), password);
      const redirect = localStorage.getItem('ocean_redirect');
      if (redirect) {
        localStorage.removeItem('ocean_redirect');
        navigate(redirect);
      } else {
        const next = getUserNextStep(loggedInUser);
        navigate(next);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const backToPanelA = () => {
    setStep('A');
    setError('');
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-sm border-b border-primary/10 flex items-center justify-between px-margin-mobile md:px-gutter h-16">
        <div className="flex items-center gap-2 max-w-container-max mx-auto w-full">
          <span className="material-symbols-outlined text-primary !text-[24px]">psychology</span>
          <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary font-bold">
            OCEAN
          </span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center w-full px-margin-mobile pt-24 pb-stack-lg max-w-container-max">
        <Card className="w-full max-w-md p-gutter md:p-stack-lg">

          <div className="mb-stack-lg">
            <div className="flex justify-center gap-stack-md mb-stack-sm border-b border-outline-variant/30">
            <button
                type="button"
                onClick={() => handleModeChange('login')}
                className={`pb-stack-sm font-label-sm text-label-sm transition-all pb-2 cursor-pointer ${
                  mode === 'login'
                    ? 'border-b-2 border-primary text-primary font-bold'
                    : 'text-outline hover:text-primary'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('signup')}
                className={`pb-stack-sm font-label-sm text-label-sm transition-all pb-2 cursor-pointer ${
                  mode === 'signup'
                    ? 'border-b-2 border-primary text-primary font-bold'
                    : 'text-outline hover:text-primary'
                }`}
              >
                Sign Up
              </button>
              
            </div>
          </div>

          {error && (
            <div className="mb-stack-md px-4 py-3 bg-error-container/60 border border-error/20 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-error !text-[18px]">error</span>
              <span className="font-label-sm text-label-sm text-on-error-container">{error}</span>
            </div>
          )}

          <div className="relative min-h-[420px]">

            <div className={`absolute inset-0 transition-all duration-500 ease-out ${mode === 'signup' && step === 'A' ? 'translate-x-0 opacity-100' : mode === 'signup' ? '-translate-x-full opacity-0 pointer-events-none' : 'translate-x-full opacity-0 pointer-events-none'}`}>
              <div>
                <h1 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold text-2xl">
                  Create Account
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant text-[15px] mb-6">
                  Start your journey of self-discovery.
                </p>

                <form className="space-y-stack-md flex flex-col gap-4" onSubmit={handleSignupPanelA}>
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
                      <button type="button" className="font-label-sm text-label-sm text-primary hover:underline transition-all text-[13px] cursor-pointer">
                        Forgot Password?
                      </button>
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
                      {isSubmitting ? 'Please wait...' : 'Continue'}
                    </Button>
                  </div>
                </form>

                <div className="mt-6">
                  <button
                    type="button"
                    disabled
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-outline-variant/50 text-on-surface-variant/70 bg-surface-container-low cursor-not-allowed font-label-sm text-label-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Continue with Google
                  </button>
                </div>
              </div>
            </div>

            <div className={`absolute inset-0 transition-all duration-500 ease-out ${mode === 'signup' && step === 'B' ? 'translate-x-0 opacity-100' : mode === 'signup' ? 'translate-x-full opacity-0 pointer-events-none' : 'translate-x-full opacity-0 pointer-events-none'}`}>
              <div>
                <h1 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold text-2xl">
                  Final step
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant text-[15px] mb-6">
                  What should we call you?
                </p>

                <form className="space-y-stack-md flex flex-col gap-4" onSubmit={handleSignupPanelB}>
                  <div className="flex flex-col gap-1.5">
                    <label className="block font-label-sm text-label-sm text-on-surface-variant text-[13px] font-semibold" htmlFor="auth-username">
                      Username
                    </label>
                    <input
                      type="text"
                      id="auth-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="your_username"
                      className="w-full bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-0 px-4 py-3 font-body-md transition-colors outline-none rounded-lg"
                      required
                      minLength={3}
                      maxLength={20}
                    />
                  </div>

                  <div className="pt-stack-sm mt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Please wait...' : 'Complete Signup'}
                    </Button>
                  </div>
                </form>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={backToPanelA}
                    className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined !text-[18px]">arrow_back</span>
                    Back
                  </button>
                </div>
              </div>
            </div>

            <div className={`absolute inset-0 transition-all duration-500 ease-out ${mode === 'login' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
              <div>
                <h1 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold text-2xl">
                  Welcome Back
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant text-[15px] mb-6">
                  Continue exploring your psychological profile.
                </p>

                <form className="space-y-stack-md flex flex-col gap-4" onSubmit={handleLogin}>
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
                      <button type="button" className="font-label-sm text-label-sm text-primary hover:underline transition-all text-[13px] cursor-pointer">
                        Forgot Password?
                      </button>
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
                      {isSubmitting ? 'Please wait...' : 'Sign In'}
                    </Button>
                  </div>
                </form>

                <div className="mt-6">
                  <button
                    type="button"
                    disabled
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-outline-variant/50 text-on-surface-variant/70 bg-surface-container-low cursor-not-allowed font-label-sm text-label-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Continue with Google
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-stack-lg pt-stack-md border-t border-outline-variant/20 mt-6">
            <div className="flex items-center justify-center gap-stack-sm opacity-60 text-xs">
              <span className="material-symbols-outlined text-[18px]">shield</span>
              <span className="font-label-sm text-label-sm ml-1.5">Privacy first. Your data is encrypted.</span>
            </div>
          </div>

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

      <footer className="w-full py-stack-md px-margin-mobile flex flex-col items-center gap-unit border-t border-primary/5">
        <p className="font-label-sm text-label-sm text-on-surface-variant/50 text-xs">
          © 2026 OCEAN INSIGHTS • EMPATHETIC RIGOR
        </p>
      </footer>
    </div>
  );
};

export default AuthPage;
