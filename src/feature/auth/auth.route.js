const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

router.post('/register', 
    /* 
       #swagger.tags = ['Auth']
       #swagger.summary = 'Đăng ký tài khoản'
       #swagger.responses[200] = {
           description: 'Đăng ký thành công',
           schema: { $ref: '#/definitions/RegisterResponse' }
       }
    */
    authController.register
);

router.post('/login',
    /* 
       #swagger.tags = ['Auth']
       #swagger.summary = 'Đăng nhập'
       #swagger.responses[200] = {
           description: 'Đăng nhập thành công',
           schema: { $ref: '#/definitions/LoginResponse' }
       }
    */
    authController.login
);

module.exports = router;
