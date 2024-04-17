const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middlewares/authMiddleware');
const {getAllUsers, createUser, deleteUser, editUser} = require('../controllers/superAdminController');

router.get('/superadmin',  authMiddleware);
router.get('/getAllUsers',  authMiddleware, getAllUsers);
router.post('/createUser',  authMiddleware, createUser);
router.delete('/deleteUser/:id', authMiddleware, deleteUser); 
router.put('/editUser/:id',  authMiddleware, editUser);

module.exports = router;
