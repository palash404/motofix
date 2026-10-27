/**
 * MotoFix – Auth Context
 * Provides real server-managed session authentication state across the app.
 * Authentication is persisted via HTTP session cookies (MOTOFIX_SESSION)
 * with credentials: 'include'.
 * No passwords or session IDs are stored in localStorage.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current authenticated session with the backend on mount
  useEffect(() => {
    let isMounted = true;
    authApi.getProfile()
      .then((profile) => {
        if (isMounted) setUser(profile);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Log in with email (or username) and password against the backend.
   * Returns { ok: true, user } or { ok: false, status, message, errors }.
   */
  async function login(email, password) {
    try {
      const userData = await authApi.login(email, password);
      setUser(userData);
      return { ok: true, user: userData };
    } catch (err) {
      return {
        ok: false,
        status: err.status || 500,
        message: err.message || 'Login failed. Please check your credentials.',
        errors: err.errors || null,
      };
    }
  }

  /**
   * Register a new user account with name, email, and password.
   * Returns { ok: true, user } or { ok: false, status, message, errors }.
   */
  async function registerAccount({ name, email, password }) {
    try {
      const createdUser = await authApi.register({ name, email, password });
      return { ok: true, user: createdUser };
    } catch (err) {
      return {
        ok: false,
        status: err.status || 500,
        message: err.message || 'Registration failed.',
        errors: err.errors || null,
      };
    }
  }

  /**
   * Invalidate server session and clear user state.
   */
  async function logout() {
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
    }
  }

  function updateUser(partial) {
    setUser((prev) => (prev ? { ...prev, ...partial } : null));
  }

  const isAuthenticated = Boolean(user && (user.id || user.email));

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        registerAccount,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
