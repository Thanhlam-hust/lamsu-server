const express = require('express');
const router = express.Router();
const { registerAdmin } = require('./register.controller');

// Đăng ký Endpoint: POST /api/auth/register-admin
router.post('/register-admin', registerAdmin);

module.exports = router;
