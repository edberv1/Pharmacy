const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middlewares/authMiddleware');
const {getUserProfile, updateUserProfile, changePassword, getAllProducts,getPharmaciesForUser, createProduct, editProduct, deleteProduct, getPharmacyById, getPharmacyProducts } = require('../controllers/adminController');


router.get("/getUserProfile", authMiddleware,  getUserProfile);
router.put("/updateUserProfile", authMiddleware,  updateUserProfile);
router.post("/changePassword", authMiddleware, changePassword);

router.get("/getAllProducts", authMiddleware, getAllProducts);
router.post("/createProduct", authMiddleware, createProduct);
router.delete('/deleteProduct/:id', authMiddleware, deleteProduct); 
router.put('/editProduct/:id',  authMiddleware, editProduct);

router.get("/getPharmaciesForUser", authMiddleware, getPharmaciesForUser);
router.get("/myPharmacies/:id", authMiddleware, getPharmacyById);
router.get("/getPharmacyProducts/:id" , authMiddleware , getPharmacyProducts);

router.get('/');

module.exports = router;
