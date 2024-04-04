const mongoose = require('mongoose');

// Define the User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: String,
}, 
{ timestamps: true });

// Register the User model with Mongoose
mongoose.model('user', UserSchema);

module.exports = mongoose.model('user', UserSchema);
