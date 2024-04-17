const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middlewares/authMiddleware');
const {getAllUsers, createUser} = require('../controllers/superAdminController');

router.get('/superadmin',  authMiddleware);
router.get('/getAllUsers',  authMiddleware, getAllUsers);
router.post('/createUser',  authMiddleware, createUser);

module.exports = router;
