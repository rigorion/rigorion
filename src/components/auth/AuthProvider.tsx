
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
        console.log("AuthProvider: Initializing auth state");
        // Get initial session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          throw sessionError;
        }
        
        console.log("AuthProvider: Session retrieved", !!currentSession);
        setUser(currentSession?.user ?? null);
        setSession(currentSession);
        
        if (currentSession?.access_token) {
          console.log('JWT Token available:', !!currentSession.access_token);
        }
        
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        } else {
          setLoading(false);
        }
        
        // Set up auth state change listener
        console.log("AuthProvider: Setting up auth state change listener");
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, newSession) => {
            console.log("AuthProvider: Auth state changed", _event);
            setUser(newSession?.user ?? null);
            setSession(newSession);
            
            if (newSession?.access_token) {
              console.log('JWT Token (on auth state change) available:', !!newSession.access_token);
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
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      console.log("Profile retrieved:", !!data);
      setProfile(data);
    } catch (error: any) {
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
      console.log("Signing up with email:", email);
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
        console.error("Sign-up error:", error);
        throw error;
      }

      console.log("Sign-up successful");
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
      throw error; // Re-throw to let caller handle it
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("AuthProvider: Signing in with email:", email);
      
      // Add more debugging to understand the Supabase client state
      console.log("Using Supabase auth client with configured URL");
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign-in error:", error);
        throw error;
      }

      console.log("AuthProvider: Sign-in successful");
      toast({
        title: "Signed In",
        description: "Welcome back!",
      });
    } catch (error: any) {
      console.error("Sign-in error:", error);
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error; // Re-throw to let caller handle it
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign-out error:", error);
        throw error;
      }

      console.log("Sign-out successful");
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
      throw error; // Re-throw to let caller handle it
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log("Requesting password reset for:", email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("Reset password error:", error);
        throw error;
      }

      console.log("Reset password email sent successfully");
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
      throw error; // Re-throw to let caller handle it
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
