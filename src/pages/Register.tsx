
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
import LoadingSpinner from "@/components/ui/loading-spinner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";

// Admin code for registration - in production this would be securely stored
const ADMIN_CODE = "admin123"; 

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["teacher", "admin"]),
    adminCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      // If role is admin, admin code must be provided and correct
      if (data.role === "admin") {
        return data.adminCode === ADMIN_CODE;
      }
      return true;
    },
    {
      message: "Invalid admin code",
      path: ["adminCode"],
    }
  );

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "teacher",
      adminCode: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      await register(data.name, data.email, data.password, data.role);
      
      // Redirect based on role
      if (data.role === "admin") {
        navigate("/admin/dashboard");
        toast.success("Admin account created successfully!");
      } else {
        navigate("/dashboard");
        toast.success("Teacher account created successfully!");
      }
    } catch (error) {
      console.error("Registration error:", error);
      // Toast is already shown in the useAuth hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = (role: string) => {
    form.setValue("role", role as "teacher" | "admin");
    setShowAdminCode(role === "admin");
    
    if (role !== "admin") {
      form.setValue("adminCode", "");
    }
  };

  return (
    <Layout hideFooter>
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Logo className="h-20 w-20" />
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-umblue">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Join UM Surabaya Room Scheduler
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          {...field} 
                        />
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
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        onValueChange={handleRoleChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {showAdminCode && (
                  <FormField
                    control={form.control}
                    name="adminCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Code</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter admin code"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
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
                  {isSubmitting ? <LoadingSpinner size="sm" /> : "Register"}
                </Button>

                <div className="text-center text-sm">
                  <div>
                    <span>Already have an account? </span>
                    <Link
                      to="/login"
                      className="text-umblue hover:text-umblue-light font-medium"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
