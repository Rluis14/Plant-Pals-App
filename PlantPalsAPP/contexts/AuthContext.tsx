import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check active session on mount
    const getSession = async () => {
      try {
        console.log('Checking for existing session...');
        const session = await authService.getCurrentSession();
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          console.log('Initial session check:', session?.user?.email || 'no user');
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email || 'no user');
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Only set loading to false after we've processed the auth change
        if (event !== 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      console.log('AuthContext: Starting signup for', email);
      const data = await authService.signUp(email, password, fullName);
      console.log('AuthContext: Signup successful');
      return data;
    } catch (error) {
      console.error('Sign up error in context:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('AuthContext: Starting signin for', email);
      const data = await authService.signIn(email, password);
      console.log('AuthContext: Signin successful');
      return data;
    } catch (error) {
      console.error('Sign in error in context:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('AuthContext: Starting signout');
      await authService.signOut();
      console.log('AuthContext: Signout successful');
    } catch (error) {
      console.error('Sign out error in context:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};