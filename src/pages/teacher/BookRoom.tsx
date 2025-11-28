
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TimePicker from "@/components/ui/time-picker";
import { useBuildings } from "@/hooks/useBuildings";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Building, Classroom, TimeSlot } from "@/utils/types";
import { format } from "date-fns";
import { CalendarIcon, Clock, Check, X } from "lucide-react";

// Form validation schema
const bookingSchema = z.object({
  buildingId: z.string({
    required_error: "Please select a building",
  }),
  classroomId: z.string({
    required_error: "Please select a classroom",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string({
    required_error: "Please select a start time",
  }),
  endTime: z.string({
    required_error: "Please select an end time",
  }),
  purpose: z.string({
    required_error: "Please enter a purpose for this booking",
  }).min(3, { message: "Purpose must be at least 3 characters" }),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const BookRoom: React.FC = () => {
  const { buildings, classrooms, loading: buildingsLoading, fetchBuildings, fetchClassrooms } = useBuildings();
  const { checkAvailability, createBooking, loading: bookingsLoading } = useBookings();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availabilityData, setAvailabilityData] = useState<TimeSlot[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [booking, setBooking] = useState<BookingFormValues | null>(null);
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      buildingId: "",
      classroomId: "",
      date: new Date(),
      startTime: "",
      endTime: "",
      purpose: "",
    },
  });
  
  // Fetch buildings on mount
  useEffect(() => {
    fetchBuildings();
  }, []);
  
  // When building is selected, fetch its classrooms
  useEffect(() => {
    if (form.watch("buildingId")) {
      fetchClassrooms(form.watch("buildingId"));
    }
  }, [form.watch("buildingId")]);
  
  // Check availability when necessary parameters change
  useEffect(() => {
    const classroomId = form.watch("classroomId");
    const date = form.watch("date");
    
    if (classroomId && date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      handleCheckAvailability(classroomId, formattedDate);
    }
  }, [form.watch("classroomId"), form.watch("date")]);
  
  // Handle check availability
  const handleCheckAvailability = async (classroomId: string, date: string) => {
    try {
      setIsCheckingAvailability(true);
      const data = await checkAvailability(classroomId, date);
      setAvailabilityData(data.timeSlots);
      setSelectedClassroom(data.classroom);
    } catch (error) {
      console.error("Error checking availability:", error);
    } finally {
      setIsCheckingAvailability(false);
    }
  };
  
  const onSubmit = (values: BookingFormValues) => {
    setBooking(values);
    setConfirmDialogOpen(true);
  };
  
  const handleConfirmBooking = async () => {
    if (!booking || !user) return;
    
    try {
      const newBooking = await createBooking({
        classroomId: booking.classroomId,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        date: format(booking.date, "yyyy-MM-dd"),
        startTime: booking.startTime,
        endTime: booking.endTime,
        purpose: booking.purpose,
        status: "confirmed",
      });
      
      toast.success("Room booked successfully!");
      setConfirmDialogOpen(false);
      navigate("/my-bookings");
    } catch (error: any) {
      toast.error(error.message || "Failed to book room");
      setConfirmDialogOpen(false);
    }
  };
  
  const isTimeSlotAvailable = (startTime: string, endTime: string) => {
    if (!availabilityData.length) return false;
    
    // For simplicity, just check if all time slots between start and end are available
    const relevantSlots = availabilityData.filter(slot => 
      (slot.start >= startTime && slot.start < endTime) ||
      (slot.end > startTime && slot.end <= endTime) ||
      (slot.start <= startTime && slot.end >= endTime)
    );
    
    return relevantSlots.every(slot => slot.isAvailable);
  };
  
  const validateTimeRange = () => {
    const startTime = form.watch("startTime");
    const endTime = form.watch("endTime");
    
    if (!startTime || !endTime) return true;
    
    // Check if end time is after start time
    if (startTime >= endTime) {
      form.setError("endTime", {
        type: "manual",
        message: "End time must be after start time",
      });
      return false;
    }
    
    // Check if the time slot is available
    if (!isTimeSlotAvailable(startTime, endTime)) {
      form.setError("startTime", {
        type: "manual",
        message: "This time slot is not available",
      });
      form.setError("endTime", {
        type: "manual",
        message: "This time slot is not available",
      });
      return false;
    }
    
    return true;
  };
  
  const loading = buildingsLoading || bookingsLoading || isCheckingAvailability;

  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book a Classroom</h1>
            <p className="text-gray-600 mt-1">Select a room and time for your next class</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>
                  Fill in the details to book a classroom
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="buildingId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Building</FormLabel>
                            <Select
                              disabled={loading}
                              onValueChange={(value) => {
                                field.onChange(value);
                                form.setValue("classroomId", "");
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select building" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {buildings.map((building) => (
                                  <SelectItem key={building.id} value={building.id}>
                                    {building.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="classroomId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Classroom</FormLabel>
                            <Select
                              disabled={loading || !form.watch("buildingId")}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select classroom" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {classrooms.map((classroom) => (
                                  <SelectItem key={classroom.id} value={classroom.id}>
                                    {classroom.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <div className="grid gap-2">
                            <div className="flex items-center gap-2 rounded-md border p-2">
                              <CalendarIcon className="h-4 w-4 opacity-50" />
                              <span>
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span className="text-muted-foreground">
                                    Pick a date
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="bg-white p-3 rounded-md border">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (date) {
                                    field.onChange(date);
                                  }
                                }}
                                disabled={(date) => {
                                  // Disable past dates
                                  const today = new Date();
                                  today.setHours(0, 0, 0, 0);
                                  return date < today;
                                }}
                                className="rounded-md"
                              />
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <TimePicker
                                value={field.value}
                                onChange={value => {
                                  field.onChange(value);
                                  form.clearErrors("startTime");
                                  validateTimeRange();
                                }}
                                minTime="08:00"
                                maxTime="19:30"
                                interval={30}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <TimePicker
                                value={field.value}
                                onChange={value => {
                                  field.onChange(value);
                                  form.clearErrors("endTime");
                                  validateTimeRange();
                                }}
                                minTime="08:30"
                                maxTime="20:00"
                                interval={30}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purpose</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter the purpose of your booking"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit"
                      className="w-full bg-umblue hover:bg-umblue-light"
                      disabled={loading}
                    >
                      {loading ? <LoadingSpinner size="sm" /> : "Book Room"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Availability Section */}
          <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Room Availability</CardTitle>
                <CardDescription>
                  {selectedClassroom 
                    ? `Availability for ${selectedClassroom.name}` 
                    : "Select a classroom to view availability"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isCheckingAvailability ? (
                  <LoadingSpinner />
                ) : availabilityData.length > 0 ? (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollable-time-picker">
                    {availabilityData.map((slot, index) => (
                      <div
                        key={index}
                        className={`flex justify-between items-center p-2 rounded-md ${
                          slot.isAvailable
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{`${slot.start} - ${slot.end}`}</span>
                        </div>
                        <div>
                          {slot.isAvailable ? (
                            <span className="flex items-center text-green-600 text-sm">
                              <Check className="h-4 w-4 mr-1" />
                              Available
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600 text-sm">
                              <X className="h-4 w-4 mr-1" />
                              Booked
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {form.watch("classroomId")
                        ? "No availability data found"
                        : "Select a classroom to view availability"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Booking</DialogTitle>
              <DialogDescription>
                Please review your booking details before confirming.
              </DialogDescription>
            </DialogHeader>
            
            {booking && (
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Room:</div>
                  <div>
                    {selectedClassroom?.name} {/* This should show the actual room name */}
                  </div>
                  
                  <div className="font-medium">Date:</div>
                  <div>{format(booking.date, "EEEE, MMMM d, yyyy")}</div>
                  
                  <div className="font-medium">Time:</div>
                  <div>{`${booking.startTime} - ${booking.endTime}`}</div>
                  
                  <div className="font-medium">Purpose:</div>
                  <div>{booking.purpose}</div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setConfirmDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-umblue hover:bg-umblue-light" 
                onClick={handleConfirmBooking}
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="sm" /> : "Confirm Booking"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default BookRoom;
