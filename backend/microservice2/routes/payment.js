const express = require('express');
const router = express.Router();
const {addToCart, getCart } = require('../controllers/paymentController');

router.post('/add-to-cart', addToCart);
router.get('/get-cart/:userId', getCart);


module.exports = router;