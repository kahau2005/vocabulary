const express = require('express');
const authController = require('../app/controllers/authController');
const router = express.Router();

router.post('/login', authController.signIn);
router.post('/register', authController.register);

module.exports = router;