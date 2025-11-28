
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Mock database (would use MongoDB, PostgreSQL, etc. in production)
const db = {
  users: [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@um-surabaya.ac.id',
      password: '$2a$10$8Ux7Nfu.iQKbGJdQEBeUr.p5RFNmL0KvR3s4gJG9oZNmWH3pB1Di2', // admin123
      role: 'admin',
      status: 'active',
      department: 'Information Technology',
      phone: '+62-812-3456-7890',
      bio: 'System administrator responsible for classroom management system.'
    },
    {
      id: '2',
      name: 'Teacher User',
      email: 'teacher@um-surabaya.ac.id',
      password: '$2a$10$z0u2m9RG2Zj6J0BvSGqpCeBCbmjRzQSEhm.z1yDXDm0DRdw16TifO', // teacher123
      role: 'teacher',
      status: 'active',
      department: 'Computer Science',
      phone: '+62-876-5432-1098',
      bio: 'Computer Science professor specializing in artificial intelligence and machine learning.'
    }
  ],
  buildings: [],
  classrooms: [],
  bookings: []
};

// Import mock data
const { mockBuildings, mockClassrooms, mockBookings } = require('./mockData');
db.buildings = mockBuildings;
db.classrooms = mockClassrooms;
db.bookings = mockBookings;

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET_KEY || 'um-surabaya-secret-key';

// Utility functions
function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Routes
// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = db.users.find(u => u.email === email);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  // Remove password from user object
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    user: userWithoutPassword,
    token: generateToken(user)
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role = 'teacher' } = req.body;
  
  // Check if user already exists
  if (db.users.some(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  // Create new user
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  
  db.users.push(newUser);
  
  // Remove password from response
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    user: userWithoutPassword,
    token: generateToken(newUser)
  });
});

app.get('/api/auth/user', authenticateToken, (req, res) => {
  const user = db.users.find(u => u.id === req.user.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;
  
  res.json(userWithoutPassword);
});

// Buildings routes
app.get('/api/buildings', authenticateToken, (req, res) => {
  res.json(db.buildings);
});

app.post('/api/buildings', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const { name, location, description, floors } = req.body;
  
  const newBuilding = {
    id: uuidv4(),
    name,
    location,
    description: description || '',
    floors: floors || 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  db.buildings.push(newBuilding);
  
  res.status(201).json(newBuilding);
});

app.put('/api/buildings/:id', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const { id } = req.params;
  const buildingIndex = db.buildings.findIndex(b => b.id === id);
  
  if (buildingIndex === -1) {
    return res.status(404).json({ error: 'Building not found' });
  }
  
  const updatedBuilding = {
    ...db.buildings[buildingIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  db.buildings[buildingIndex] = updatedBuilding;
  
  res.json(updatedBuilding);
});

app.delete('/api/buildings/:id', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const { id } = req.params;
  const buildingIndex = db.buildings.findIndex(b => b.id === id);
  
  if (buildingIndex === -1) {
    return res.status(404).json({ error: 'Building not found' });
  }
  
  // Check if there are classrooms in this building
  const hasClassrooms = db.classrooms.some(c => c.buildingId === id);
  
  if (hasClassrooms) {
    return res.status(400).json({ error: 'Cannot delete building with existing classrooms' });
  }
  
  db.buildings.splice(buildingIndex, 1);
  
  res.status(204).send();
});

// Classrooms routes
app.get('/api/classrooms', authenticateToken, (req, res) => {
  const { buildingId } = req.query;
  
  let classrooms = [...db.classrooms];
  
  if (buildingId) {
    classrooms = classrooms.filter(c => c.buildingId === buildingId);
  }
  
  res.json(classrooms);
});

app.post('/api/classrooms', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const { buildingId, name, capacity, floor, hasProjector, hasAC, isComputerLab, description } = req.body;
  
  // Validate building exists
  const buildingExists = db.buildings.some(b => b.id === buildingId);
  
  if (!buildingExists) {
    return res.status(400).json({ error: 'Building not found' });
  }
  
  const newClassroom = {
    id: uuidv4(),
    buildingId,
    name,
    capacity: capacity || 0,
    floor: floor || 1,
    hasProjector: hasProjector || false,
    hasAC: hasAC || false,
    isComputerLab: isComputerLab || false,
    description: description || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  db.classrooms.push(newClassroom);
  
  res.status(201).json(newClassroom);
});

app.put('/api/classrooms/:id', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const { id } = req.params;
  const classroomIndex = db.classrooms.findIndex(c => c.id === id);
  
  if (classroomIndex === -1) {
    return res.status(404).json({ error: 'Classroom not found' });
  }
  
  const updatedClassroom = {
    ...db.classrooms[classroomIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  db.classrooms[classroomIndex] = updatedClassroom;
  
  res.json(updatedClassroom);
});

app.delete('/api/classrooms/:id', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const { id } = req.params;
  const classroomIndex = db.classrooms.findIndex(c => c.id === id);
  
  if (classroomIndex === -1) {
    return res.status(404).json({ error: 'Classroom not found' });
  }
  
  // Check if there are bookings for this classroom
  const hasBookings = db.bookings.some(b => b.classroomId === id);
  
  if (hasBookings) {
    return res.status(400).json({ error: 'Cannot delete classroom with existing bookings' });
  }
  
  db.classrooms.splice(classroomIndex, 1);
  
  res.status(204).send();
});

// Bookings routes
app.get('/api/bookings', authenticateToken, (req, res) => {
  const { userId } = req.query;
  
  let bookings = [...db.bookings];
  
  // If user is a teacher, only return their bookings
  if (req.user.role === 'teacher' && !userId) {
    bookings = bookings.filter(b => b.userId === req.user.userId);
  } else if (userId) {
    bookings = bookings.filter(b => b.userId === userId);
  }
  
  res.json(bookings);
});

app.post('/api/bookings', authenticateToken, (req, res) => {
  const { classroomId, date, startTime, endTime, purpose, attendees } = req.body;
  
  // Validate classroom exists
  const classroom = db.classrooms.find(c => c.id === classroomId);
  
  if (!classroom) {
    return res.status(400).json({ error: 'Classroom not found' });
  }
  
  // Check availability
  const isAvailable = !db.bookings.some(b => 
    b.classroomId === classroomId && 
    b.date === date && 
    ((b.startTime <= startTime && b.endTime > startTime) ||
     (b.startTime < endTime && b.endTime >= endTime) ||
     (startTime <= b.startTime && endTime >= b.endTime))
  );
  
  if (!isAvailable) {
    return res.status(400).json({ error: 'Classroom is not available for the selected time' });
  }
  
  // Get user info
  const user = db.users.find(u => u.id === req.user.userId);
  
  const newBooking = {
    id: uuidv4(),
    classroomId,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    date,
    startTime,
    endTime,
    purpose: purpose || '',
    status: req.user.role === 'admin' ? 'confirmed' : 'pending',
    attendees: attendees || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  db.bookings.push(newBooking);
  
  res.status(201).json(newBooking);
});

app.put('/api/bookings/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const bookingIndex = db.bookings.findIndex(b => b.id === id);
  
  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  
  const currentBooking = db.bookings[bookingIndex];
  
  // Check permission - only admin or booking owner can update
  if (req.user.role !== 'admin' && req.user.userId !== currentBooking.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // If date or time changed, check availability
  if (
    (req.body.date && req.body.date !== currentBooking.date) ||
    (req.body.startTime && req.body.startTime !== currentBooking.startTime) ||
    (req.body.endTime && req.body.endTime !== currentBooking.endTime)
  ) {
    const isAvailable = !db.bookings.some(b => 
      b.id !== id &&
      b.classroomId === (req.body.classroomId || currentBooking.classroomId) &&
      b.date === (req.body.date || currentBooking.date) &&
      ((b.startTime <= (req.body.startTime || currentBooking.startTime) && 
        b.endTime > (req.body.startTime || currentBooking.startTime)) ||
       (b.startTime < (req.body.endTime || currentBooking.endTime) && 
        b.endTime >= (req.body.endTime || currentBooking.endTime)) ||
       ((req.body.startTime || currentBooking.startTime) <= b.startTime && 
        (req.body.endTime || currentBooking.endTime) >= b.endTime))
    );
    
    if (!isAvailable) {
      return res.status(400).json({ error: 'Classroom is not available for the selected time' });
    }
  }
  
  const updatedBooking = {
    ...currentBooking,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  db.bookings[bookingIndex] = updatedBooking;
  
  res.json(updatedBooking);
});

app.delete('/api/bookings/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const bookingIndex = db.bookings.findIndex(b => b.id === id);
  
  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  
  const booking = db.bookings[bookingIndex];
  
  // Check permission - only admin or booking owner can delete
  if (req.user.role !== 'admin' && req.user.userId !== booking.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  db.bookings.splice(bookingIndex, 1);
  
  res.status(204).send();
});

// Availability routes
app.get('/api/availability/:classroomId', authenticateToken, (req, res) => {
  const { classroomId } = req.params;
  const { date } = req.query;
  
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }
  
  // Get classroom
  const classroom = db.classrooms.find(c => c.id === classroomId);
  
  if (!classroom) {
    return res.status(404).json({ error: 'Classroom not found' });
  }
  
  // Get building
  const building = db.buildings.find(b => b.id === classroom.buildingId);
  
  if (!building) {
    return res.status(404).json({ error: 'Building not found' });
  }
  
  // Generate time slots
  const timeSlots = [];
  
  for (let hour = 8; hour < 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startHour = hour.toString().padStart(2, '0');
      const startMinute = minute.toString().padStart(2, '0');
      
      const endHour = minute === 30 ? 
        (hour + 1).toString().padStart(2, '0') : 
        hour.toString().padStart(2, '0');
      const endMinute = minute === 30 ? '00' : '30';
      
      const start = `${startHour}:${startMinute}`;
      const end = `${endHour}:${endMinute}`;
      
      const bookingsForSlot = db.bookings.filter(booking => {
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
  
  res.json({
    classroom,
    building,
    date,
    timeSlots,
  });
});

// Users routes
app.get('/api/users', authenticateToken, (req, res) => {
  // Only admin can list all users
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Return users without passwords
  const usersWithoutPasswords = db.users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  
  res.json(usersWithoutPasswords);
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userIndex = db.users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Check permission - only admin or the user themselves can update
  if (req.user.role !== 'admin' && req.user.userId !== id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Don't allow role changes unless admin
  if (req.body.role && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Cannot change role' });
  }
  
  // Handle password change
  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }
  
  const updatedUser = {
    ...db.users[userIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  db.users[userIndex] = updatedUser;
  
  // Return user without password
  const { password, ...userWithoutPassword } = updatedUser;
  
  res.json(userWithoutPassword);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing

