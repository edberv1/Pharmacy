const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middlewares/authMiddleware');
const {getAllUsers, createUser, deleteUser, editUser, getAllRoles, createRole} = require('../controllers/superAdminController');

// =====================================USERS=====================================
router.get('/superadmin',  authMiddleware);
router.get('/getAllUsers',  authMiddleware, getAllUsers);
router.post('/createUser',  authMiddleware, createUser);
router.delete('/deleteUser/:id', authMiddleware, deleteUser); 
router.put('/editUser/:id',  authMiddleware, editUser);


// =====================================ROLES=====================================
router.get('/getAllRoles',  authMiddleware, getAllRoles);
router.post('/createRole',  authMiddleware, createRole);

module.exports = router;
