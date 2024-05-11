const express = require('express');
const router = express.Router();
const { signup, loginUser, getLoginUser, logoutUser, verify, refresh, getAllPharmacies, getPharmacyById, getUserById} = require('../controllers/userController');
const { getUserById } = require('../models/userModel');

router.post('/signup', signup);
router.post('/login', loginUser);
router.get('/login', getLoginUser)
router.post('/logoutUser', logoutUser)
router.get('/verify' , verify)
router.get('/refresh', refresh)

router.get('/getAllPharmacies' , getAllPharmacies)
router.get('/pharmacies/:id', getPharmacyById);
router.get('getUserById/:id', getUserById)

module.exports = router;
