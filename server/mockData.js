
// Mock data for buildings, classrooms, and bookings
const { v4: uuidv4 } = require('uuid');

// Helper function to generate timestamps
const getCurrentTimestamp = () => new Date().toISOString();

// Mock buildings
const mockBuildings = [
  {
    id: "b1",
    name: "Engineering Building",
    location: "North Campus",
    description: "Main engineering faculty building with classrooms and labs",
    floors: 5,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: "b2",
    name: "Science Building",
    location: "East Campus",
    description: "Houses science departments and research facilities",
    floors: 4,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: "b3",
    name: "Technology Hub",
    location: "South Campus",
    description: "Modern technology and computer science facility",
    floors: 3,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  }
];

// Mock classrooms
const mockClassrooms = [
  {
    id: "c1",
    buildingId: "b1",
    name: "E101",
    capacity: 35,
    floor: 1,
    hasProjector: true,
    hasAC: true,
    isComputerLab: false,
    description: "Standard lecture room with projector and whiteboard",
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: "c2",
    buildingId: "b1",
    name: "E202",
    capacity: 50,
    floor: 2,
    hasProjector: true,
    hasAC: true,
    isComputerLab: false,
    description: "Large lecture hall with tiered seating",
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: "c3",
    buildingId: "b1",
    name: "E305",
    capacity: 25,
    floor: 3,
    hasProjector: true,
    hasAC: true,
    isComputerLab: true,
    description: "Computer lab with 25 workstations",
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: "c4",
    buildingId: "b2",
    name: "S101",
    capacity: 40,
    floor: 1,
    hasProjector: true,
    hasAC: true,
    isComputerLab: false,
    description: "Science lecture room with demonstration table",
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: "c5",
    buildingId: "b2",
    name: "S205",
    capacity: 30,
    floor: 2,
    hasProjector: true,
    hasAC: true,
    isComputerLab: false,
    description: "Biology lab with microscope stations",
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: "c6",
    buildingId: "b3",
    name: "T101",
    capacity: 60,
    floor: 1,
    hasProjector: true,
    hasAC: true,
    isComputerLab: true,
    description: "Large computer lab with advanced workstations",
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  }
];

// Mock bookings
const mockBookings = [
  {
    id: "bk1",
    classroomId: "c1",
    userId: "2",
    userName: "Teacher User",
    userEmail: "teacher@um-surabaya.ac.id",
    date: "2025-04-20",
    startTime: "09:00",
    endTime: "11:00",
    purpose: "Introduction to Programming Lecture",
    status: "confirmed",
    attendees: 30,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: "bk2",
    classroomId: "c3",
    userId: "2",
    userName: "Teacher User",
    userEmail: "teacher@um-surabaya.ac.id",
    date: "2025-04-21",
    startTime: "13:00",
    endTime: "15:00",
    purpose: "Advanced Programming Lab",
    status: "confirmed",
    attendees: 20,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: "bk3",
    classroomId: "c4",
    userId: "2",
    userName: "Teacher User",
    userEmail: "teacher@um-surabaya.ac.id",
    date: "2025-04-22",
    startTime: "10:00",
    endTime: "12:00",
    purpose: "Physics Demonstration",
    status: "pending",
    attendees: 35,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  }
];

// Helper functions for mock operations
function isRoomAvailable(classroomId, date, startTime, endTime, excludeBookingId = null) {
  return !mockBookings.some(
    (booking) =>
      booking.classroomId === classroomId &&
      booking.date === date &&
      booking.id !== excludeBookingId &&
      ((booking.startTime <= startTime && booking.endTime > startTime) ||
        (booking.startTime < endTime && booking.endTime >= endTime) ||
        (startTime <= booking.startTime && endTime >= booking.endTime))
  );
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

function generateUniqueId() {
  return uuidv4();
}

module.exports = {
  mockBuildings,
  mockClassrooms,
  mockBookings,
  getCurrentTimestamp,
  isRoomAvailable,
  formatDate,
  generateUniqueId
};
