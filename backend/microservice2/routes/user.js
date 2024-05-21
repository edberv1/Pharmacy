const express = require('express');
const router = express.Router();
const { signup, loginUser, getLoginUser, logoutUser, verify, refresh, getAllPharmacies, getPharmacyById, submitLicense, requestPasswordReset, resetPassword, getProductsByUserId, getProductsByPharmacyId, getUserProfileClient,updateUserProfileClient, changePasswordClient} = require('../controllers/userController');
const upload = require('../services/fileUpload');
const authMiddleware  = require('../middlewares/authMiddleware');
const path = require('path');
const app = express();

router.post('/signup', signup);
router.post('/login', loginUser);
router.get('/login', getLoginUser)
router.post('/logoutUser', logoutUser)
router.get('/verify' , verify)
router.get('/refresh', refresh)
router.get('/getAllPharmacies' , getAllPharmacies)
router.get('/pharmacies/:id', getPharmacyById);
router.post('/submitLicense', upload, submitLicense);
router.post('/requestPasswordReset', requestPasswordReset);
router.post('/resetPassword', resetPassword);
router.get('/:id/products', getProductsByUserId);
router.get('/pharmacies/:pharmacyId/products/:productId', getProductsByPharmacyId)
router.get("/getUserProfileClient", authMiddleware,  getUserProfileClient); 
router.put("/updateUserProfileClient", authMiddleware,  updateUserProfileClient);
router.post("/changePasswordClient", authMiddleware, changePasswordClient);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


module.exports = router;


