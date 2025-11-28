import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useBuildings } from "@/hooks/useBuildings";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Edit, Trash2, Eye } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Building } from "@/utils/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const AdminBuildings = () => {
  const { buildings, loading, fetchBuildings, createBuilding, updateBuilding, deleteBuilding } = useBuildings();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    floors: 1
  });

  useEffect(() => {
    fetchBuildings();
  }, []);

  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBuilding(formData);
      setIsCreateModalOpen(false);
      setFormData({ name: "", description: "", floors: 1 });
    } catch (error) {
      console.error("Error creating building:", error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBuilding) return;
    
    try {
      await updateBuilding(selectedBuilding.id, formData);
      setIsEditModalOpen(false);
      setSelectedBuilding(null);
      setFormData({ name: "", description: "", floors: 1 });
    } catch (error) {
      console.error("Error updating building:", error);
    }
  };

  const handleDelete = async (buildingId: string) => {
    if (window.confirm("Are you sure you want to delete this building?")) {
      try {
        await deleteBuilding(buildingId);
      } catch (error) {
        console.error("Error deleting building:", error);
      }
    }
  };

  const openEditModal = (building: Building) => {
    setSelectedBuilding(building);
    setFormData({
      name: building.name,
      description: building.description || "",
      floors: building.floors
    });
    setIsEditModalOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">Manage Buildings</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Add, edit, and manage campus buildings
            </p>
          </div>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Building
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Building</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Building Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="floors">Number of Floors</Label>
                  <Input
                    id="floors"
                    type="number"
                    min="1"
                    value={formData.floors}
                    onChange={(e) => setFormData({...formData, floors: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Create Building
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row items-center mb-6 gap-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search buildings..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {filteredBuildings.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No buildings found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {searchTerm ? "No buildings match your search criteria." : "There are no buildings registered in the system."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBuildings.map((building) => (
                  <Card key={building.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">{building.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Floors:</span>
                          <span className="text-sm font-medium">{building.floors}</span>
                        </div>
                        {building.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{building.description}</p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => openEditModal(building)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(building.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Building</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <Label htmlFor="editName">Building Name</Label>
                <Input
                  id="editName"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editFloors">Number of Floors</Label>
                <Input
                  id="editFloors"
                  type="number"
                  min="1"
                  value={formData.floors}
                  onChange={(e) => setFormData({...formData, floors: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminBuildings;
