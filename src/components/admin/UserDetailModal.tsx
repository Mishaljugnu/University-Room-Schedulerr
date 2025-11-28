
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { User } from "@/utils/types";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
  viewOnly?: boolean;
}

// Extended User type to handle password changes
interface EditableUser extends User {
  newPassword?: string;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
  viewOnly = false
}) => {
  const [editedUser, setEditedUser] = useState<EditableUser | null>(user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: currentUser } = useAuth();
  
  // Reset form when user changes
  React.useEffect(() => {
    setEditedUser(user);
  }, [user]);
  
  if (!user || !editedUser) return null;
  
  const handleChange = (field: keyof EditableUser, value: any) => {
    setEditedUser({ ...editedUser, [field]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedUser) return;
    
    try {
      setIsSubmitting(true);
      await onSave(editedUser);
      toast.success("User updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentUser = currentUser?.id === user.id;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-umblue text-white">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {viewOnly ? "User Details" : "Edit User"}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="mt-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">User Information</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editedUser.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    disabled={viewOnly}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedUser.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={viewOnly || currentUser?.role !== "admin"}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={editedUser.department || ""}
                    onChange={(e) => handleChange("department", e.target.value)}
                    disabled={viewOnly}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={editedUser.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    disabled={viewOnly}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  value={editedUser.bio || ""}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  disabled={viewOnly}
                  rows={4}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="account" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="role">User Role</Label>
                <Select 
                  value={editedUser.role} 
                  onValueChange={(value) => handleChange("role", value)}
                  disabled={viewOnly || isCurrentUser}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>
                {isCurrentUser && !viewOnly && (
                  <p className="text-sm text-gray-500">You cannot change your own role</p>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Account Status</h3>
                  <p className="text-sm text-gray-500">
                    {editedUser.status === "active" ? 
                      "User can access the system" : 
                      "User is blocked from accessing the system"}
                  </p>
                </div>
                <Switch
                  checked={editedUser.status === "active"}
                  onCheckedChange={(checked) => 
                    handleChange("status", checked ? "active" : "inactive")
                  }
                  disabled={viewOnly || isCurrentUser}
                />
              </div>
              
              {!viewOnly && (
                <>
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password (leave blank to keep current)</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      onChange={(e) => handleChange("newPassword", e.target.value)}
                    />
                  </div>
                </>
              )}
            </TabsContent>
            
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  {viewOnly ? "Close" : "Cancel"}
                </Button>
              </DialogClose>
              
              {!viewOnly && (
                <Button 
                  type="submit" 
                  className="bg-umblue hover:bg-umblue-light"
                  disabled={isSubmitting}
                >
                  Save Changes
                </Button>
              )}
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;
