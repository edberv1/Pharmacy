const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middlewares/authMiddleware');
const {getAllUsers} = require('../controllers/superAdminController');

router.get('/superadmin',  authMiddleware);
router.get('/getAllUsers',  authMiddleware, getAllUsers);

module.exports = router;
