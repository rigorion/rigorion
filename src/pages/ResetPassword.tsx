import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/components/auth/AuthLayout";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password reset attempted");
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your new password"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl"
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl"
            required
          />
        </div>
        <Button type="submit" className="w-full rounded-xl bg-primary hover:bg-primary/90">
          Reset Password
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

export default ResetPassword;