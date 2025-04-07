import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/components/auth/AuthLayout";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up attempt:", { name, email });
  };

  return (
    <AuthLayout title="Let's begin..." subtitle="Create your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl"
            required
          />
        </div>
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
        <Button type="submit" className="w-full rounded-xl bg-primary hover:bg-primary/90">
          Sign up
        </Button>
        <div className="text-center mt-6">
          <span className="text-gray-600">Already have an account?</span>{" "}
          <Link to="/signin" className="text-primary hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;