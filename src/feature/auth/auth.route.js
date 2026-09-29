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

router.get('/me',
    verifyToken,
    /* 
       #swagger.tags = ['Auth']
       #swagger.summary = 'Lấy thông tin tài khoản đăng nhập'
       #swagger.responses[200] = {
           description: 'Lấy thông tin thành công',
           schema: { $ref: '#/definitions/InformationResponse' }
       }
    */
    authController.getInformation
);

router.put('/me',
    verifyToken,
    /* 
       #swagger.tags = ['Auth']
       #swagger.summary = 'Cập nhật thông tin tài khoản'
       #swagger.responses[200] = {
           description: 'Cập nhật thông tin thành công',
           schema: { $ref: '#/definitions/UpdateInformationResponse' }
       }
    */
    authController.updateInformation
);

router.put('/me/change-password',
    verifyToken,
    /* 
       #swagger.tags = ['Auth']
       #swagger.summary = 'Đổi mật khẩu'
       #swagger.responses[200] = {
           description: 'Đổi mật khẩu thành công'
       }
    */
    authController.changePassword
);

module.exports = router;
