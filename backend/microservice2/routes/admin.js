const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middlewares/authMiddleware');
const {getUserProfile} = require('../controllers/adminController');


router.get("/getUserProfile", authMiddleware,  getUserProfile);

module.exports = router;
