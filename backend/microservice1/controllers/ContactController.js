//controlleri post qet requestin

//const const contactUs = (req, res) => {


//module.

// controllers/ContactController.js
const Contact = require('../models/ContactModel'); // Update the path

const contactUs = (req, res) => {
  const { fullName, emailAddress, message } = req.body;

  // Create a new contact instance
  const contact = new Contact({
    fullName,
    emailAddress,
    message
  });

  // Save the contact to the database
  contact.save()
    .then((savedContact) => {
      // Send a success response
      res.status(201).json(savedContact);
    })
    .catch((error) => {
      // Handle errors
      res.status(400).json({ error: error.message });
    });
};

module.exports = {
  contactUs
};
