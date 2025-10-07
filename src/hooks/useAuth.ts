import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { login, logout, getCurrentUser, isAuthenticated } from '../services/authService';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isLoggedIn: false,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setAuthState({
          user: currentUser,
          isLoggedIn: true,
          isLoading: false,
        });
      } else {
        setAuthState({
          user: null,
          isLoggedIn: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthState({
        user: null,
        isLoggedIn: false,
        isLoading: false,
      });
    }
  };

  const handleLogin = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const loggedInUser = await login(username, password);
      
      if (loggedInUser) {
        setAuthState({
          user: loggedInUser,
          isLoggedIn: true,
          isLoading: false,
        });
        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: 'Invalid username or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await logout();
      setAuthState({
        user: null,
        isLoggedIn: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const isAdmin = (): boolean => {
    return authState.user?.role === 'admin';
  };

  const isEmployee = (): boolean => {
    return authState.user?.role === 'employee';
  };

  const hasPermission = (requiredRole: 'admin' | 'employee'): boolean => {
    if (!authState.user) return false;
    if (requiredRole === 'admin') return authState.user.role === 'admin';
    return true; // Both admin and employee can access employee-level features
  };

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    isLoggedIn: authState.isLoggedIn,
    login: handleLogin,
    logout: handleLogout,
    isAdmin,
    isEmployee,
    hasPermission,
    checkAuthStatus,
  };
};
