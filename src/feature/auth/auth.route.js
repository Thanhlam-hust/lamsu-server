const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { verifyToken } = require('../../middleware/auth.middleware');

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

router.put('/update-information/:id', verifyToken,
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

router.post('/refresh-token',
    /* 
       #swagger.tags = ['Auth']     
    */
    authController.refreshToken
);

module.exports = router;
