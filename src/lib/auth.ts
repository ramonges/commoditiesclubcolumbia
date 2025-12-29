// Simple authentication service
// In production, use Supabase Auth

import { TEAM_CREDENTIALS } from './supabase';

export interface User {
  email: string;
  name: string;
}

const AUTH_KEY = 'ccc_auth_token';

export const authService = {
  login: (email: string, password: string): { success: boolean; user?: User; error?: string } => {
    const credentials = TEAM_CREDENTIALS[email as keyof typeof TEAM_CREDENTIALS];
    
    if (!credentials || credentials.password !== password) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    const user = { email, name: credentials.name };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return { success: true, user };
  },
  
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },
  
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },
  
  isAuthenticated: (): boolean => {
    return authService.getCurrentUser() !== null;
  }
};

