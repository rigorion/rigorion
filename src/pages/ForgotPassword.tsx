import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/components/auth/AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password reset requested for:", email);
  };

  return (
    <AuthLayout 
      title="Forgot Password?" 
      subtitle="Enter your email and we'll send you a reset link"
    >
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
        <Button type="submit" className="w-full rounded-xl bg-primary hover:bg-primary/90">
          Send Reset Link
        </Button>
        <div className="text-center mt-6">
          <Link to="/signin" className="text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;