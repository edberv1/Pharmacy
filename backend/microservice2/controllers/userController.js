const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signup = (req, res) => {
  let newUser = new User(req.body);
  User.addUser(newUser, function(err, user) {
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


module.exports = {
   signup 
}
