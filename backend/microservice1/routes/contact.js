const express = require('express')
const router = express.Router()
const {contactUs, getAllEmails, deleteEmail,contactChart} = require('../controllers/ContactController')
const authMiddleware = require('../../microservice2/middlewares/authMiddleware')

router.delete('/email/:_id', authMiddleware, deleteEmail);
router.post('/', contactUs);
router.get('/getAllEmails', authMiddleware, getAllEmails);
router.get('/contactChart', authMiddleware, contactChart)

module.exports = router