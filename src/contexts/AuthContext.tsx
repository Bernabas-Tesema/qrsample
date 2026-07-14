import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';
import { DEMO_ADMIN, setDemoAdminSession, isDemoAdminSession } from '@/data/demo-store';
import { isDemoMode } from '@/data/sobana-menu';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isDemoSession: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoSession, setIsDemoSession] = useState(false);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile(data as Profile);
    }
  }, []);

  useEffect(() => {
    if (isDemoAdminSession()) {
      setIsDemoSession(true);
      setUser({ id: DEMO_ADMIN.profile.id, email: DEMO_ADMIN.email } as User);
      setProfile(DEMO_ADMIN.profile);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchProfile(s.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, s) => {
      if (isDemoAdminSession()) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        await fetchProfile(s.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    const isDemoLogin =
      email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password;

    if (isDemoLogin) {
      setDemoAdminSession(true);
      setIsDemoSession(true);
      setUser({ id: DEMO_ADMIN.profile.id, email: DEMO_ADMIN.email } as User);
      setProfile(DEMO_ADMIN.profile);
      setSession(null);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (isDemoMode()) {
        throw new Error(
          `Login failed. For demo use ${DEMO_ADMIN.email} / ${DEMO_ADMIN.password}`
        );
      }
      throw error;
    }
    setDemoAdminSession(false);
    setIsDemoSession(false);
  };

  const signOut = async () => {
    setDemoAdminSession(false);
    setIsDemoSession(false);
    setProfile(null);
    setUser(null);
    setSession(null);
    try {
      await supabase.auth.signOut();
    } catch {
      /* ignore when demo-only */
    }
  };

  const isAdmin = profile?.role === 'admin' || profile?.role === 'staff';

  return (
    <AuthContext.Provider
      value={{ user, session, profile, loading, signIn, signOut, isAdmin, isDemoSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
