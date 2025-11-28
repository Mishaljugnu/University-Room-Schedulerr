
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Building, BookOpen, Clock, Camera, Upload } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().max(500, { message: "Bio cannot exceed 500 characters." }).optional(),
  avatar: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Default form values from user data
  const defaultValues: ProfileFormValues = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || "",
    bio: user?.bio || "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("avatar", file);
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    // In a real application, we would upload the avatar file and get the URL
    // For this demo, we'll just use the preview URL
    const updatedUser = {
      ...user,
      name: data.name,
      phone: data.phone,
      department: data.department,
      bio: data.bio,
      avatar: avatarPreview || user?.avatar,
    };
    
    // In a real app, call API to update user data
    updateUser(updatedUser);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
    
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Overview Card */}
          <div className="md:col-span-1">
            <Card className="shadow-card">
              <CardHeader className="text-center">
                <div className="relative w-24 h-24 mx-auto">
                  <Avatar 
                    className="h-24 w-24 mx-auto cursor-pointer"
                    onClick={handleAvatarClick}
                  >
                    <AvatarImage 
                      src={avatarPreview || user?.avatar} 
                      alt={user?.name} 
                    />
                    <AvatarFallback className="bg-umblue text-white text-xl">
                      {user?.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute bottom-0 right-0 bg-umblue rounded-full p-1 cursor-pointer">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </div>
                <CardTitle className="mt-4">{user?.name}</CardTitle>
                <CardDescription>{user?.role === "admin" ? "Administrator" : "Teacher"}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                
                {user?.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                  </div>
                )}
                
                {user?.department && (
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Department</p>
                      <p className="text-sm text-muted-foreground">{user.department}</p>
                    </div>
                  </div>
                )}
                
                <Separator className="my-4" />
                
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Total Bookings</p>
                    <p className="text-sm text-muted-foreground">27 bookings</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">March 2023</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Edit Form */}
          <div className="md:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                              disabled={!isEditing}
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
                              placeholder="Enter your email address"
                              {...field}
                              disabled={true} // Email is typically not editable
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your phone number"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your department"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us a little about yourself"
                              className="min-h-32"
                              {...field}
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    {isEditing ? (
                      <>
                        <Button 
                          variant="outline" 
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            form.reset(defaultValues);
                            setAvatarPreview(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-umblue hover:bg-umblue-light"
                        >
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button 
                        type="button" 
                        onClick={() => setIsEditing(true)}
                        className="bg-umblue hover:bg-umblue-light ml-auto"
                      >
                        Edit Profile
                      </Button>
                    )}
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
