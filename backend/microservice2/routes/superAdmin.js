const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middlewares/authMiddleware');
const {getAllUsers, createUser, deleteUser, editUser, getAllRoles, createRole, deleteRole, editRole , getAllPharmacies ,createPharmacy, getAllUserIds, getAllRoleIds} = require('../controllers/superAdminController');


router.get('/superadmin',  authMiddleware);

//=====================================USERS=====================================
router.get('/getAllUsers',  authMiddleware, getAllUsers);
router.post('/createUser',  authMiddleware, createUser);
router.delete('/deleteUser/:id', authMiddleware, deleteUser); 
router.put('/editUser/:id',  authMiddleware, editUser);

router.get('/getAllUserIds',  authMiddleware, getAllUserIds);

//=====================================ROLES=====================================
router.get('/getAllRoles',  authMiddleware, getAllRoles);
router.post('/createRole',  authMiddleware, createRole);
router.delete('/deleteRole/:id', authMiddleware, deleteRole); 
router.put('/editRole/:id',  authMiddleware, editRole);

//=====================================PHARMACIES=====================================
router.get("/getAllPharmacies",  authMiddleware, getAllPharmacies);
router.post('/createPharmacy',  authMiddleware, createPharmacy);

module.exports = router;
