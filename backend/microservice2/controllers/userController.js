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
          const token = jwt.sign({ id: user }, process.env.SECRET, {
              expiresIn: 86400 // expires in 24 hours
          });
          res.status(200).send({ auth: true, token: token });
      }
  });
}

const loginUser = async (req, res) => {
    // Grab data from request body
    const { email, password } = req.body;
  
    // Check the fields are not empty
    if (!email || !password) {
        return res.status(400).send("All fields are required."); // Incorrect email
    }
  
    try {
      // Query the database for user with given email
      const query = 'SELECT * FROM users WHERE email = ?';
      db.query(query, [email], async (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
  
        // Check if user exists
        if (results.length === 0) {
            return res.status(400).send("Incorrect email. Please try again."); // Incorrect email
        }
  
        const user = results[0];
  
        // Check password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).send("Incorrect password. Please try again."); // Incorrect password
        }
  
        // Create a token
        const token = jwt.sign({ id: user.id }, process.env.SECRET, {
          expiresIn: 86400 // expires in 24 hours
        });
  
        res.status(200).send({ auth: true, token: token });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


 module.exports = { signup, loginUser };
