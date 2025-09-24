import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  getDjangoProfile: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          try {
            // Sync Supabase auth with Django backend
            await authService.syncAuthWithDjango(session);
            
            toast({
              title: "Welcome back!",
              description: "You have been successfully signed in.",
            });
          } catch (error) {
            console.error('Error syncing auth with Django:', error);
            toast({
              variant: "destructive",
              title: "Authentication error",
              description: "There was a problem with your authentication. Please try again.",
            });
          }
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session) {
        try {
          // Sync existing Supabase session with Django
          await authService.syncAuthWithDjango(session);
        } catch (error) {
          console.error('Error syncing existing session with Django:', error);
        }
      }
      
      setLoading(false);
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      // First authenticate with Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message,
        });
        return { error };
      }
      
      // Then authenticate with Django backend
      try {
        // Convert email/password to username/password for Django
        const djangoCredentials = {
          username: email, // Django expects username
          password: password,
        };
        
        await authService.login(djangoCredentials);
      } catch (djangoError) {
        console.error('Django authentication failed:', djangoError);
        // If Django auth fails but Supabase worked, we can still proceed
        // but log an error for debugging
        toast({
          variant: "default",
          title: "Partial authentication",
          description: "You're signed in, but some services may be unavailable.",
        });
      }

      return { error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || "An unknown error occurred",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      // First register with Supabase
      const currentOrigin = window.location.origin;
      console.log(`Current origin: ${currentOrigin}`);
      console.log(`Redirecting to: ${currentOrigin}/auth/callback`);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${currentOrigin}/auth/callback`,
          data: metadata
        }
      });

      if (error) {
        console.error("Supabase signup error:", error);
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message,
        });
        return { error };
      }

      console.log("Supabase signup successful:", data);

      // Then register with Django backend
      try {
        // Django requires more fields than Supabase
        const djangoUserData = {
          username: email, // Use email as username
          email: email,
          first_name: metadata?.first_name || '',
          last_name: metadata?.last_name || '',
          password: password,
          password_confirm: password,
          company_name: metadata?.business_name || '',
        };
        
        const djangoResponse = await authService.register(djangoUserData);
        console.log("Django registration successful:", djangoResponse);
      } catch (djangoError) {
        console.error('Django registration failed:', djangoError);
        // If Django registration fails but Supabase worked, we can still proceed
        // but log an error for debugging
        toast({
          variant: "default",
          title: "Partial registration",
          description: "Your account was created, but some services may be unavailable.",
        });
      }

      toast({
        title: "Account created",
        description: "Your account has been successfully created. Please check your email for confirmation.",
      });

      return { error: null };
    } catch (error) {
      console.error("Signup process error:", error);
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "An unknown error occurred",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Sign out from Django backend
      try {
        await authService.logout();
      } catch (djangoError) {
        console.error('Django logout failed:', djangoError);
      }
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message || "An unknown error occurred",
      });
    }
  };
  
  const getDjangoProfile = async () => {
    try {
      return await authService.getProfile();
    } catch (error) {
      console.error('Error fetching Django profile:', error);
      return null;
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    getDjangoProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};