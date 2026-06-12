import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user session from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('ocean_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
    setLoading(false);
  }, []);

  const signup = (name, email, password) => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('ocean_users') || '[]');
    const existing = users.find(u => u.email === email);
    if (existing) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      password, // in a real app, this is hashed on backend
      profileSetupComplete: false,
      testComplete: false,
      testResults: null,
      savedState: null,
      driftHistory: []
    };

    users.push(newUser);
    localStorage.setItem('ocean_users', JSON.stringify(users));
    localStorage.setItem('ocean_user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('ocean_users') || '[]');
    const matched = users.find(u => u.email === email && u.password === password);
    if (!matched) {
      throw new Error('Invalid email or password');
    }
    localStorage.setItem('ocean_user', JSON.stringify(matched));
    setUser(matched);
    return matched;
  };

  const logout = () => {
    localStorage.removeItem('ocean_user');
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    if (!user) return;
    const users = JSON.parse(localStorage.getItem('ocean_users') || '[]');
    const updatedUser = { ...user, ...updatedFields };
    
    // Update active session
    localStorage.setItem('ocean_user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Update in users registry
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    localStorage.setItem('ocean_users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
