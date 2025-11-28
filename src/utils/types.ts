export interface Building {
  id: string;
  name: string;
  location: string;
  description?: string;
  floors: number;
  createdAt: string;
  updatedAt: string;
}

export interface Classroom {
  id: string;
  buildingId: string;
  name: string;
  capacity: number;
  floor: number;
  hasProjector: boolean;
  hasAC: boolean;
  isComputerLab: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  classroomId: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: "pending" | "confirmed" | "cancelled" | "blocked";
  description?: string;
  attendees?: number;
  createdAt: string;
  updatedAt: string;
  buildingName: string; // Change from optional to required
  roomName: string;     // Change from optional to required
}

export interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
  booking?: Booking;
}

export interface AvailabilityResponse {
  classroom: Classroom;
  building: Building;
  date: string;
  timeSlots: TimeSlot[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher";
  status?: "active" | "inactive"; 
  avatar?: string;
  phone?: string;
  department?: string;
  bio?: string;
}
