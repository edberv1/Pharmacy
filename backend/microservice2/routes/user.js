const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const superAdminController = require('../controllers/superAdminController');
const adminController = require("../controllers/adminController");
const { signup, loginUser } = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', loginUser);
router.get("/admin", authMiddleware([2]), adminController);
router.get('/superadmin', authMiddleware([1]), superAdminController);

module.exports = router;
