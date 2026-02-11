import { create } from 'zustand';
import { supabase } from '@/config/supabase';
import { authService } from '@/services/auth.service';
import { profilesService } from '@/services/profiles.service';
import type { Profile } from '@/types';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loadProfile: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      const session = await authService.getSession();
      if (session?.user) {
        const profile = await profilesService.getProfile(session.user.id);
        set({ user: session.user, session, profile, initialized: true });
      } else {
        set({ initialized: true });
      }
    } catch {
      set({ initialized: true });
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await profilesService.getProfile(session.user.id);
        set({ user: session.user, session, profile });
      } else {
        set({ user: null, session: null, profile: null });
      }
    });
  },

  signUp: async (email: string, password: string, fullName: string) => {
    set({ loading: true });
    try {
      await authService.signUp(email, password, fullName);
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const data = await authService.signIn(email, password);
      if (data.user) {
        const profile = await profilesService.getProfile(data.user.id);
        set({ user: data.user, session: data.session, profile });
      }
    } finally {
      set({ loading: false });
    }
  },

  signInWithGoogle: async () => {
    await authService.signInWithGoogle();
  },

  signOut: async () => {
    await authService.signOut();
    set({ user: null, session: null, profile: null });
  },

  loadProfile: async () => {
    const { user } = get();
    if (user) {
      const profile = await profilesService.getProfile(user.id);
      set({ profile });
    }
  },
}));
