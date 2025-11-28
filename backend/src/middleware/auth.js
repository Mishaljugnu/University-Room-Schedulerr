
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role }, 
    process.env.JWT_SECRET_KEY, 
    { expiresIn: '7d' }
  );
};

module.exports = { authenticateToken, generateToken };
