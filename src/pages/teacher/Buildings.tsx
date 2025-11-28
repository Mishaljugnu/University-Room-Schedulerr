
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useBuildings } from "@/hooks/useBuildings";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, ChevronRight, MapPin, Building, Users } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Building as BuildingType } from "@/utils/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { mockClassrooms } from "@/utils/mockData";

const Buildings = () => {
  const { buildings, loading, fetchBuildings } = useBuildings();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBuildings();
  }, []);

  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">Campus Buildings</h1>
        <p className="text-gray-600 mb-6 dark:text-gray-300">
          Browse available buildings and view their classrooms
        </p>

        <div className="flex items-center mb-6">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search buildings..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
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
                  <BuildingCard key={building.id} building={building} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

const BuildingCard = ({ building }: { building: BuildingType }) => {
  const classroomsInBuilding = mockClassrooms.filter(classroom => classroom.buildingId === building.id);
  
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-blue-600" />
          {building.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {building.location}
        </CardDescription>
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
          <div className="pt-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
              <Users className="h-3 w-3 mr-1" />
              {classroomsInBuilding.length} Classrooms
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full flex items-center justify-between group hover:bg-blue-50 dark:hover:bg-blue-900/30">
              <span>View Details</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Building className="h-6 w-6 text-blue-600" />
                {building.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Location:</span>
                    <span>{building.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Floors:</span>
                    <span>{building.floors}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Classrooms:</span>
                    <span>{classroomsInBuilding.length}</span>
                  </div>
                </div>
              </div>
              
              {building.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-400">{building.description}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-4">Available Classrooms</h4>
                {classroomsInBuilding.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No classrooms available in this building</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {classroomsInBuilding.map((classroom) => (
                      <div key={classroom.id} className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="font-medium">{classroom.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Floor {classroom.floor} • Capacity: {classroom.capacity}
                        </div>
                        <div className="flex gap-2 mt-2">
                          {classroom.hasProjector && (
                            <Badge variant="secondary" className="text-xs">Projector</Badge>
                          )}
                          {classroom.hasAC && (
                            <Badge variant="secondary" className="text-xs">AC</Badge>
                          )}
                          {classroom.isComputerLab && (
                            <Badge variant="secondary" className="text-xs">Computer Lab</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default Buildings;
