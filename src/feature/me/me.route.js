const express = require('express');
const router = express.Router();
const meController = require('./me.controller');
const { verifyToken } = require('../../middleware/auth.middleware');

router.get('/',
    verifyToken,
    /* 
       #swagger.tags = ['Me']
       #swagger.summary = 'Lấy thông tin cá nhân'
    */
    meController.getInformation
);

router.put('/',
    verifyToken,
    /* 
       #swagger.tags = ['Me']
       #swagger.summary = 'Cập nhật thông tin cá nhân'
    */
    meController.updateInformation
);

router.put('/change-password',
    verifyToken,
    /* 
       #swagger.tags = ['Me']
       #swagger.summary = 'Đổi mật khẩu cá nhân'
    */
    meController.changePassword
);

module.exports = router;
