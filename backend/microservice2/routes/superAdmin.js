const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middlewares/authMiddleware');
const {deleteOldLogins, getDailyLogins, getDailyRegistrations, getPharmacyCountAndGrowth, getAllUsers, createUser, deleteUser, editUser, getAllRoles, createRole, deleteRole, editRole , getAllPharmacies ,createPharmacy, getAllUserIds, deletePharmacy, editPharmacy, getUserGrowth, getAdminGrowth, fetchPendingLicenses, approveUser,declineUser, getProductGrowth} = require('../controllers/superAdminController');


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
router.delete('/deletePharmacy/:id', authMiddleware, deletePharmacy); 
router.put('/editPharmacy/:id',  authMiddleware, editPharmacy);
router.get('/getUserGrowth', authMiddleware, getUserGrowth);
router.get('/getAdminGrowth', authMiddleware, getAdminGrowth);
router.get('/getPharmacyCountAndGrowth', authMiddleware, getPharmacyCountAndGrowth)
router.get('/getDailyRegistrations', authMiddleware, getDailyRegistrations)
router.get('/getDailyLogins', authMiddleware, getDailyLogins)
router.get('/fetchPendingLicenses', authMiddleware, fetchPendingLicenses)
router.post('/approveUser',  authMiddleware, approveUser);
router.post('/declineUser',  authMiddleware, declineUser);
router.get('/deleteOldLogins', deleteOldLogins);
router.get('/getProductGrowth', authMiddleware, getProductGrowth)




module.exports = router;
