
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Booking, Classroom } from "@/utils/types";
import { useBookings } from "@/hooks/useBookings";
import { useBuildings } from "@/hooks/useBuildings";
import Layout from "@/components/layout/Layout";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
  CalendarIcon,
  Clock,
  Search,
  Filter,
  MapPin,
  User,
  MoreVertical,
  Check,
  X,
  Ban,
  PencilLine,
  Trash2,
} from "lucide-react";
import { format, isSameDay, isToday, isTomorrow, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import TimePicker from "@/components/ui/time-picker";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const AdminBookings: React.FC = () => {
  const { bookings, loading, fetchBookings, updateBooking, deleteBooking } = useBookings();
  const { buildings, classrooms, fetchBuildings, fetchClassrooms } = useBuildings();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterBuilding, setFilterBuilding] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterClassroom, setFilterClassroom] = useState<string>("all");
  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blockFormData, setBlockFormData] = useState({
    buildingId: "",
    classroomId: "",
    date: new Date(),
    startTime: "08:00",
    endTime: "17:00",
    purpose: "Maintenance",
  });
  
  useEffect(() => {
    fetchBookings();
    fetchBuildings();
    fetchClassrooms();
  }, []);
  
  useEffect(() => {
    if (filterBuilding && filterBuilding !== "all") {
      const filtered = classrooms.filter(classroom => classroom.buildingId === filterBuilding);
      setFilteredClassrooms(filtered);
    } else {
      setFilteredClassrooms([]);
      setFilterClassroom("all");
    }
  }, [filterBuilding, classrooms]);
  
  useEffect(() => {
    if (!bookings.length) return;
    
    let filtered = [...bookings];
    
    // Filter by building
    if (filterBuilding && filterBuilding !== "all") {
      const roomsInBuilding = classrooms
        .filter(classroom => classroom.buildingId === filterBuilding)
        .map(classroom => classroom.id);
      
      filtered = filtered.filter(booking => roomsInBuilding.includes(booking.classroomId));
    }
    
    // Filter by classroom
    if (filterClassroom && filterClassroom !== "all") {
      filtered = filtered.filter(booking => booking.classroomId === filterClassroom);
    }
    
    // Filter by status
    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter(booking => booking.status === filterStatus);
    }
    
    if (selectedTab === "today") {
      filtered = filtered.filter(booking => 
        isToday(new Date(booking.date))
      );
    } else if (selectedTab === "tomorrow") {
      filtered = filtered.filter(booking => 
        isTomorrow(new Date(booking.date))
      );
    } else if (selectedTab === "selected") {
      filtered = filtered.filter(booking => 
        isSameDay(new Date(booking.date), selectedDate)
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.purpose.toLowerCase().includes(query) || 
        booking.userName.toLowerCase().includes(query)
      );
    }
    
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      
      return a.startTime.localeCompare(b.startTime);
    });
    
    setFilteredBookings(filtered);
  }, [
    bookings, 
    filterBuilding, 
    filterClassroom,
    filterStatus, 
    searchQuery,
    selectedTab,
    selectedDate,
    classrooms
  ]);
  
  const getClassroomName = (classroomId: string) => {
    return classrooms.find(c => c.id === classroomId)?.name || classroomId;
  };
  
  const getBuildingName = (classroomId: string) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    if (!classroom) return "";
    
    const building = buildings.find(b => b.id === classroom.buildingId);
    return building?.name || "";
  };
  
  const formatBookingDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else {
      return format(date, "EEE, MMM d, yyyy");
    }
  };
  
  const handleBlockRoomClick = () => {
    setBlockFormData({
      buildingId: "",
      classroomId: "",
      date: new Date(),
      startTime: "08:00",
      endTime: "17:00",
      purpose: "Maintenance",
    });
    setBlockDialogOpen(true);
  };
  
  const handleBlockFormChange = (field: string, value: any) => {
    setBlockFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleBlockFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      await updateBooking(selectedBooking?.id || "", {
        status: "blocked",
      });
      
      setDeleteDialogOpen(false);
      setSelectedBooking(null);
      toast.success("Booking status updated successfully");
    } catch (error) {
      console.error("Error updating booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      setIsSubmitting(true);
      await deleteBooking(selectedBooking.id);
      setDeleteDialogOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error deleting booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
  };
  
  const handleUpdateStatus = async (bookingId: string, status: "confirmed" | "cancelled" | "blocked") => {
    try {
      await updateBooking(bookingId, { status });
      toast.success(`Booking ${status} successfully`);
    } catch (error) {
      console.error(`Error updating booking to ${status}:`, error);
    }
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

  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Bookings</h1>
            <p className="text-gray-600 mt-1">Manage and monitor all classroom bookings</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button
              onClick={handleBlockRoomClick}
              className="bg-umblue hover:bg-umblue-light btn-hover"
            >
              <Ban className="mr-2 h-4 w-4" />
              Block Room
            </Button>
          </div>
        </div>

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
                  placeholder="Search by purpose or teacher..."
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
              
              {filterBuilding && filterBuilding !== "all" && (
                <Select value={filterClassroom} onValueChange={setFilterClassroom}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by classroom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classrooms</SelectItem>
                    {filteredClassrooms.map((classroom) => (
                      <SelectItem key={classroom.id} value={classroom.id}>
                        {classroom.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs 
          defaultValue="all" 
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value)}
          className="mb-6"
        >
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
            <TabsTrigger value="selected">Selected Date</TabsTrigger>
          </TabsList>
          
          {selectedTab === "selected" && (
            <div className="p-4 border rounded-md mt-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="mx-auto"
              />
            </div>
          )}
        </Tabs>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">
              {selectedTab === "all" && "All Bookings"}
              {selectedTab === "today" && "Today's Bookings"}
              {selectedTab === "tomorrow" && "Tomorrow's Bookings"}
              {selectedTab === "selected" && `Bookings for ${format(selectedDate, "MMMM d, yyyy")}`}
            </CardTitle>
            <CardDescription>
              {filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSpinner />
            ) : filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{formatBookingDate(booking.date)}</span>
                            <span className="text-sm text-muted-foreground">
                              {booking.startTime} - {booking.endTime}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{getClassroomName(booking.classroomId)}</span>
                            <span className="text-sm text-muted-foreground">
                              {getBuildingName(booking.classroomId)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={booking.purpose}>
                            {booking.purpose}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{booking.userName}</span>
                            <span className="text-xs text-muted-foreground">
                              {booking.userEmail}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {booking.status !== "confirmed" && (
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                                  className="cursor-pointer"
                                >
                                  <Check className="mr-2 h-4 w-4 text-green-600" />
                                  Confirm
                                </DropdownMenuItem>
                              )}
                              
                              {booking.status !== "cancelled" && (
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                                  className="cursor-pointer"
                                >
                                  <X className="mr-2 h-4 w-4 text-red-600" />
                                  Cancel
                                </DropdownMenuItem>
                              )}
                              
                              {booking.status !== "blocked" && (
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateStatus(booking.id, "blocked")}
                                  className="cursor-pointer"
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Block
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuItem 
                                onClick={() => handleDeleteClick(booking)}
                                className="cursor-pointer text-red-500"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
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
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No bookings found</h3>
                <p className="mt-2 text-muted-foreground">
                  {searchQuery || filterBuilding || filterStatus
                    ? "Try adjusting your filters"
                    : "There are no bookings to display."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Block Classroom</DialogTitle>
              <DialogDescription>
                Block a classroom for maintenance or other purposes.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleBlockFormSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="block-buildingId" className="required">Building</Label>
                  <Select
                    value={blockFormData.buildingId}
                    onValueChange={(value) => {
                      handleBlockFormChange("buildingId", value);
                      handleBlockFormChange("classroomId", "");
                    }}
                    required
                  >
                    <SelectTrigger id="block-buildingId">
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
                  <Label htmlFor="block-classroomId" className="required">Classroom</Label>
                  <Select
                    value={blockFormData.classroomId}
                    onValueChange={(value) => handleBlockFormChange("classroomId", value)}
                    disabled={!blockFormData.buildingId}
                    required
                  >
                    <SelectTrigger id="block-classroomId">
                      <SelectValue placeholder="Select classroom" />
                    </SelectTrigger>
                    <SelectContent>
                      {classrooms
                        .filter((c) => c.buildingId === blockFormData.buildingId)
                        .map((classroom) => (
                          <SelectItem key={classroom.id} value={classroom.id}>
                            {classroom.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="block-date" className="required">Date</Label>
                  <div className="flex items-center gap-2 rounded-md border p-2">
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                    <span>
                      {format(blockFormData.date, "PPP")}
                    </span>
                  </div>
                  <Calendar
                    mode="single"
                    selected={blockFormData.date}
                    onSelect={(date) => date && handleBlockFormChange("date", date)}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    className="rounded-md border mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="block-startTime" className="required">Start Time</Label>
                    <TimePicker
                      value={blockFormData.startTime}
                      onChange={(value) => handleBlockFormChange("startTime", value)}
                      minTime="08:00"
                      maxTime="19:30"
                      interval={30}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="block-endTime" className="required">End Time</Label>
                    <TimePicker
                      value={blockFormData.endTime}
                      onChange={(value) => handleBlockFormChange("endTime", value)}
                      minTime="08:30"
                      maxTime="20:00"
                      interval={30}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="block-purpose" className="required">Reason for Blocking</Label>
                  <Textarea
                    id="block-purpose"
                    value={blockFormData.purpose}
                    onChange={(e) => handleBlockFormChange("purpose", e.target.value)}
                    placeholder="e.g., Maintenance, Cleaning, Special Event"
                    className="resize-none"
                    required
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setBlockDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-umblue hover:bg-umblue-light"
                >
                  {isSubmitting ? <LoadingSpinner size="sm" /> : "Block Room"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this booking? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteBooking}
                disabled={isSubmitting}
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : "Delete Booking"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

const toast = {
  success: (message: string) => { /* mock implementation */ },
  error: (message: string) => { /* mock implementation */ }
};

export default AdminBookings;
