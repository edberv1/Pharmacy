// models/ContactModel.js
const mongoose = require('mongoose');

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
  timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;

