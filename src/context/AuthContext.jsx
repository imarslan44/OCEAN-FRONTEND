import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserNextStep = useCallback((u) => {
    if (u?.profile?.personalityResult) return '/home';
    if (!u?.profile?.profileSetupComplete) return '/profile/setup';
    if (!u?.profile?.onboardingComplete) return '/onboarding/1';
    return '/test-intro';
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
            const freshUser = await response.json();
            const userWithToken = { ...freshUser, token: storedToken };
            setUser(userWithToken);
            localStorage.setItem('ocean_user', JSON.stringify(userWithToken));
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
  }, []);

  const signup = async (email, password) => {
    const response = await fetch('/api/v1/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signup failed');
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
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      const userWithToken = { ...data.user, token };

      localStorage.setItem('ocean_user', JSON.stringify(userWithToken));
      setUser(userWithToken);
    } catch (error) {
      console.error('Error updating user profile on backend, syncing locally:', error);
      // Fallback local update to keep UI operational
      const updatedUser = { ...user, ...updatedFields };
      setUser(updatedUser);
      localStorage.setItem('ocean_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateUser, getUserNextStep }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
