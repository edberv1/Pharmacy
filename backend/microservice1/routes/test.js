const express = require('express')
const router = express.Router()
const { getAllMongoUsers} = require('../controllers/testController')

// get all users
router.get('/getAllMongoUsers', getAllMongoUsers);


module.exports = router