const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middlewares/authMiddleware');
const superAdminController = require('../controllers/superAdminController');
const adminController = require("../controllers/adminController");
const { signup, loginUser, getLoginUser } = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', loginUser);
router.get('/login', getLoginUser)
router.get("/admin",  authMiddleware, adminController);
router.get('/superadmin',  authMiddleware, superAdminController);

module.exports = router;
