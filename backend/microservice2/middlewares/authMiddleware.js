const jwt = require('jsonwebtoken');

const authMiddleware = (roles) => {
  return (req, res, next) => {
    // Get token from headers
    const token = req.headers['x-access-token'];

    if (!token) {
      return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    // Verify token
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      }

      // Check if user's role is authorized
      if (!roles.includes(decoded.roleId)) {
        return res.status(401).send({ auth: false, message: 'Unauthorized!' });
      }

      // Save user id to request for use in other routes
      req.userId = decoded.id;
      next();
    });
  };
};

module.exports = authMiddleware;
