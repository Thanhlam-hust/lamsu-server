const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { verifyToken } = require('../../middleware/auth.middleware.js');

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


router.post('/reset-password',
    /* 
       #swagger.tags = ['Auth']
       #swagger.summary = 'Đặt lại mật khẩu'
       #swagger.responses[200] = {
           description: 'Đặt lại mật khẩu thành công'
       }
    */
    authController.resetPassword
);

module.exports = router;
