const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_123';

module.exports = function (req, res, next) {
  const token = req.cookies.token || (req.header('Authorization') && req.header('Authorization').split(' ')[1]);

  if (!token) return res.status(401).json({ message: 'Authorization denied, please login again' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
