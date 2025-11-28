import { useState, useEffect } from "react";
import { Building, Classroom } from "@/utils/types";
import { mockBuildings, mockClassrooms, generateUniqueId, getCurrentTimestamp } from "@/utils/mockData";
import { toast } from "sonner";

// Mock API for buildings
const api = {
  getBuildings: async (): Promise<Building[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockBuildings]);
      }, 500);
    });
  },
  
  createBuilding: async (buildingData: Partial<Building>): Promise<Building> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBuilding: Building = {
          id: generateUniqueId(),
          name: buildingData.name || "",
          location: "",  // Set empty location since we're not using it
          description: buildingData.description || "",
          floors: buildingData.floors || 1,
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp(),
        };
        
        // In a real app, this would be an API call that updates the database
        mockBuildings.push(newBuilding);
        
        resolve(newBuilding);
      }, 500);
    });
  },
  
  updateBuilding: async (id: string, buildingData: Partial<Building>): Promise<Building> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockBuildings.findIndex((building) => building.id === id);
        if (index >= 0) {
          const updatedBuilding = {
            ...mockBuildings[index],
            ...buildingData,
            updatedAt: getCurrentTimestamp(),
          };
          
          // Update in the mock data
          mockBuildings[index] = updatedBuilding;
          
          resolve(updatedBuilding);
        } else {
          reject(new Error("Building not found"));
        }
      }, 500);
    });
  },
  
  deleteBuilding: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockBuildings.findIndex((building) => building.id === id);
        
        if (index >= 0) {
          // Check if there are classrooms in this building
          const hasClassrooms = mockClassrooms.some((classroom) => classroom.buildingId === id);
          
          if (hasClassrooms) {
            reject(new Error("Cannot delete building with existing classrooms"));
            return;
          }
          
          // Remove from the mock data
          mockBuildings.splice(index, 1);
          
          resolve();
        } else {
          reject(new Error("Building not found"));
        }
      }, 500);
    });
  },
  
  getClassrooms: async (buildingId?: string): Promise<Classroom[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredClassrooms = [...mockClassrooms];
        
        if (buildingId) {
          filteredClassrooms = filteredClassrooms.filter(
            (classroom) => classroom.buildingId === buildingId
          );
        }
        
        resolve(filteredClassrooms);
      }, 500);
    });
  },
  
  createClassroom: async (classroomData: Partial<Classroom>): Promise<Classroom> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validate that the building exists
        const buildingExists = mockBuildings.some(
          (building) => building.id === classroomData.buildingId
        );
        
        if (!buildingExists) {
          reject(new Error("Building not found"));
          return;
        }
        
        const newClassroom: Classroom = {
          id: generateUniqueId(),
          buildingId: classroomData.buildingId || "",
          name: classroomData.name || "",
          capacity: classroomData.capacity || 0,
          floor: classroomData.floor || 1,
          hasProjector: classroomData.hasProjector || false,
          hasAC: classroomData.hasAC || false,
          isComputerLab: classroomData.isComputerLab || false,
          description: classroomData.description || "",
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp(),
        };
        
        // In a real app, this would be an API call that updates the database
        mockClassrooms.push(newClassroom);
        
        resolve(newClassroom);
      }, 500);
    });
  },
  
  updateClassroom: async (id: string, classroomData: Partial<Classroom>): Promise<Classroom> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockClassrooms.findIndex((classroom) => classroom.id === id);
        
        if (index >= 0) {
          const updatedClassroom = {
            ...mockClassrooms[index],
            ...classroomData,
            updatedAt: getCurrentTimestamp(),
          };
          
          // Update in the mock data
          mockClassrooms[index] = updatedClassroom;
          
          resolve(updatedClassroom);
        } else {
          reject(new Error("Classroom not found"));
        }
      }, 500);
    });
  },
  
  deleteClassroom: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockClassrooms.findIndex((classroom) => classroom.id === id);
        
        if (index >= 0) {
          // In a real app, you would check if there are bookings for this classroom
          // and either prevent deletion or cascade delete the bookings
          
          // Remove from the mock data
          mockClassrooms.splice(index, 1);
          
          resolve();
        } else {
          reject(new Error("Classroom not found"));
        }
      }, 500);
    });
  },
};

export function useBuildings() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all buildings
  const fetchBuildings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getBuildings();
      setBuildings(data);
      return data;
    } catch (err) {
      setError("Failed to fetch buildings");
      toast.error("Failed to fetch buildings");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create a new building
  const createBuilding = async (buildingData: Partial<Building>) => {
    try {
      setLoading(true);
      setError(null);
      const newBuilding = await api.createBuilding(buildingData);
      setBuildings((prev) => [...prev, newBuilding]);
      toast.success("Building created successfully");
      return newBuilding;
    } catch (err) {
      setError("Failed to create building");
      toast.error("Failed to create building");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing building
  const updateBuilding = async (id: string, buildingData: Partial<Building>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedBuilding = await api.updateBuilding(id, buildingData);
      setBuildings((prev) =>
        prev.map((building) =>
          building.id === id ? updatedBuilding : building
        )
      );
      toast.success("Building updated successfully");
      return updatedBuilding;
    } catch (err) {
      setError("Failed to update building");
      toast.error("Failed to update building");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a building
  const deleteBuilding = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.deleteBuilding(id);
      setBuildings((prev) => prev.filter((building) => building.id !== id));
      toast.success("Building deleted successfully");
    } catch (err: any) {
      setError(err.message || "Failed to delete building");
      toast.error(err.message || "Failed to delete building");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch classrooms, optionally filtered by building
  const fetchClassrooms = async (buildingId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getClassrooms(buildingId);
      setClassrooms(data);
      return data;
    } catch (err) {
      setError("Failed to fetch classrooms");
      toast.error("Failed to fetch classrooms");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create a new classroom
  const createClassroom = async (classroomData: Partial<Classroom>) => {
    try {
      setLoading(true);
      setError(null);
      const newClassroom = await api.createClassroom(classroomData);
      setClassrooms((prev) => [...prev, newClassroom]);
      toast.success("Classroom created successfully");
      return newClassroom;
    } catch (err) {
      setError("Failed to create classroom");
      toast.error("Failed to create classroom");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing classroom
  const updateClassroom = async (id: string, classroomData: Partial<Classroom>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedClassroom = await api.updateClassroom(id, classroomData);
      setClassrooms((prev) =>
        prev.map((classroom) =>
          classroom.id === id ? updatedClassroom : classroom
        )
      );
      toast.success("Classroom updated successfully");
      return updatedClassroom;
    } catch (err) {
      setError("Failed to update classroom");
      toast.error("Failed to update classroom");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a classroom
  const deleteClassroom = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.deleteClassroom(id);
      setClassrooms((prev) => prev.filter((classroom) => classroom.id !== id));
      toast.success("Classroom deleted successfully");
    } catch (err) {
      setError("Failed to delete classroom");
      toast.error("Failed to delete classroom");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load buildings on component mount
  useEffect(() => {
    fetchBuildings();
  }, []);

  return {
    buildings,
    classrooms,
    loading,
    error,
    fetchBuildings,
    createBuilding,
    updateBuilding,
    deleteBuilding,
    fetchClassrooms,
    createClassroom,
    updateClassroom,
    deleteClassroom,
  };
}
