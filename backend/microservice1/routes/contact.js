const express = require('express')
const router = express.Router()
const {contactUs} = require('../controllers/ContactController')

router.post('/', contactUs);

module.exports = router