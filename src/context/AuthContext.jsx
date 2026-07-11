import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const PROFILE_FIELDS = new Set([
  'bio',
  'avatar',
  'interests',
  'location',
  'ageRange',
  'goals',
  'isPublic',
  'country',
  'onboardingComplete',
  'profileSetupComplete',
  'testSkipped'
]);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasCompletedTest = useCallback((u) => Boolean(u?.profile?.personalityResult), []);
  const hasCompletedProfileSetup = useCallback((u) => Boolean(u?.profile?.profileSetupComplete), []);
  const hasCompletedOnboarding = useCallback((u) => Boolean(u?.profile?.onboardingComplete), []);
  const hasSkippedTest = useCallback((u) => Boolean(u?.profile?.testSkipped), []);

  const getUserNextStep = useCallback((u) => {
    if (!u) return '/get-started';
    if (hasCompletedTest(u)) return '/home';
    if (!hasCompletedProfileSetup(u)) return '/profile/setup';
    if (!hasCompletedOnboarding(u)) return '/onboarding/1';
    if (hasSkippedTest(u)) return '/home';
    return '/test-intro';
  }, [hasCompletedOnboarding, hasCompletedProfileSetup, hasCompletedTest, hasSkippedTest]);

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem('ocean_token');
    if (!storedToken) return null;

    const response = await fetch('/api/v1/users/profile', {
      headers: { 'Authorization': `Bearer ${storedToken}` }
    });

    if (!response.ok) {
      localStorage.removeItem('ocean_token');
      localStorage.removeItem('ocean_user');
      setUser(null);
      return null;
    }

    const freshUser = await response.json();
    const userWithToken = { ...freshUser, token: storedToken };
    setUser(userWithToken);
    localStorage.setItem('ocean_user', JSON.stringify(userWithToken));
    return userWithToken;
  }, []);

  // Sync session with backend on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('ocean_token');
      const storedUser = localStorage.getItem('ocean_user');

      if (storedToken) {
        try {
          const response = await fetch('/api/v1/users/profile', {
            headers: { 'Authorization': `Bearer ${storedToken}` }
          });
          if (response.ok) {
            await refreshUser();
          } else {
            // Token expired or invalid
            localStorage.removeItem('ocean_token');
            localStorage.removeItem('ocean_user');
            setUser(null);
          }
        } catch (e) {
          console.error('Failed to sync auth session with backend, falling back to cache', e);
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (err) {
              console.error('Error parsing stored user', err);
            }
          }
        }
      } else if (storedUser) {
        // Fallback for legacy setups
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error('Error parsing stored user', err);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [refreshUser]);

  const signup = async (email, password) => {
    const response = await fetch('/api/v1/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      let errorMessage = 'Signup failed';
      try {
        const errorData = await response.json();
        if (errorData.message) errorMessage = errorData.message;
      } catch (err) {
        errorMessage = 'Oops Something went wrong! Pleas try again later.';
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const userWithToken = { ...data.newUser, token: data.token };

    localStorage.setItem('ocean_token', data.token);
    localStorage.setItem('ocean_user', JSON.stringify(userWithToken));
    setUser(userWithToken);
    return userWithToken;
  };

  const login = async (email, password) => {
    const response = await fetch('/api/v1/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const errorData = await response.json();
        if (errorData.message) errorMessage = errorData.message;
      } catch (err) {
        errorMessage = 'Internal server error or oops something went wrong!';
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    let fullUser = data.user;

    try {
      const profileResponse = await fetch('/api/v1/users/profile', {
        headers: { 'Authorization': `Bearer ${data.token}` }
      });
      if (profileResponse.ok) {
        fullUser = await profileResponse.json();
      }
    } catch (e) {
      console.error('Error syncing full profile after login', e);
    }

    const userWithToken = { ...fullUser, token: data.token };
    localStorage.setItem('ocean_token', data.token);
    localStorage.setItem('ocean_user', JSON.stringify(userWithToken));
    setUser(userWithToken);
    return userWithToken;
  };

  const logout = async () => {
    try {
      await fetch('/api/v1/users/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout request failed', e);
    }
    localStorage.removeItem('ocean_token');
    localStorage.removeItem('ocean_user');
    setUser(null);
  };

  const updateUser = async (updatedFields) => {
    if (!user) return;
    try {
      const token = user.token || localStorage.getItem('ocean_token');
      const response = await fetch('/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedFields)
      });

      if (!response.ok) {
        let errorMessage = 'Failed to update profile';
        try {
          const errorData = await response.json();
          if (errorData.message) errorMessage = errorData.message;
        } catch (err) {
          errorMessage = 'Oops! Something went wrong.';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const userWithToken = { ...data.user, token };

      localStorage.setItem('ocean_user', JSON.stringify(userWithToken));
      setUser(userWithToken);
      return userWithToken;
    } catch (error) {
      console.error('Error updating user profile on backend, syncing locally:', error);
      // Fallback local update to keep UI operational
      const profileUpdates = {};
      const userUpdates = {};

      Object.entries(updatedFields).forEach(([key, value]) => {
        if (PROFILE_FIELDS.has(key)) {
          profileUpdates[key] = value;
        } else {
          userUpdates[key] = value;
        }
      });

      const updatedUser = {
        ...user,
        ...userUpdates,
        profile: {
          ...(user.profile || {}),
          ...profileUpdates
        }
      };
      setUser(updatedUser);
      localStorage.setItem('ocean_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signup,
      login,
      logout,
      updateUser,
      getUserNextStep,
      hasCompletedTest,
      hasCompletedProfileSetup,
      hasCompletedOnboarding,
      hasSkippedTest,
      refreshUser
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
