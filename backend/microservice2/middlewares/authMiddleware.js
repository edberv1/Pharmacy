const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }
  if (typeof token !== 'string' || !token.includes('.')) {
    return res.status(400).send({ auth: false, message: 'Malformed token.' });
  }
  
  jwt.verify(token, "pharmacy", (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token: ' + err.message });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = authMiddleware;
