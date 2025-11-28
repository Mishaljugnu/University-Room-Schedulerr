
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";
import { useBuildings } from "@/hooks/useBuildings";
import { Booking } from "@/utils/types";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { Building2, Calendar, Users, BookOpen, Clock, MapPin, ChevronRight } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { bookings, loading: bookingsLoading, fetchBookings } = useBookings();
  const { buildings, classrooms, loading: buildingsLoading, fetchBuildings, fetchClassrooms } = useBuildings();
  const navigate = useNavigate();

  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  
  useEffect(() => {
    fetchBookings();
    fetchBuildings();
    fetchClassrooms();
  }, []);
  
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayOnly = bookings.filter(booking => 
      booking.date === format(today, "yyyy-MM-dd")
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    const upcoming = bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate > today;
    }).sort((a, b) => {
      // Sort by date first
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      // Then by time
      return a.startTime.localeCompare(b.startTime);
    }).slice(0, 5);
    
    setTodayBookings(todayOnly);
    setUpcomingBookings(upcoming);
  }, [bookings]);
  
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
  
  const formatBookingDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else {
      return format(date, "EEEE, MMMM d");
    }
  };

  const loading = bookingsLoading || buildingsLoading;

  if (loading && (!buildings.length || !classrooms.length)) {
    return (
      <Layout>
        <div className="container max-w-screen-xl mx-auto py-8">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  const handleBookingClick = (bookingId: string) => {
    navigate(`/admin/booking/${bookingId}`);
  };

  const handleManageUsersClick = () => {
    navigate("/admin/users");
  };

  const handleViewBuildingsClick = () => {
    navigate("/admin/buildings");
  };

  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Buildings</p>
                  <h3 className="text-2xl font-bold mt-1">{buildings.length}</h3>
                </div>
                <div className="p-3 rounded-full bg-umblue-light/10">
                  <Building2 className="h-6 w-6 text-umblue" />
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  variant="ghost" 
                  className="text-sm text-umblue hover:text-umblue-light p-0 h-auto"
                  onClick={handleViewBuildingsClick}
                >
                  View all buildings
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Classrooms</p>
                  <h3 className="text-2xl font-bold mt-1">{classrooms.length}</h3>
                </div>
                <div className="p-3 rounded-full bg-umblue-light/10">
                  <MapPin className="h-6 w-6 text-umblue" />
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  variant="ghost" 
                  className="text-sm text-umblue hover:text-umblue-light p-0 h-auto"
                  onClick={() => navigate("/admin/classrooms")}
                >
                  View all classrooms
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Bookings</p>
                  <h3 className="text-2xl font-bold mt-1">{todayBookings.length}</h3>
                </div>
                <div className="p-3 rounded-full bg-umblue-light/10">
                  <Calendar className="h-6 w-6 text-umblue" />
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  variant="ghost" 
                  className="text-sm text-umblue hover:text-umblue-light p-0 h-auto"
                  onClick={() => navigate("/admin/bookings")}
                >
                  View all bookings
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Teachers</p>
                  <h3 className="text-2xl font-bold mt-1">25</h3> {/* Mock data */}
                </div>
                <div className="p-3 rounded-full bg-umblue-light/10">
                  <Users className="h-6 w-6 text-umblue" />
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  variant="ghost" 
                  className="text-sm text-umblue hover:text-umblue-light p-0 h-auto"
                  onClick={handleManageUsersClick}
                >
                  Manage users
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Tabs */}
        <Tabs defaultValue="today" className="space-y-4">
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="today" className="flex-1">Today's Bookings</TabsTrigger>
            <TabsTrigger value="upcoming" className="flex-1">Upcoming Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-xl">Today's Schedule</CardTitle>
                <CardDescription>Bookings scheduled for {format(new Date(), "EEEE, MMMM d")}</CardDescription>
              </CardHeader>
              <CardContent>
                {todayBookings.length > 0 ? (
                  <div className="space-y-4">
                    {todayBookings.map((booking) => (
                      <div 
                        key={booking.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors card-hover"
                        onClick={() => handleBookingClick(booking.id)}
                        role="button"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium">{booking.startTime} - {booking.endTime}</span>
                          </div>
                          <span className="text-lg font-medium mt-1">{booking.purpose}</span>
                          <span className="text-sm text-muted-foreground mt-1 flex items-center">
                            <MapPin className="mr-1 h-4 w-4" />
                            {getBuildingName(booking.classroomId)} - Room {getClassroomName(booking.classroomId)}
                          </span>
                        </div>
                        <div className="flex flex-col mt-3 sm:mt-0 sm:items-end">
                          <span className="text-sm font-medium text-umblue">{booking.userName}</span>
                          <span className="text-xs text-muted-foreground">{booking.userEmail}</span>
                          <span className={`mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === "confirmed" ? "bg-green-100 text-green-800" : 
                            booking.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            booking.status === "cancelled" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No bookings for today</h3>
                    <p className="mt-2 text-muted-foreground">There are no classroom bookings scheduled for today.</p>
                    <Button
                      className="mt-4 bg-umblue hover:bg-umblue-light"
                      onClick={() => navigate("/admin/block-room")}
                    >
                      Block a Room
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-xl">Upcoming Bookings</CardTitle>
                <CardDescription>Next few classroom bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div 
                        key={booking.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors card-hover"
                        onClick={() => handleBookingClick(booking.id)}
                        role="button"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium">{formatBookingDate(booking.date)}</span>
                            <span className="mx-1">•</span>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{booking.startTime} - {booking.endTime}</span>
                          </div>
                          <span className="text-lg font-medium mt-1">{booking.purpose}</span>
                          <span className="text-sm text-muted-foreground mt-1 flex items-center">
                            <MapPin className="mr-1 h-4 w-4" />
                            {getBuildingName(booking.classroomId)} - Room {getClassroomName(booking.classroomId)}
                          </span>
                        </div>
                        <div className="flex flex-col mt-3 sm:mt-0 sm:items-end">
                          <span className="text-sm font-medium text-umblue">{booking.userName}</span>
                          <span className="text-xs text-muted-foreground">{booking.userEmail}</span>
                          <span className={`mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === "confirmed" ? "bg-green-100 text-green-800" : 
                            booking.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            booking.status === "cancelled" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No upcoming bookings</h3>
                    <p className="mt-2 text-muted-foreground">There are no upcoming classroom bookings.</p>
                  </div>
                )}
                
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    className="w-full text-umblue hover:text-umblue-dark hover:bg-muted"
                    onClick={() => navigate('/admin/bookings')}
                  >
                    View All Bookings
                    <ChevronRight className="ml-2 h-4 w-4" />
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

export default AdminDashboard;
