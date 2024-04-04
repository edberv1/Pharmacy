const express = require('express')
const router = express.Router()
const { getAllMongoUsers, addUser} = require('../controllers/userController')

// get all users
router.get('/getAllMongoUsers', getAllMongoUsers);

router.post('/addUser', addUser);


module.exports = router