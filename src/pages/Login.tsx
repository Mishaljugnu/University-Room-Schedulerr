
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import Logo from "@/components/layout/Logo";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      // Toast is already shown in the useAuth hook
    } finally {
      setIsSubmitting(false);
    }
  };

  // For demo purposes
  const handleDemoLogin = async (role: 'admin' | 'teacher') => {
    try {
      setIsSubmitting(true);
      if (role === 'admin') {
        await login('admin@um-surabaya.ac.id', 'admin123');
        navigate("/admin/dashboard");
      } else {
        await login('teacher@um-surabaya.ac.id', 'teacher123');
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Demo login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout hideFooter>
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Logo className="h-20 w-20" />
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-umblue">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Access the UM Surabaya Room Scheduler
            </p>
          </div>

          <div className="mt-8 bg-white px-6 py-8 shadow-card rounded-xl border border-border">
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                        />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-umblue hover:bg-umblue-light btn-hover"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <LoadingSpinner size="sm" /> : "Sign in"}
                </Button>
              </form>
            </Form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or try demo accounts
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin("admin")}
                  disabled={isSubmitting}
                  className="btn-hover"
                >
                  Admin Demo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin("teacher")}
                  disabled={isSubmitting}
                  className="btn-hover"
                >
                  Teacher Demo
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <div className="mt-2">
                <span>Don't have an account? </span>
                <Link
                  to="/register"
                  className="text-umblue hover:text-umblue-light font-medium"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
