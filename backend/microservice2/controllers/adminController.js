const db = require("../db.js");
const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');

const getUserProfile = (req, res) => {
  const userId = req.userId; // assuming the userId is set in the request

  User.getUserById(userId, function(err, user) {
    if (err) {
      res.status(500).send({ message: 'Database error.' });
    } else if (!user) {
      res.status(404).send({ message: 'User not found.' });
    } else {
      res.status(200).send(user);
    }
  });
};

const updateUserProfile = (req, res) => {
    const { firstName, lastName } = req.body;

  // SQL query to update the user profile
  const sql = `UPDATE users SET firstname = ?, lastname = ?`;

  // Execute the query
  db.query(sql, [firstName, lastName], (err, result) => {
    if (err) {
      console.error('Error updating user profile: ', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      res.status(200).json({ message: 'User profile updated successfully' });
    }
  });
  };
 
  const changePassword = (req, res) => {
    const { currentPassword, newPassword } = req.body;
  
    User.getUserById(req.userId, function(err, user) {
      if (err) {
        res.status(500).send({ message: 'Database error.' });
      } else if (!user) {
        res.status(404).send({ message: 'User not found.' });
      } else {
        // Check if the current password is correct
        if (bcrypt.compareSync(currentPassword, user[0].password)) { // Change this line
          // Hash the new password
          const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
  
          // SQL query to update the user password
          const sql = `UPDATE users SET password = ? WHERE id = ?`;
  
          // Execute the query
          db.query(sql, [hashedNewPassword, req.userId], (err, result) => {
            if (err) {
              console.error('Error updating user password: ', err);
              res.status(500).json({ message: 'Server error' });
            } else {
              res.status(200).json({ message: 'Password updated successfully' });
            }
          });
        } else {
          res.status(403).json({ message: 'Current password is incorrect.' });
        }
      }
    });
  };
  

module.exports = {getUserProfile, updateUserProfile, changePassword};
