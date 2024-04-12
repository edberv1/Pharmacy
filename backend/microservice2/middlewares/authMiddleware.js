// authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers['x-access-token'];
  console.log("Received Token:", token); // Log the received token
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