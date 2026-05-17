/**
 * Authentication context provider.
 *
 * Provides:
 * - user state (id, username, isStaff)
 * - login(username, password) → JWT auth + decode custom claims
 * - register(data) → create new user account
 * - logout() → clear tokens and state
 * - loading → true while restoring session from localStorage
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user session from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage — clearing stale data');
        localStorage.removeItem('user');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Log in with username and password.
   * Stores JWT tokens and decoded user info in localStorage.
   */
  const login = async (username, password) => {
    let baseURL = process.env.REACT_APP_API_URL || 'https://helpdesk-backend-production-edb5.up.railway.app';
    baseURL = baseURL.replace(/\/+$/, '');

    const response = await axios.post(`${baseURL}/api/token/`, {
      username,
      password,
    });

    const { access, refresh } = response.data;

    // Decode JWT payload to extract custom claims (username, is_staff)
    const payloadBase64 = access.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));

    const userData = {
      id: payload.user_id,
      username: payload.username,
      isStaff: payload.is_staff,
    };

    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  /**
   * Register a new user account.
   * Does NOT auto-login — the user must log in after registration.
   */
  const register = async (data) => {
    let baseURL = process.env.REACT_APP_API_URL || 'https://helpdesk-backend-production-edb5.up.railway.app';
    baseURL = baseURL.replace(/\/+$/, '');

    const response = await axios.post(`${baseURL}/api/register/`, data);
    return response.data;
  };

  /**
   * Log out — clear all auth state.
   */
  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access the auth context.
 * Must be used within an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
