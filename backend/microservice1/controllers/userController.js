const userModel = require('../models/userModel');



  const getAllMongoUsers = async (req, res) => {
    try {
      const users = await userModel.find(); // Retrieve all users from the database
      console.log(users); // Log the users
      res.status(200).json(users); // Send the users as a JSON response
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const addUser = async (req, res) => {
    const user = new userModel(req.body);
    try {
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  module.exports = {
    getAllMongoUsers, addUser
  }