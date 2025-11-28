
import { Building, Classroom, Booking } from "./types";

// Mock buildings data
export const mockBuildings: Building[] = [
  {
    id: "b1",
    name: "Faculty of Engineering",
    location: "East Campus",
    description: "Main engineering building with computer labs and lecture halls",
    floors: 5,
    createdAt: "2023-01-15T08:00:00Z",
    updatedAt: "2023-01-15T08:00:00Z",
  },
  {
    id: "b2",
    name: "Faculty of Science",
    location: "West Campus",
    description: "Science building with laboratories and lecture halls",
    floors: 4,
    createdAt: "2023-01-15T08:30:00Z",
    updatedAt: "2023-01-15T08:30:00Z",
  },
  {
    id: "b3",
    name: "Faculty of Humanities",
    location: "North Campus",
    description: "Humanities building with classrooms and seminar rooms",
    floors: 3,
    createdAt: "2023-01-15T09:00:00Z",
    updatedAt: "2023-01-15T09:00:00Z",
  },
  {
    id: "b4",
    name: "Faculty of Economics",
    location: "South Campus",
    description: "Economics building with lecture halls and meeting rooms",
    floors: 3,
    createdAt: "2023-01-15T09:30:00Z",
    updatedAt: "2023-01-15T09:30:00Z",
  }
];

// Mock classrooms data
export const mockClassrooms: Classroom[] = [
  // Engineering classrooms
  {
    id: "c1",
    buildingId: "b1",
    name: "E101",
    capacity: 40,
    floor: 1,
    hasProjector: true,
    hasAC: true,
    isComputerLab: false,
    createdAt: "2023-01-16T08:00:00Z",
    updatedAt: "2023-01-16T08:00:00Z",
  },
  {
    id: "c2",
    buildingId: "b1",
    name: "E102",
    capacity: 30,
    floor: 1,
    hasProjector: true,
    hasAC: true,
    isComputerLab: false,
    createdAt: "2023-01-16T08:10:00Z",
    updatedAt: "2023-01-16T08:10:00Z",
  },
  {
    id: "c3",
    buildingId: "b1",
    name: "Computer Lab 1",
    capacity: 25,
    floor: 2,
    hasProjector: true,
    hasAC: true,
    isComputerLab: true,
    createdAt: "2023-01-16T08:20:00Z",
    updatedAt: "2023-01-16T08:20:00Z",
  },
  
  // Science classrooms
  {
    id: "c4",
    buildingId: "b2",
    name: "S101",
    capacity: 45,
    floor: 1,
    hasProjector: true,
    hasAC: true,
    isComputerLab: false,
    createdAt: "2023-01-16T09:00:00Z",
    updatedAt: "2023-01-16T09:00:00Z",
  },
  {
    id: "c5",
    buildingId: "b2",
    name: "Chemistry Lab",
    capacity: 20,
    floor: 2,
    hasProjector: true,
    hasAC: true,
    isComputerLab: false,
    description: "Equipped with lab stations and safety equipment",
    createdAt: "2023-01-16T09:10:00Z",
    updatedAt: "2023-01-16T09:10:00Z",
  },
  
  // Humanities classrooms
  {
    id: "c6",
    buildingId: "b3",
    name: "H101",
    capacity: 35,
    floor: 1,
    hasProjector: true,
    hasAC: true,
    isComputerLab: false,
    createdAt: "2023-01-16T10:00:00Z",
    updatedAt: "2023-01-16T10:00:00Z",
  },
  {
    id: "c7",
    buildingId: "b3",
    name: "Seminar Room 1",
    capacity: 15,
    floor: 2,
    hasProjector: true,
    hasAC: true,
    isComputerLab: false,
    description: "Small room ideal for group discussions",
    createdAt: "2023-01-16T10:10:00Z",
    updatedAt: "2023-01-16T10:10:00Z",
  },
  
  // Economics classrooms
  {
    id: "c8",
    buildingId: "b4",
    name: "EC101",
    capacity: 50,
    floor: 1,
    hasProjector: true,
    hasAC: true,
    isComputerLab: false,
    createdAt: "2023-01-16T11:00:00Z",
    updatedAt: "2023-01-16T11:00:00Z",
  },
  {
    id: "c9",
    buildingId: "b4",
    name: "EC Conference Room",
    capacity: 20,
    floor: 3,
    hasProjector: true,
    hasAC: true,
    isComputerLab: false,
    description: "Conference room with boardroom table",
    createdAt: "2023-01-16T11:10:00Z",
    updatedAt: "2023-01-16T11:10:00Z",
  }
];

// Helper function to create a date string for today + days
const getDateString = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

// Helper function to get building and room name for a classroom
const getBuildingAndRoomName = (classroomId: string) => {
  const classroom = mockClassrooms.find(c => c.id === classroomId);
  const building = classroom 
    ? mockBuildings.find(b => b.id === classroom.buildingId)
    : null;
  
  return {
    buildingName: building?.name || "Unknown Building",
    roomName: classroom?.name || "Unknown Room"
  };
};

// Mock bookings data
export const mockBookings: Booking[] = [
  {
    id: "bk1",
    classroomId: "c1",
    userId: "2", // Teacher user
    userName: "Teacher User",
    userEmail: "teacher@um-surabaya.ac.id",
    date: getDateString(0), // Today
    startTime: "09:00",
    endTime: "11:00",
    purpose: "Lecture on Web Development",
    status: "confirmed",
    createdAt: "2023-01-20T08:00:00Z",
    updatedAt: "2023-01-20T08:00:00Z",
    ...getBuildingAndRoomName("c1")
  },
  {
    id: "bk2",
    classroomId: "c3",
    userId: "2", // Teacher user
    userName: "Teacher User",
    userEmail: "teacher@um-surabaya.ac.id",
    date: getDateString(1), // Tomorrow
    startTime: "13:00",
    endTime: "15:00",
    purpose: "Programming Lab Session",
    status: "confirmed",
    createdAt: "2023-01-20T09:00:00Z",
    updatedAt: "2023-01-20T09:00:00Z",
    ...getBuildingAndRoomName("c3")
  },
  {
    id: "bk3",
    classroomId: "c5",
    userId: "2", // Another teacher (in a real app)
    userName: "Another Teacher",
    userEmail: "another.teacher@um-surabaya.ac.id",
    date: getDateString(0), // Today
    startTime: "10:00",
    endTime: "12:00",
    purpose: "Chemistry Experiment",
    status: "confirmed",
    createdAt: "2023-01-20T10:00:00Z",
    updatedAt: "2023-01-20T10:00:00Z",
    ...getBuildingAndRoomName("c5")
  },
  {
    id: "bk4",
    classroomId: "c8",
    userId: "1", // Admin (blocking the room)
    userName: "Admin User",
    userEmail: "admin@um-surabaya.ac.id",
    date: getDateString(2), // Day after tomorrow
    startTime: "09:00",
    endTime: "17:00",
    purpose: "Maintenance",
    status: "blocked",
    createdAt: "2023-01-20T11:00:00Z",
    updatedAt: "2023-01-20T11:00:00Z",
    ...getBuildingAndRoomName("c8")
  },
];

// Helper functions to interact with mock data

export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

// Function to check if a room is available at a given time
export const isRoomAvailable = (
  classroomId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
) => {
  const conflictingBookings = mockBookings.filter(booking => {
    // Skip the current booking if we're checking for updates
    if (excludeBookingId && booking.id === excludeBookingId) {
      return false;
    }
    
    // Check if the booking is for the same classroom and date
    if (booking.classroomId === classroomId && booking.date === date) {
      // Check if the time ranges overlap
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;
      
      // Overlap check: if either the start or end time falls within another booking
      const startsWithinExisting = startTime >= bookingStart && startTime < bookingEnd;
      const endsWithinExisting = endTime > bookingStart && endTime <= bookingEnd;
      const encapsulatesExisting = startTime <= bookingStart && endTime >= bookingEnd;
      
      return startsWithinExisting || endsWithinExisting || encapsulatesExisting;
    }
    return false;
  });

  return conflictingBookings.length === 0;
};
