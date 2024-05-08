const express = require('express');
const router = express.Router();
const { signup, loginUser, getLoginUser, logoutUser} = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', loginUser);
router.get('/login', getLoginUser)
router.get('/logoutUser', logoutUser)

module.exports = router;
