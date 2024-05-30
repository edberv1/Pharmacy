const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middlewares/authMiddleware');
const {deleteOldLogins, getDailyLogins, getDailyRegistrations, getPharmacyCountAndGrowth, getAllUsers, createUser, deleteUser, editUser, getAllRoles, createRole, deleteRole, editRole , getAllPharmacies, getAllAdminUserIds, createPharmacy, getAllUserIds, deletePharmacy, editPharmacy, getUserGrowth, getAdminGrowth, fetchPendingLicenses, approveUser,declineUser, getProductGrowth, downloadLicense, generateExcel, generatePharmacies, pendingCount, getLocationChart} = require('../controllers/superAdminController');


router.get('/superadmin',  authMiddleware);

//=====================================USERS=====================================
router.get('/getAllUsers',  authMiddleware, getAllUsers);
router.post('/createUser',  authMiddleware, createUser);
router.delete('/deleteUser/:id', authMiddleware, deleteUser); 
router.put('/editUser/:id',  authMiddleware, editUser);
router.get('/generateExcel',  authMiddleware, generateExcel);
router.get('/generatePharmacies',  authMiddleware, generatePharmacies);



router.get('/getAllUserIds',  authMiddleware, getAllUserIds);
router.get('/getAllAdminUserIds',  authMiddleware, getAllAdminUserIds);

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


//==================================STATISTICS=======================================
router.get('/getUserGrowth', authMiddleware, getUserGrowth);
router.get('/getAdminGrowth', authMiddleware, getAdminGrowth);
router.get('/getPharmacyCountAndGrowth', authMiddleware, getPharmacyCountAndGrowth)
router.get('/getDailyRegistrations', authMiddleware, getDailyRegistrations)
router.get('/getDailyLogins', authMiddleware, getDailyLogins)
router.get('/fetchPendingLicenses', authMiddleware, fetchPendingLicenses)
router.get('/getProductGrowth', authMiddleware, getProductGrowth)
router.get('/deleteOldLogins', deleteOldLogins);

//====================================REQUESTS========================================
router.post('/approveUser',  authMiddleware, approveUser);
router.post('/declineUser',  authMiddleware, declineUser);
router.get('/downloadLicense/:id', downloadLicense);
router.get('/pendingCount', authMiddleware, pendingCount);
router.get('/getLocationChart', authMiddleware, getLocationChart)


module.exports = router;
