
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { useBookings } from "@/hooks/useBookings";
import { useBuildings } from "@/hooks/useBuildings";
import { Booking } from "@/utils/types";
import { format, parseISO } from "date-fns";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  ArrowLeft
} from "lucide-react";

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  
  const { bookings, updateBookingStatus, loading } = useBookings();
  const { classrooms, buildings, fetchBuildings, fetchClassrooms } = useBuildings();
  
  const booking = bookings.find(b => b.id === id);
  
  useEffect(() => {
    if (booking) {
      setSelectedStatus(booking.status);
    }
    
    // Ensure buildings and classrooms are loaded
    fetchBuildings();
    fetchClassrooms();
  }, [booking, fetchBuildings, fetchClassrooms]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const getClassroomName = (classroomId: string) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    return classroom ? classroom.name : "Unknown Room";
  };
  
  const getBuildingName = (classroomId: string) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    if (!classroom) return "Unknown Building";
    
    const building = buildings.find(b => b.id === classroom.buildingId);
    return building ? building.name : "Unknown Building";
  };
  
  const handleUpdateStatus = async (status: string) => {
    if (!booking) return;
    
    await updateBookingStatus(booking.id, status);
    
    toast({
      title: "Booking status updated",
      description: `The booking status has been set to ${status}.`,
    });
    
    if (status === "cancelled") {
      setOpenCancelDialog(false);
    }
  };
  
  if (!booking) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-16 px-4 text-center">
          <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Booking Not Found</h1>
          <p className="mb-6">The booking you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </Layout>
    );
  }
  
  const formattedDate = format(new Date(booking.date), "EEEE, MMMM d, yyyy");
  const statusColor = 
    booking.status === "confirmed" ? "text-green-500" :
    booking.status === "pending" ? "text-yellow-500" :
    booking.status === "cancelled" ? "text-red-500" :
    "text-gray-500";
  
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Booking Details</h1>
            <p className="text-gray-600">ID: {booking.id}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <Select
              value={selectedStatus}
              onValueChange={(value) => {
                if (value === "cancelled") {
                  setOpenCancelDialog(true);
                } else {
                  handleUpdateStatus(value);
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card className="mb-8 shadow-card">
          <CardHeader className="border-b pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                {booking.purpose}
                <span className={`ml-4 text-sm ${statusColor} flex items-center`}>
                  {booking.status === "confirmed" && <CheckCircle2 className="mr-1 h-4 w-4" />}
                  {booking.status === "pending" && <Clock className="mr-1 h-4 w-4" />}
                  {booking.status === "cancelled" && <XCircle className="mr-1 h-4 w-4" />}
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            </CardTitle>
            <CardDescription>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {formattedDate}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Schedule Information</h3>
                  <div className="bg-muted/50 p-4 rounded-md space-y-3">
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-muted-foreground">{booking.startTime} - {booking.endTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">
                          {getBuildingName(booking.classroomId)}, Room {getClassroomName(booking.classroomId)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Booking Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-full">
                        <p className="font-medium">Purpose</p>
                        <p className="text-muted-foreground">{booking.purpose}</p>
                      </div>
                    </div>
                    
                    {booking.description && (
                      <div className="flex items-start">
                        <div className="w-full">
                          <p className="font-medium">Description</p>
                          <p className="text-muted-foreground">{booking.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Requester Information</h3>
                  <div className="bg-muted/50 p-4 rounded-md space-y-3">
                    <div className="flex items-start">
                      <User className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Name</p>
                        <p className="text-muted-foreground">{booking.userName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-muted-foreground">{booking.userEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Administrative Notes</h3>
                  <div className="border border-border p-4 rounded-md h-32">
                    <p className="text-muted-foreground">No administrative notes have been added yet.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex justify-end gap-3">
              <Dialog open={openCancelDialog} onOpenChange={setOpenCancelDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Booking</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel this booking? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenCancelDialog(false)}>
                      No, Keep Booking
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleUpdateStatus("cancelled")}
                    >
                      Yes, Cancel Booking
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BookingDetail;
