const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middlewares/authMiddleware');

router.get("/admin",  authMiddleware);

module.exports = router;
