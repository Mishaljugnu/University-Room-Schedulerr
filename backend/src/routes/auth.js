
const express = require('express');
const bcrypt = require('bcryptjs');
const { database, generateId } = require('../config/database');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = database.users.find(u => u.email === email);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    user: userWithoutPassword,
    token: generateToken(user)
  });
});

router.post('/register', (req, res) => {
  const { name, email, password, role = 'teacher' } = req.body;
  
  if (database.users.some(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  const newUser = {
    id: generateId(),
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role,
    status: 'active'
  };
  
  database.users.push(newUser);
  
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    user: userWithoutPassword,
    token: generateToken(newUser)
  });
});

module.exports = router;
