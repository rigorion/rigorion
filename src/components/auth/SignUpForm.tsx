import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/auth/AuthProvider";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

interface SignUpFormProps {
  onSuccess?: () => void;
}

export const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await signUp(values.email, values.password, values.name);
      onSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-light text-gray-600">Name</FormLabel>
              <FormControl>
                <Input {...field} className="rounded-full border-gray-300 focus:border-[#8A0303] focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-light text-gray-600">Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" className="rounded-full border-gray-300 focus:border-[#8A0303] focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-light text-gray-600">Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" className="rounded-full border-gray-300 focus:border-[#8A0303] focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button 
            type="submit" 
            className="px-8 py-2 bg-white hover:bg-gray-50 text-[#8A0303] border border-[#8A0303] hover:border-[#6b0202] rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(138,3,3,0.3)] transition-all duration-300 ease-out"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </Button>
        </div>
      </form>
    </Form>
  );
};