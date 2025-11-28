
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Clock,
  Edit,
  Trash2,
  Search,
  Plus,
  FileText,
  Building,
  Filter,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/hooks/useAuth";
import { useBuildings } from "@/hooks/useBuildings";
import { Booking, Classroom } from "@/utils/types";
import { format, parseISO } from "date-fns";
import LoadingSpinner from "@/components/ui/loading-spinner";

const MyBookings: React.FC = () => {
  const { bookings, loading, error, fetchBookings, deleteBooking } = useBookings();
  const { buildings, classrooms, fetchBuildings, fetchClassrooms } = useBuildings();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterBuilding, setFilterBuilding] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Fetch user's bookings
  useEffect(() => {
    if (user) {
      fetchBookings(user.id);
    }
  }, [user]);
  
  // Fetch buildings for filtering
  useEffect(() => {
    fetchBuildings();
    fetchClassrooms();
  }, []);
  
  // Apply filters
  useEffect(() => {
    if (!bookings) return;
    
    let filtered = [...bookings];
    
    // Filter by building
    if (filterBuilding && filterBuilding !== "all") {
      const classroomsInBuilding = classrooms
        .filter(classroom => classroom.buildingId === filterBuilding)
        .map(classroom => classroom.id);
      
      filtered = filtered.filter(booking => 
        classroomsInBuilding.includes(booking.classroomId)
      );
    }
    
    // Filter by status
    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter(booking => booking.status === filterStatus);
    }
    
    // Search by purpose
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.purpose.toLowerCase().includes(query)
      );
    }
    
    // Sort by date and time
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      
      return a.startTime.localeCompare(b.startTime);
    });
    
    setFilteredBookings(filtered);
  }, [bookings, filterBuilding, filterStatus, searchQuery]);
  
  const handleDeleteClick = (bookingId: string) => {
    setBookingToDelete(bookingId);
    setDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!bookingToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteBooking(bookingToDelete);
      setDialogOpen(false);
      setBookingToDelete(null);
    } catch (error) {
      console.error("Error deleting booking:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const getClassroomName = (classroomId: string) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    return classroom?.name || classroomId;
  };
  
  const getBuildingName = (classroomId: string) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    if (!classroom) return "";
    
    const building = buildings.find(b => b.id === classroom.buildingId);
    return building?.name || "";
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "blocked":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading && bookings.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">Manage all your classroom bookings</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button 
              onClick={() => navigate('/book')}
              className="bg-umblue hover:bg-umblue-light btn-hover"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Filter className="mr-2 h-5 w-5" />
              Filter Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by purpose..."
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
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="shadow-card card-hover">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex flex-col">
                      <h3 className="text-lg font-semibold line-clamp-1">
                        {booking.purpose}
                      </h3>
                      
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Building className="mr-2 h-4 w-4" />
                          {getBuildingName(booking.classroomId)} - Room {getClassroomName(booking.classroomId)}
                        </div>
                        
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(new Date(booking.date), "EEEE, MMMM d, yyyy")}
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {booking.startTime} - {booking.endTime}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-4 md:mt-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="mr-2"
                        onClick={() => navigate(`/booking/${booking.id}`)}
                      >
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      
                      {/* Only allow editing of future bookings */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="mr-2"
                        onClick={() => navigate(`/edit-booking/${booking.id}`)}
                        disabled={new Date(booking.date) < new Date() || booking.status === "cancelled"}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteClick(booking.id)}
                        disabled={new Date(booking.date) < new Date() || booking.status === "cancelled"}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No bookings found</h3>
              <p className="mt-2 text-muted-foreground">
                {searchQuery || filterBuilding !== "all" || filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "You haven't made any bookings yet"}
              </p>
              <Button
                className="mt-4 bg-umblue hover:bg-umblue-light btn-hover"
                onClick={() => navigate('/book')}
              >
                Book a Classroom
              </Button>
            </div>
          )}
        </div>

        {/* Confirm Delete Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this booking? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <LoadingSpinner size="sm" /> : "Yes, Cancel Booking"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MyBookings;
