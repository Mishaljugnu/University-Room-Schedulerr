
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { CalendarRange, BookOpen, Building, Clock, Calendar, Users } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Check } from "lucide-react"; // Import Check from lucide-react instead

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { bookings, loading } = useBookings(); // Use loading instead of isLoading

  // Filter to get only upcoming bookings
  const currentDate = new Date();
  const upcomingBookings = bookings?.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate >= currentDate;
  }).slice(0, 3);

  // Calculate some stats
  const totalBookings = bookings?.length || 0;
  const completedBookings = bookings?.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate < currentDate;
  }).length || 0;

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">Welcome, {user?.name}</h1>
        <p className="text-gray-600 mb-8 dark:text-gray-300">Manage your classroom bookings and schedule</p>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardDescription>Total Bookings</CardDescription>
              <CardTitle className="text-3xl">{loading ? <LoadingSpinner /> : totalBookings}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>All time reservations</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardDescription>Classes Completed</CardDescription>
              <CardTitle className="text-3xl">{loading ? <LoadingSpinner /> : completedBookings}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Check className="h-4 w-4" />
                <span>Sessions finished</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardDescription>Upcoming Classes</CardDescription>
              <CardTitle className="text-3xl">{loading ? <LoadingSpinner /> : (upcomingBookings?.length || 0)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Upcoming sessions</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardDescription>Average Class Size</CardDescription>
              <CardTitle className="text-3xl">{loading ? <LoadingSpinner /> : "25"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Students per class</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Section */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarRange className="h-5 w-5 text-umblue" />
                <span>Book a Room</span>
              </CardTitle>
              <CardDescription>Reserve a classroom for your lessons</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Quickly book available classrooms for your upcoming classes and sessions.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/book" className="w-full">
                <Button className="w-full bg-umblue hover:bg-umblue-light">Book Now</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-umblue" />
                <span>View Buildings</span>
              </CardTitle>
              <CardDescription>See available buildings and rooms</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Browse through campus buildings and check their classrooms and capacities.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/buildings" className="w-full">
                <Button className="w-full bg-umblue hover:bg-umblue-light">Browse Buildings</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-umblue" />
                <span>My Bookings</span>
              </CardTitle>
              <CardDescription>Manage your existing reservations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                View, edit or cancel your upcoming classroom bookings and reservations.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/my-bookings" className="w-full">
                <Button className="w-full bg-umblue hover:bg-umblue-light">My Bookings</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Upcoming Bookings Section */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Upcoming Bookings</h2>
        {loading ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : upcomingBookings && upcomingBookings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {upcomingBookings.map((booking) => {
              // Make sure we have buildingName and roomName, using fallbacks if needed
              const buildingName = booking.buildingName || "Unknown Building";
              const roomName = booking.roomName || "Unknown Room";
              
              return (
                <Card key={booking.id} className="shadow-card">
                  <CardHeader>
                    <CardTitle>{booking.purpose}</CardTitle>
                    <CardDescription>
                      {new Date(booking.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Time:</span>
                        <span className="text-sm font-medium">
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Building:</span>
                        <span className="text-sm font-medium">{buildingName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Room:</span>
                        <span className="text-sm font-medium">{roomName}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/booking/${booking.id}`} className="w-full">
                      <Button variant="outline" className="w-full">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CalendarRange className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No upcoming bookings</h3>
              <p className="text-muted-foreground text-center mb-6">
                You don't have any upcoming classroom bookings scheduled.
              </p>
              <Link to="/book">
                <Button className="bg-umblue hover:bg-umblue-light">Book a Room</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
