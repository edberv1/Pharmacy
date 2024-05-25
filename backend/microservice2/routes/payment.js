const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {addToCart, getCart, deleteFromCart, createCheckoutSession, handlePaymentSuccess} = require('../controllers/paymentController');

router.post('/add-to-cart', bodyParser.json(), addToCart);
router.get('/get-cart', getCart);
router.delete('/delete-from-cart/:userId/:itemId', deleteFromCart);
router.post('/create-checkout-session', bodyParser.json(), createCheckoutSession);
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), handlePaymentSuccess);

module.exports = router;
