import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        
        // Set loading timeout to prevent infinite loading
        const loadingTimeout = setTimeout(() => {
          console.log('⏰ Auth initialization timeout - continuing without session');
          setLoading(false);
        }, 8000);
        
        try {
          // Test basic connectivity first
          const connectivityTest = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://evfxcdzwmmiguzxdxktl.supabase.co'}/rest/v1/`, {
            method: 'HEAD',
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
            },
            signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
          });
          
          if (!connectivityTest.ok) {
            throw new Error('Supabase connectivity test failed');
          }
          
          // If connectivity is good, try to get session
          const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
          
          clearTimeout(loadingTimeout);
          
          if (sessionError) {
            console.error('❌ Session error:', sessionError);
          } else {
            console.log('✅ Session check:', currentSession ? 'found' : 'none');
            setUser(currentSession?.user ?? null);
            setSession(currentSession);
          }
          
        } catch (connectivityError: any) {
          console.warn('⚠️ Connectivity issue:', connectivityError.message);
          clearTimeout(loadingTimeout);
          
          if (connectivityError.message.includes('timeout') || connectivityError.message.includes('fetch')) {
            toast({
              title: "Connection Issue",
              description: "Cannot connect to authentication service. Check if your Supabase project is active.",
              variant: "destructive",
            });
          }
        }
        
        setLoading(false);
        
      } catch (error) {
        console.error("❌ Auth initialization error:", error);
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error;
      }
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Don't show toast for profile errors as the table might not exist
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting sign up for:', email);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Check your email to confirm your account.",
      });
    } catch (error: any) {
      console.error("Sign-up error:", error);
      
      let errorMessage = "Unable to create account. Please try again.";
      if (error.message?.includes('fetch')) {
        errorMessage = "Connection failed. Your Supabase project may be paused or inaccessible.";
      }
      
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      setLoading(true);
      
      // Test connectivity first
      const testResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://evfxcdzwmmiguzxdxktl.supabase.co'}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        },
        signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined
      });
      
      if (!testResponse.ok) {
        throw new Error('Cannot connect to Supabase - your project may be paused or unreachable');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Sign in successful:', data.user?.email);
      toast({
        title: "Signed In",
        description: "Welcome back!",
      });
    } catch (error: any) {
      console.error("Sign-in error:", error);
      
      let errorMessage = "Sign in failed. Please try again.";
      if (error.message?.includes('fetch') || error.message?.includes('timeout') || error.message?.includes('connect')) {
        errorMessage = "Cannot connect to Supabase. Your project may be paused or the network is unreachable. Check your Supabase dashboard.";
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      }
      
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Signed Out",
        description: "You have been signed out.",
      });

      setUser(null);
      setProfile(null);
    } catch (error: any) {
      console.error("Sign-out error:", error.message);
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Reset Link Sent",
        description: "Check your email for the password reset link.",
      });
    } catch (error: any) {
      console.error("Reset password error:", error.message);
      
      let errorMessage = error.message;
      if (error.message?.includes('fetch')) {
        errorMessage = "Connection failed. Please check your internet connection or Supabase project status.";
      }
      
      toast({
        title: "Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session,
      loading, 
      signUp, 
      signIn, 
      signOut, 
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
