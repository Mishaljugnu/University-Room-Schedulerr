
const { v4: uuidv4 } = require('uuid');

// In-memory mock database
const database = {
  users: [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@university.edu',
      password: '$2a$10$8Ux7Nfu.iQKbGJdQEBeUr.p5RFNmL0KvR3s4gJG9oZNmWH3pB1Di2', // hashed password
      role: 'admin',
      status: 'active'
    }
  ],
  buildings: [],
  classrooms: [],
  bookings: []
};

module.exports = {
  database,
  generateId: () => uuidv4()
};
