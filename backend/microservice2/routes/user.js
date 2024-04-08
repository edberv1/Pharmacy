const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware')
const {signupUser} = require('../controllers/userController')


// signup route
router.post('/signup',  signupUser)

module.exports = router