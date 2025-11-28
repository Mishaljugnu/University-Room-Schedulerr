import { useState, useEffect } from "react";
import { Booking, TimeSlot, AvailabilityResponse, Classroom } from "@/utils/types";
import { mockBookings, mockClassrooms, mockBuildings, generateUniqueId, getCurrentTimestamp, isRoomAvailable } from "@/utils/mockData";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

const api = {
  getBookings: async (userId?: string): Promise<Booking[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredBookings = [...mockBookings];
        
        if (userId) {
          filteredBookings = filteredBookings.filter(
            (booking) => booking.userId === userId
          );
        }
        
        resolve(filteredBookings);
      }, 500);
    });
  },
  
  createBooking: async (bookingData: Partial<Booking>): Promise<Booking> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const classroomExists = mockClassrooms.some(
          (classroom) => classroom.id === bookingData.classroomId
        );
        
        if (!classroomExists) {
          reject(new Error("Classroom not found"));
          return;
        }
        
        const available = isRoomAvailable(
          bookingData.classroomId!,
          bookingData.date!,
          bookingData.startTime!,
          bookingData.endTime!
        );
        
        if (!available) {
          reject(new Error("Classroom is not available for the selected time"));
          return;
        }
        
        // Find the classroom
        const classroom = mockClassrooms.find(c => c.id === bookingData.classroomId);
        
        // Find the building if we have a classroom
        const building = classroom 
          ? mockBuildings.find(b => b.id === classroom.buildingId)
          : null;
        
        const newBooking: Booking = {
          id: generateUniqueId(),
          classroomId: bookingData.classroomId || "",
          userId: bookingData.userId || "",
          userName: bookingData.userName || "",
          userEmail: bookingData.userEmail || "",
          date: bookingData.date || "",
          startTime: bookingData.startTime || "",
          endTime: bookingData.endTime || "",
          purpose: bookingData.purpose || "",
          status: bookingData.status || "confirmed",
          buildingName: building?.name || "Unknown Building",
          roomName: classroom?.name || "Unknown Room",
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp(),
        };
        
        mockBookings.push(newBooking);
        
        resolve(newBooking);
      }, 500);
    });
  },
  
  updateBooking: async (id: string, bookingData: Partial<Booking>): Promise<Booking> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockBookings.findIndex((booking) => booking.id === id);
        
        if (index >= 0) {
          if (
            (bookingData.date && bookingData.date !== mockBookings[index].date) ||
            (bookingData.startTime && bookingData.startTime !== mockBookings[index].startTime) ||
            (bookingData.endTime && bookingData.endTime !== mockBookings[index].endTime)
          ) {
            const available = isRoomAvailable(
              bookingData.classroomId || mockBookings[index].classroomId,
              bookingData.date || mockBookings[index].date,
              bookingData.startTime || mockBookings[index].startTime,
              bookingData.endTime || mockBookings[index].endTime,
              id
            );
            
            if (!available) {
              reject(new Error("Classroom is not available for the selected time"));
              return;
            }
          }
          
          const updatedBooking = {
            ...mockBookings[index],
            ...bookingData,
            updatedAt: getCurrentTimestamp(),
          };
          
          mockBookings[index] = updatedBooking;
          
          resolve(updatedBooking);
        } else {
          reject(new Error("Booking not found"));
        }
      }, 500);
    });
  },
  
  deleteBooking: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockBookings.findIndex((booking) => booking.id === id);
        
        if (index >= 0) {
          mockBookings.splice(index, 1);
          
          resolve();
        } else {
          reject(new Error("Booking not found"));
        }
      }, 500);
    });
  },
  
  checkAvailability: async (
    classroomId: string,
    date: string
  ): Promise<AvailabilityResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const classroom = mockClassrooms.find((c) => c.id === classroomId);
        if (!classroom) {
          reject(new Error("Classroom not found"));
          return;
        }
        
        const building = mockBuildings.find((b) => b.id === classroom.buildingId);
        if (!building) {
          reject(new Error("Building not found"));
          return;
        }
        
        const timeSlots: TimeSlot[] = [];
        for (let hour = 8; hour < 20; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const startHour = hour.toString().padStart(2, "0");
            const startMinute = minute.toString().padStart(2, "0");
            
            const endHour = minute === 30 ? 
              (hour + 1).toString().padStart(2, "0") : 
              hour.toString().padStart(2, "0");
            const endMinute = minute === 30 ? "00" : "30";
            
            const start = `${startHour}:${startMinute}`;
            const end = `${endHour}:${endMinute}`;
            
            const bookingsForSlot = mockBookings.filter((booking) => {
              return (
                booking.classroomId === classroomId &&
                booking.date === date &&
                ((booking.startTime <= start && booking.endTime > start) ||
                 (booking.startTime < end && booking.endTime >= end) ||
                 (booking.startTime >= start && booking.endTime <= end))
              );
            });
            
            const isAvailable = bookingsForSlot.length === 0;
            
            timeSlots.push({
              start,
              end,
              isAvailable,
              booking: isAvailable ? undefined : bookingsForSlot[0],
            });
          }
        }
        
        resolve({
          classroom,
          building,
          date,
          timeSlots,
        });
      }, 500);
    });
  },
};

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBookings = async (userId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getBookings(userId);
      
      // Enhance bookings with building and room names if needed
      const enhancedBookings = data.map(booking => {
        // If booking already has buildingName and roomName, use those
        if (booking.buildingName && booking.roomName) {
          return booking;
        }
        
        // Otherwise, find the classroom
        const classroom = mockClassrooms.find(c => c.id === booking.classroomId);
        
        // Find the building if we have a classroom
        const building = classroom 
          ? mockBuildings.find(b => b.id === classroom.buildingId)
          : null;
          
        return {
          ...booking,
          buildingName: building?.name || "Unknown Building",
          roomName: classroom?.name || "Unknown Room"
        };
      });
      
      setBookings(enhancedBookings);
      return enhancedBookings;
    } catch (err) {
      setError("Failed to fetch bookings");
      toast.error("Failed to fetch bookings");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: Partial<Booking>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (user && !bookingData.userId) {
        bookingData.userId = user.id;
        bookingData.userName = user.name;
        bookingData.userEmail = user.email;
      }
      
      const newBooking = await api.createBooking(bookingData);
      setBookings((prev) => [...prev, newBooking]);
      toast.success("Booking created successfully");
      return newBooking;
    } catch (err: any) {
      setError(err.message || "Failed to create booking");
      toast.error(err.message || "Failed to create booking");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id: string, bookingData: Partial<Booking>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedBooking = await api.updateBooking(id, bookingData);
      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? updatedBooking : booking))
      );
      toast.success("Booking updated successfully");
      return updatedBooking;
    } catch (err: any) {
      setError(err.message || "Failed to update booking");
      toast.error(err.message || "Failed to update booking");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedBooking = await api.updateBooking(id, { status: status as "pending" | "confirmed" | "cancelled" | "blocked" });
      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? updatedBooking : booking))
      );
      toast.success(`Booking status updated to ${status}`);
      return updatedBooking;
    } catch (err: any) {
      setError(err.message || "Failed to update booking status");
      toast.error(err.message || "Failed to update booking status");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.deleteBooking(id);
      setBookings((prev) => prev.filter((booking) => booking.id !== id));
      toast.success("Booking cancelled successfully");
    } catch (err) {
      setError("Failed to cancel booking");
      toast.error("Failed to cancel booking");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (classroomId: string, date: string) => {
    try {
      setLoading(true);
      setError(null);
      return await api.checkAvailability(classroomId, date);
    } catch (err: any) {
      setError(err.message || "Failed to check availability");
      toast.error(err.message || "Failed to check availability");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings(user.role === "admin" ? undefined : user.id);
    }
  }, [user]);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBooking,
    updateBookingStatus,
    deleteBooking,
    checkAvailability,
  };
}
