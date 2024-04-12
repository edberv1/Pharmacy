const express = require('express');
const router = express.Router();
const { signup, loginUser, getLoginUser} = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', loginUser);
router.get('/login', getLoginUser)


module.exports = router;
