const express = require('express');
const router = express.Router();
const { signup, loginUser, getLoginUser, logoutUser, verify, refresh, getAllPharmacies, getPharmacyById, getUserById, submitLicense} = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', loginUser);
router.get('/login', getLoginUser)
router.post('/logoutUser', logoutUser)
router.get('/verify' , verify)
router.get('/refresh', refresh)
router.get('getUserById/:id', getUserById)
router.get('/getAllPharmacies' , getAllPharmacies)
router.get('/pharmacies/:id', getPharmacyById);
router.post('/submitLicense', submitLicense)

module.exports = router;



