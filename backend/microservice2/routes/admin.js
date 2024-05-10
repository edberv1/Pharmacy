const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middlewares/authMiddleware');
const {getUserProfile, updateUserProfile, changePassword, getAllProducts,getPharmaciesForUser, createProduct, editProduct, deleteProduct} = require('../controllers/adminController');


router.get("/getUserProfile", authMiddleware,  getUserProfile);
router.put("/updateUserProfile", authMiddleware,  updateUserProfile);
router.post("/changePassword", authMiddleware, changePassword);

router.get("/getAllProducts", authMiddleware, getAllProducts);
router.get("/getPharmaciesForUser", authMiddleware, getPharmaciesForUser);
router.post("/createProduct", authMiddleware, createProduct);
router.delete('/deleteProduct/:id', authMiddleware, deleteProduct); 
router.put('/editProduct/:id',  authMiddleware, editProduct);

module.exports = router;
