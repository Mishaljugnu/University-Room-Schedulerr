
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building, Classroom } from "@/utils/types";
import { useBuildings } from "@/hooks/useBuildings";
import Layout from "@/components/layout/Layout";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { MapPin, MoreVertical, Plus, PencilLine, Trash2, Monitor, Thermometer, Projector, Search } from "lucide-react";
import { toast } from "sonner";

const Classrooms: React.FC = () => {
  const {
    buildings,
    classrooms,
    loading,
    error,
    fetchBuildings,
    fetchClassrooms,
    createClassroom,
    updateClassroom,
    deleteClassroom,
  } = useBuildings();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterBuilding, setFilterBuilding] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [formData, setFormData] = useState<Partial<Classroom>>({
    buildingId: "",
    name: "",
    capacity: 30,
    floor: 1,
    hasProjector: true,
    hasAC: true,
    isComputerLab: false,
    description: "",
  });
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([]);
  
  // Fetch buildings on mount
  useEffect(() => {
    fetchBuildings();
    fetchClassrooms();
  }, []);
  
  // When a classroom is selected for editing, update the form data
  useEffect(() => {
    if (selectedClassroom) {
      setFormData({
        buildingId: selectedClassroom.buildingId,
        name: selectedClassroom.name,
        capacity: selectedClassroom.capacity,
        floor: selectedClassroom.floor,
        hasProjector: selectedClassroom.hasProjector,
        hasAC: selectedClassroom.hasAC,
        isComputerLab: selectedClassroom.isComputerLab,
        description: selectedClassroom.description,
      });
    }
  }, [selectedClassroom]);
  
  // Apply filters and search
  useEffect(() => {
    let filtered = [...classrooms];
    
    // Filter by building
    if (filterBuilding && filterBuilding !== "all") {
      filtered = filtered.filter(classroom => classroom.buildingId === filterBuilding);
    }
    
    // Search by name or description
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(classroom => 
        classroom.name.toLowerCase().includes(query) ||
        (classroom.description?.toLowerCase().includes(query) || false)
      );
    }
    
    // Sort by building and then by name
    filtered.sort((a, b) => {
      const buildingA = buildings.find(building => building.id === a.buildingId)?.name || "";
      const buildingB = buildings.find(building => building.id === b.buildingId)?.name || "";
      
      if (buildingA !== buildingB) {
        return buildingA.localeCompare(buildingB);
      }
      
      return a.name.localeCompare(b.name);
    });
    
    setFilteredClassrooms(filtered);
  }, [classrooms, filterBuilding, searchQuery, buildings]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ["capacity", "floor"].includes(name) ? parseInt(value, 10) : value,
    }));
  };
  
  // Handle switch toggle changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle form submission for adding a classroom
  const handleAddClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.buildingId || !formData.name) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await createClassroom(formData);
      setFormData({
        buildingId: "",
        name: "",
        capacity: 30,
        floor: 1,
        hasProjector: true,
        hasAC: true,
        isComputerLab: false,
        description: "",
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error creating classroom:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle form submission for editing a classroom
  const handleEditClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClassroom || !formData.buildingId || !formData.name) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await updateClassroom(selectedClassroom.id, formData);
      setIsEditDialogOpen(false);
      setSelectedClassroom(null);
    } catch (error) {
      console.error("Error updating classroom:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle classroom deletion
  const handleDeleteClassroom = async () => {
    if (!selectedClassroom) return;
    
    try {
      setIsSubmitting(true);
      await deleteClassroom(selectedClassroom.id);
      setIsDeleteDialogOpen(false);
      setSelectedClassroom(null);
    } catch (error) {
      console.error("Error deleting classroom:", error);
      toast.error("Failed to delete classroom");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Open the edit dialog for a classroom
  const handleEditClick = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setIsEditDialogOpen(true);
  };
  
  // Open the delete dialog for a classroom
  const handleDeleteClick = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setIsDeleteDialogOpen(true);
  };
  
  // Get building name by id
  const getBuildingName = (buildingId: string) => {
    return buildings.find(building => building.id === buildingId)?.name || "";
  };

  if (loading && buildings.length === 0) {
    return (
      <Layout>
        <div className="container max-w-screen-xl mx-auto py-8">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Classrooms</h1>
            <p className="text-gray-600 mt-1">Manage all classrooms across campus buildings</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-umblue hover:bg-umblue-light btn-hover"
              disabled={buildings.length === 0}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Classroom
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search classrooms..."
                  className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-umblue focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={filterBuilding} onValueChange={setFilterBuilding}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Buildings</SelectItem>
                  {buildings.map((building) => (
                    <SelectItem key={building.id} value={building.id}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Classrooms Table */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Classrooms</CardTitle>
            <CardDescription>
              {filteredClassrooms.length} classroom{filteredClassrooms.length !== 1 ? "s" : ""}
              {filterBuilding && ` in ${getBuildingName(filterBuilding)}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {buildings.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No buildings available</h3>
                <p className="mt-2 text-muted-foreground">
                  You need to create at least one building before adding classrooms.
                </p>
                <Button
                  className="mt-4 bg-umblue hover:bg-umblue-light"
                  onClick={() => window.location.href = "/admin/buildings"}
                >
                  Manage Buildings
                </Button>
              </div>
            ) : filteredClassrooms.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Building</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Floor</TableHead>
                      <TableHead>Features</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClassrooms.map((classroom) => (
                      <TableRow key={classroom.id}>
                        <TableCell className="font-medium">
                          {classroom.name}
                          {classroom.isComputerLab && (
                            <span className="ml-2 py-0.5 px-1.5 text-xs rounded-md bg-blue-100 text-blue-800">
                              Computer Lab
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{getBuildingName(classroom.buildingId)}</TableCell>
                        <TableCell>{classroom.capacity} seats</TableCell>
                        <TableCell>{classroom.floor}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {classroom.hasProjector && (
                              <div title="Projector" className="p-1 rounded-full bg-green-100">
                                <Projector className="h-3.5 w-3.5 text-green-700" />
                              </div>
                            )}
                            {classroom.hasAC && (
                              <div title="Air Conditioner" className="p-1 rounded-full bg-blue-100">
                                <Thermometer className="h-3.5 w-3.5 text-blue-700" />
                              </div>
                            )}
                            {classroom.isComputerLab && (
                              <div title="Computer Lab" className="p-1 rounded-full bg-purple-100">
                                <Monitor className="h-3.5 w-3.5 text-purple-700" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditClick(classroom)}
                                className="cursor-pointer"
                              >
                                <PencilLine className="mr-2 h-4 w-4" />
                                Edit Classroom
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(classroom)}
                                className="text-red-500 cursor-pointer"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Classroom
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No classrooms found</h3>
                <p className="mt-2 text-muted-foreground">
                  {searchQuery || filterBuilding
                    ? "Try adjusting your filters"
                    : "Add your first classroom to get started."}
                </p>
                <Button
                  className="mt-4 bg-umblue hover:bg-umblue-light"
                  onClick={() => setIsAddDialogOpen(true)}
                  disabled={buildings.length === 0}
                >
                  Add Classroom
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Classroom Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Classroom</DialogTitle>
              <DialogDescription>
                Enter the details for the new classroom.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddClassroom}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="buildingId" className="required">Building</Label>
                  <Select
                    value={formData.buildingId}
                    onValueChange={(value) => handleSelectChange("buildingId", value)}
                    required
                  >
                    <SelectTrigger id="buildingId">
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map((building) => (
                        <SelectItem key={building.id} value={building.id}>
                          {building.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="name" className="required">Classroom Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Room 101"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="floor" className="required">Floor</Label>
                    <Input
                      id="floor"
                      name="floor"
                      type="number"
                      min="1"
                      value={formData.floor}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="capacity" className="required">Capacity</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hasProjector" className="cursor-pointer">
                      <div className="flex items-center">
                        <Projector className="mr-2 h-4 w-4" />
                        Has Projector
                      </div>
                    </Label>
                    <Switch
                      id="hasProjector"
                      checked={formData.hasProjector}
                      onCheckedChange={(checked) => handleSwitchChange("hasProjector", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hasAC" className="cursor-pointer">
                      <div className="flex items-center">
                        <Thermometer className="mr-2 h-4 w-4" />
                        Has Air Conditioning
                      </div>
                    </Label>
                    <Switch
                      id="hasAC"
                      checked={formData.hasAC}
                      onCheckedChange={(checked) => handleSwitchChange("hasAC", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isComputerLab" className="cursor-pointer">
                      <div className="flex items-center">
                        <Monitor className="mr-2 h-4 w-4" />
                        Is Computer Lab
                      </div>
                    </Label>
                    <Switch
                      id="isComputerLab"
                      checked={formData.isComputerLab}
                      onCheckedChange={(checked) => handleSwitchChange("isComputerLab", checked)}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of the classroom"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-umblue hover:bg-umblue-light"
                >
                  {isSubmitting ? <LoadingSpinner size="sm" /> : "Add Classroom"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Classroom Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Classroom</DialogTitle>
              <DialogDescription>
                Update the details for this classroom.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleEditClassroom}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-buildingId" className="required">Building</Label>
                  <Select
                    value={formData.buildingId}
                    onValueChange={(value) => handleSelectChange("buildingId", value)}
                    required
                  >
                    <SelectTrigger id="edit-buildingId">
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map((building) => (
                        <SelectItem key={building.id} value={building.id}>
                          {building.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-name" className="required">Classroom Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    placeholder="e.g., Room 101"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-floor" className="required">Floor</Label>
                    <Input
                      id="edit-floor"
                      name="floor"
                      type="number"
                      min="1"
                      value={formData.floor}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-capacity" className="required">Capacity</Label>
                    <Input
                      id="edit-capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-hasProjector" className="cursor-pointer">
                      <div className="flex items-center">
                        <Projector className="mr-2 h-4 w-4" />
                        Has Projector
                      </div>
                    </Label>
                    <Switch
                      id="edit-hasProjector"
                      checked={formData.hasProjector}
                      onCheckedChange={(checked) => handleSwitchChange("hasProjector", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-hasAC" className="cursor-pointer">
                      <div className="flex items-center">
                        <Thermometer className="mr-2 h-4 w-4" />
                        Has Air Conditioning
                      </div>
                    </Label>
                    <Switch
                      id="edit-hasAC"
                      checked={formData.hasAC}
                      onCheckedChange={(checked) => handleSwitchChange("hasAC", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-isComputerLab" className="cursor-pointer">
                      <div className="flex items-center">
                        <Monitor className="mr-2 h-4 w-4" />
                        Is Computer Lab
                      </div>
                    </Label>
                    <Switch
                      id="edit-isComputerLab"
                      checked={formData.isComputerLab}
                      onCheckedChange={(checked) => handleSwitchChange("isComputerLab", checked)}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    placeholder="Brief description of the classroom"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-umblue hover:bg-umblue-light"
                >
                  {isSubmitting ? <LoadingSpinner size="sm" /> : "Update Classroom"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Classroom</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this classroom?
                This action cannot be undone, and all bookings for this classroom will also be deleted.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteClassroom}
                disabled={isSubmitting}
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : "Delete Classroom"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Classrooms;
