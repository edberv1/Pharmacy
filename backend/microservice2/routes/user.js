const express = require('express');
const router = express.Router();
const { signup, loginUser, getLoginUser, logoutUser, verify, refresh, getAllPharmacies, getPharmacyById, getUserById, submitLicense, requestPasswordReset, resetPassword, getProductsByUserId, getProductsByPharmacyId} = require('../controllers/userController');
const upload = require('../services/fileUpload');

router.post('/signup', signup);
router.post('/login', loginUser);
router.get('/login', getLoginUser)
router.post('/logoutUser', logoutUser)
router.get('/verify' , verify)
router.get('/refresh', refresh)
router.get('getUserById/:id', getUserById)
router.get('/getAllPharmacies' , getAllPharmacies)
router.get('/pharmacies/:id', getPharmacyById);
router.post('/submitLicense', upload, submitLicense);
router.post('/requestPasswordReset', requestPasswordReset);
router.post('/resetPassword', resetPassword);
router.get('/:id/products', getProductsByUserId);
router.get('/pharmacies/:pharmacyId/products/:productId', getProductsByPharmacyId)



module.exports = router;


