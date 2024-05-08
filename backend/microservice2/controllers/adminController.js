const db = require("../db.js");
const User = require('../models/userModel.js');

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


module.exports = {getUserProfile};
