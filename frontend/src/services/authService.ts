import { UserProfile } from '../types';
import { INITIAL_USER_PROFILE } from '../mock/mockData';
import { supabase } from '../lib/supabase';

const AUTH_STORAGE_KEY = 'medverity_user_session';

export interface LoginPayload {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  role: 'General User' | 'Medical Student' | 'Healthcare Professional' | 'Academic Researcher';
  institution?: string;
  specialty?: string;
}

function mapSupabaseUserToProfile(user: any): UserProfile {
  const meta = user.user_metadata || {};
  return {
    id: user.id,
    name: meta.name || user.email?.split('@')[0] || 'Unknown User',
    email: user.email || '',
    role: meta.role || 'General User',
    institution: meta.institution,
    specialty: meta.specialty,
    createdAt: user.created_at,
    avatarUrl: meta.avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300`,
    verifiedBadge: meta.role && meta.role !== 'General User',
    preferences: meta.preferences || {
      mockMode: false,
      emailAlerts: true,
      citationFormat: 'Vancouver',
      strictnessLevel: 'conservative',
    },
  };
}

export const authService = {
  async getCurrentUser(): Promise<UserProfile | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      return null;
    }
    const profile = mapSupabaseUserToProfile(session.user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
    return profile;
  },

  async login(payload: LoginPayload): Promise<UserProfile> {
    if (!payload.password) throw new Error('Password is required');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });
    
    if (error) throw error;
    if (!data.user) throw new Error('No user data returned');
    
    const profile = mapSupabaseUserToProfile(data.user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
    return profile;
  },

  async register(payload: RegisterPayload): Promise<UserProfile> {
    if (!payload.password) throw new Error('Password is required for registration');
    
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          name: payload.name,
          role: payload.role,
          institution: payload.institution,
          specialty: payload.specialty,
        }
      }
    });
    
    if (error) throw error;
    if (!data.user) throw new Error('Registration failed, no user returned');
    
    const profile = mapSupabaseUserToProfile(data.user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
    return profile;
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Logout error:', error);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No active user');
    
    const currentMeta = user.user_metadata || {};
    const newMeta = { ...currentMeta, ...updates };
    
    // We only update user metadata in Supabase since we are not modifying DB tables yet
    const { data, error } = await supabase.auth.updateUser({
      data: newMeta
    });
    
    if (error) throw error;
    if (!data.user) throw new Error('Failed to update user');
    
    const updated = mapSupabaseUserToProfile(data.user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async requestPasswordReset(email: string): Promise<boolean> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return true;
  }
};
