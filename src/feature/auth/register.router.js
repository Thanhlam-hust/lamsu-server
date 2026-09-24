const express = require('express');
const router = express.Router();
const { registerAdmin } = require('./register.controller');

router.post('/register-admin', registerAdmin);

module.exports = router;
