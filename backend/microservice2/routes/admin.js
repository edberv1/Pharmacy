const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middlewares/authMiddleware');
const adminController = require("../controllers/adminController");



router.get("/admin",  authMiddleware, adminController);


module.exports = router;
