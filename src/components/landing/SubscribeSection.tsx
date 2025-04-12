import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
export const SubscribeSection = () => {
  const [email, setEmail] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // Simulate subscription
    toast.success("Thanks for subscribing!");
    setEmail('');
  };
  return <section className="bg-gray-50 py-[32px]">
      <div className="container mx-auto px-4 max-w-xl text-center">
        <h2 className="text-xl md:text-2xl font-medium text-gray-800 tracking-wide uppercase mb-6">BE THE ONE WE CONTACT WHEN WE HAVE NEW PRODUCTS &amp; SERVICES</h2>
        
        <form onSubmit={handleSubmit} className="flex space-x-2 max-w-md mx-auto">
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="flex-grow text-gray-600" />
          <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
            SUBSCRIBE
          </Button>
        </form>
      </div>
    </section>;
};