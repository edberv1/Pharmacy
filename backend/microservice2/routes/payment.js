const express = require('express');
const router = express.Router();
const {addToCart, getCart, deleteFromCart, createCheckoutSession} = require('../controllers/paymentController');

router.post('/add-to-cart', addToCart);
router.get('/get-cart', getCart);
router.delete('/delete-from-cart/:userId/:itemId', deleteFromCart);
router.post('/create-checkout-session', createCheckoutSession);


module.exports = router;