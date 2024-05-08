const User = require('../models/userModel');
const db = require('../db.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
require('dotenv').config();

const signup = (req, res) => {
  let newUser = new User(req.body);
  User.addUser(newUser, function(err, user) {
    // Check the fields are not empty
    if (!newUser.firstname || !newUser.lastname || !newUser.email || !newUser.password) {
        return res.status(400).json({ error: "All fields are required." });
        }
      if (err) {
          if (err.message === 'User already exists') {
              res.status(400).send('User already exists');
          } else {
              res.send(err);
          }
      } else {
          // Create a token
          const token = jwt.sign({ id: user.id }, "pharmacy", {
            expiresIn: 86400 // expires in 24 hours
        });
          res.status(200).send({ auth: true, token: token});
      }
  });
}


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT users.*, roles.role FROM users INNER JOIN roles ON users.roleId = roles.id WHERE email = ?";
  const values = [email];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Database error.' });
    }

    if (result.length === 0) {
      return res.status(401).send({ auth: false, message: 'User not found.' });
    }

    const user = result[0];

    bcrypt.compare(password, user.password, (err, response) => {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to compare passwords.' });
      }

      if (!response) {
        return res.status(401).send({ auth: false, message: 'Wrong email/password combination.' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, "pharmacy", {
        expiresIn: 21600, // 6 hours
      });

      res.json({
        auth: true,
        token: token,
        role: user.role,
        email: user.email, 
      });
    });
  });
};

const getLoginUser = async (req, res) => {
  const token = req.headers['x-access-token'];
  
  if (!token) {
    return res.send({ loggedIn: false });
  }

  jwt.verify(token, "pharmacy", (err, decoded) => {
    if (err) {
      return res.send({ loggedIn: false });
    }

    // You could query your database here to get more user information if needed
    res.send({ loggedIn: true, user: { id: decoded.id, role: decoded.role } });
  });
};

const logoutUser = (req, res) => {
  res.status(200).send({ auth: false, token: null });
};

 module.exports = { signup, loginUser, getLoginUser, logoutUser};
