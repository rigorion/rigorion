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
  signIn: (email: string, password: string, redirectPath?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Export the AuthContext so it can be imported elsewhere
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
        // Get initial session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setUser(currentSession?.user ?? null);
        setSession(currentSession); // Store the session
        
        // Log the JWT token to console
        if (currentSession?.access_token) {
          console.log('JWT Token:', currentSession.access_token);
        }
        
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        } else {
          // Important: Make sure to set loading to false when there's no session
          setLoading(false);
        }
        
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, newSession) => {
            setUser(newSession?.user ?? null);
            setSession(newSession); // Update session on auth state change
            
            // Log the JWT token to console when it changes
            if (newSession?.access_token) {
              console.log('JWT Token (on auth state change):', newSession.access_token);
            }
            
            if (newSession?.user) {
              await fetchProfile(newSession.user.id);
            } else {
              setProfile(null);
              setLoading(false);
            }
          }
        );
        
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Auth initialization error:", error);
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

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Check your email to confirm your account.",
      });
    } catch (error: any) {
      console.error("Sign-up error:", error.message);
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signIn = async (email: string, password: string, redirectPath: string = "/progress") => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Signed In",
        description: "Welcome back!",
      });
      
      // After successful sign in, navigate to the specified path (default: progress)
      window.location.href = redirectPath;
      
    } catch (error: any) {
      console.error("Sign-in error:", error.message);
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
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
      toast({
        title: "Reset Failed",
        description: error.message,
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
