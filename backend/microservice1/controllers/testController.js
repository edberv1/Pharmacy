const User = require('../models/testModel');



const getAllMongoUsers = async (req, res) => {
    try {
      const users = await User.find(); // Retrieve all users from the database
      console.log(users); // Log the users
      res.status(200).json(users); // Send the users as a JSON response
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  


module.exports = {
    getAllMongoUsers
  }