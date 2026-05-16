/**
 * Axios instance with JWT authentication interceptors.
 *
 * Features:
 * - Automatic Bearer token injection on every request
 * - Automatic token refresh on 401 responses
 * - Redirect to /login when refresh fails
 *
 * Token storage keys (localStorage):
 * - 'access'  — JWT access token
 * - 'refresh' — JWT refresh token
 * - 'user'    — Serialized user object
 */

import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// ── Request Interceptor ─────────────────────────────────────────
// Attach the JWT access token to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ────────────────────────────────────────
// On 401, attempt to refresh the token once. If refresh also fails,
// clear all auth state and redirect to login.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the refresh endpoint itself returned 401, bail out to avoid infinite loop
    if (
      error.response?.status === 401 &&
      originalRequest.url?.includes('/api/token/refresh/')
    ) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // First 401 on a normal request → try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh');
        if (!refresh) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${baseURL}/api/token/refresh/`, {
          refresh,
        });

        const { access } = response.data;
        localStorage.setItem('access', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear everything and redirect
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
