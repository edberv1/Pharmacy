// models/ContactModel.js
const mongoose = require('mongoose');

// Define the schema for a contact
const contactSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  emailAddress: {
    type: String,
    required: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  message: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Create the model from the schema
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
