import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { authService, LoginPayload, RegisterPayload } from '../services/authService';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { addToast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (mounted) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Error loading session:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // The subscription setup could also go here using supabase client
    // but authService already syncs the user. For a more robust app we'd 
    // listen to supabase.auth.onAuthStateChange, but we'll rely on the 
    // initial fetch and explicit login/logout calls to keep things simple for now.

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.login(payload);
      setUser(loggedUser);
      addToast({
        type: 'success',
        title: 'Authentication Successful',
        message: `Welcome back, ${loggedUser.name}! Clinical access active.`,
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Invalid credentials';
      addToast({
        type: 'error',
        title: 'Login Failed',
        message: msg,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const newUser = await authService.register(payload);
      setUser(newUser);
      addToast({
        type: 'success',
        title: 'Account Created',
        message: `Welcome to MEDVERITY, ${newUser.name}. Evidence platform unlocked.`,
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Registration failed';
      addToast({
        type: 'error',
        title: 'Registration Error',
        message: msg,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have safely logged out of MEDVERITY.',
    });
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updated = await authService.updateProfile(updates);
      setUser(updated);
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your preferences and clinical credentials were saved.',
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to update profile';
      addToast({
        type: 'error',
        title: 'Update Error',
        message: msg,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
