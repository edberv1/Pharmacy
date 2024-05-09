const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middlewares/authMiddleware');
const {getUserProfile, updateUserProfile, changePassword} = require('../controllers/adminController');


router.get("/getUserProfile", authMiddleware,  getUserProfile);
router.put("/updateUserProfile", authMiddleware,  updateUserProfile);
router.post("/changePassword", authMiddleware, changePassword)

module.exports = router;
