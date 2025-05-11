
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase"; // Import directly to ensure correct instance

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get the path to redirect to after sign in - default to progress
  const from = location.state?.from?.pathname || '/progress';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Attempting to sign in with:", email);
      // Log Supabase configuration details for debugging
      console.log("Using Supabase client from lib/supabase.ts");
      
      await signIn(email, password);
      console.log("Sign in successful, navigating to:", from);
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign In Failed",
        description: error.message || "An error occurred during sign in.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl"
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl"
            required
          />
        </div>
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button 
          type="submit" 
          className="w-full rounded-xl bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Log in"}
        </Button>
        <div className="text-center mt-6">
          <span className="text-gray-600">Don't have an account?</span>{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
