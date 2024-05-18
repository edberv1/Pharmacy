const express = require('express')
const router = express.Router()
const {contactUs} = require('../controllers/ContactController')

router.post('/', contactUs);

module.exports = router
// const express = require('express');
// const router = express.Router();
// const { contactUs } = require('../controllers/ContactController'); // Update the path

// router.post('/contacts', contactUs);

// module.exports = router;