
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MoreHorizontal, UserPlus, Mail, School, Loader2 } from "lucide-react";
import { User } from "@/utils/types";
import UserDetailModal from "@/components/admin/UserDetailModal";
import AddUserModal from "@/components/admin/AddUserModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import { toast } from "sonner";

// Mock users for demonstration when not using the backend
const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Dr. John Smith",
    email: "john.smith@um-surabaya.ac.id",
    role: "teacher",
    department: "Computer Science",
    status: "active"
  },
  {
    id: "u2",
    name: "Prof. Sarah Johnson",
    email: "sarah.johnson@um-surabaya.ac.id",
    role: "teacher",
    department: "Physics",
    status: "active"
  },
  {
    id: "u3",
    name: "Dr. Michael Chen",
    email: "michael.chen@um-surabaya.ac.id",
    role: "teacher",
    department: "Mathematics",
    status: "active"
  },
  {
    id: "u4",
    name: "Admin User",
    email: "admin@um-surabaya.ac.id",
    role: "admin",
    department: "IT Administration",
    status: "active"
  },
  {
    id: "u5",
    name: "Prof. Emma Garcia",
    email: "emma.garcia@um-surabaya.ac.id",
    role: "teacher",
    department: "Biology",
    status: "inactive"
  }
];

const Users: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast: legacyToast } = useToast();
  
  // Get API URL from environment
  const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
  
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return MOCK_USERS;
      }
      return await api.users.getAll();
    },
  });
  
  const updateUserMutation = useMutation({
    mutationFn: async (updatedUser: User) => {
      if (USE_MOCK_DATA) {
        // Just simulate API delay for mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        return updatedUser;
      }
      return await api.users.update(updatedUser.id, updatedUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("User updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user");
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (newUser: Partial<User>) => {
      if (USE_MOCK_DATA) {
        // Simulate API delay and add to mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        const createdUser: User = {
          id: `u${Date.now()}`,
          name: newUser.name || "",
          email: newUser.email || "",
          role: newUser.role || "teacher",
          status: newUser.status || "active",
          department: newUser.department || "",
          phone: newUser.phone || "",
          bio: newUser.bio || ""
        };
        MOCK_USERS.push(createdUser);
        return createdUser;
      }
      return await api.users.create(newUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("User created successfully");
    },
    onError: (error) => {
      console.error("Failed to create user:", error);
      toast.error("Failed to create user");
    }
  });
  
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleStatusChange = (userId: string, newStatus: "active" | "inactive") => {
    const userToUpdate = users.find(user => user.id === userId);
    if (!userToUpdate) return;
    
    const updatedUser = { ...userToUpdate, status: newStatus };
    
    updateUserMutation.mutate(updatedUser);
    
    legacyToast({
      title: "User status updated",
      description: `User status has been set to ${newStatus}.`,
    });
  };
  
  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };
  
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  
  const handleSaveUser = async (updatedUser: User) => {
    await updateUserMutation.mutateAsync(updatedUser);
  };

  const handleCreateUser = async (newUser: Partial<User>) => {
    await createUserMutation.mutateAsync(newUser);
  };

  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">User Management</h1>
          <Button 
            className="bg-umblue hover:bg-umblue-light"
            onClick={() => setIsAddUserModalOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>
        
        <Card className="shadow-card mb-8">
          <CardHeader className="pb-2">
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search by name, email, department..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        <div className="flex justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Loading users...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="bg-umblue text-white">
                                {user.name?.substring(0, 2).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500 flex items-center">
                                <Mail className="mr-1 h-3 w-3" />
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <School className="mr-2 h-4 w-4 text-gray-500" />
                            {user.department || "Not assigned"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "admin" 
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === "active" 
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {user.status?.charAt(0).toUpperCase() + user.status?.slice(1) || "Active"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(user)}>
                                Edit user
                              </DropdownMenuItem>
                              {user.status === "active" ? (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, "inactive")}>
                                  Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                                  Activate
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No users found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        {/* User Detail Modal */}
        <UserDetailModal 
          user={selectedUser}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onSave={handleSaveUser}
          viewOnly={true}
        />
        
        {/* User Edit Modal */}
        <UserDetailModal 
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveUser}
        />

        {/* Add User Modal */}
        <AddUserModal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          onSave={handleCreateUser}
        />
      </div>
    </Layout>
  );
};

export default Users;
