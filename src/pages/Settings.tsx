
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Separator } from "@/components/ui/separator";
import { 
  BellRing, 
  Mail, 
  Shield, 
  Key, 
  Smartphone, 
  Moon, 
  Sun, 
  Check, 
  AlertTriangle 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { theme, setTheme, logout } = useAuth();
  const [endSessionDialogOpen, setEndSessionDialogOpen] = useState(false);

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    toast({
      title: "Theme updated",
      description: `Theme has been changed to ${newTheme}.`,
    });
  };

  const handleEndSession = async () => {
    setEndSessionDialogOpen(false);
    await logout();
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 mb-8 dark:text-gray-300">Manage your account preferences and settings</p>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
            <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
            <TabsTrigger value="appearance" className="flex-1">Appearance</TabsTrigger>
          </TabsList>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BellRing className="mr-2 h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Email Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Booking confirmations</p>
                      <p className="text-sm text-muted-foreground">Receive notifications when your booking is confirmed</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Booking reminders</p>
                      <p className="text-sm text-muted-foreground">Get reminders before your booked sessions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System updates</p>
                      <p className="text-sm text-muted-foreground">Important updates about the system</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing emails</p>
                      <p className="text-sm text-muted-foreground">Receive news and promotional content</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium">In-App Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Booking updates</p>
                      <p className="text-sm text-muted-foreground">Notifications about changes to your bookings</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New messages</p>
                      <p className="text-sm text-muted-foreground">Alerts when you receive new messages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={handleSave}
                    className="bg-umblue hover:bg-umblue-light"
                  >
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and authentication options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <Key className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-muted-foreground">Update your account password</p>
                      </div>
                    </div>
                    <Button variant="outline">
                      Change Password
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Verified Email</p>
                        <p className="text-sm text-muted-foreground">Your email address has been verified</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-green-600">Verified</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Login Sessions</h3>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Chrome on Windows • Started 2 hours ago</p>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setEndSessionDialogOpen(true)}
                      >
                        End Session
                      </Button>
                      
                      <Dialog open={endSessionDialogOpen} onOpenChange={setEndSessionDialogOpen}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-yellow-500" />
                              End Current Session
                            </DialogTitle>
                            <DialogDescription>
                              Are you sure you want to end your current session? You will be logged out and will need to log in again.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="gap-2 sm:justify-end">
                            <Button 
                              variant="outline" 
                              onClick={() => setEndSessionDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={handleEndSession}
                            >
                              End Session
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Appearance Tab - Removed interface density section */}
          <TabsContent value="appearance">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="flex items-center">
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="ml-2">Appearance</span>
                  </div>
                </CardTitle>
                <CardDescription>
                  Customize the appearance of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Theme Preferences</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        theme === 'light' ? 'border-umblue bg-blue-50/30' : ''
                      }`}
                      onClick={() => handleThemeChange('light')}
                    >
                      <div className="h-24 border-b border-border mb-2 bg-white"></div>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Light</p>
                        <div className={`h-4 w-4 rounded-full ${
                          theme === 'light' ? 'bg-umblue' : 'border border-border'
                        }`}>
                          {theme === 'light' && <Check className="h-4 w-4 text-white" />}
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        theme === 'dark' ? 'border-umblue bg-blue-50/30' : ''
                      }`}
                      onClick={() => handleThemeChange('dark')}
                    >
                      <div className="h-24 border-b border-border mb-2 bg-gray-900"></div>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Dark</p>
                        <div className={`h-4 w-4 rounded-full ${
                          theme === 'dark' ? 'bg-umblue' : 'border border-border'
                        }`}>
                          {theme === 'dark' && <Check className="h-4 w-4 text-white" />}
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        theme === 'system' ? 'border-umblue bg-blue-50/30' : ''
                      }`}
                      onClick={() => handleThemeChange('system')}
                    >
                      <div className="h-24 border-b border-border mb-2 bg-gradient-to-b from-white to-gray-900"></div>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">System</p>
                        <div className={`h-4 w-4 rounded-full ${
                          theme === 'system' ? 'bg-umblue' : 'border border-border'
                        }`}>
                          {theme === 'system' && <Check className="h-4 w-4 text-white" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={handleSave}
                    className="bg-umblue hover:bg-umblue-light"
                  >
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
