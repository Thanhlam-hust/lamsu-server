const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { verifyToken } = require('../../middleware/auth.middleware.js');

router.post('/register',
    /* 
       #swagger.tags = ['Auth']
       #swagger.summary = 'Đăng ký tài khoản (Phân quyền động)'
       #swagger.description = '
            Hệ thống phân quyền khi tạo tài khoản:
            - **Không có Token (Chưa đăng nhập)**: Mặc định tạo tài khoản **Admin root**. Không yêu cầu truyền `branchId` và `role`.
            - **Có Token (Đã đăng nhập)**: 
                - Bắt buộc phải có `branchId` (để gán user vào chi nhánh).
                - **Admin**: Được tạo tài khoản `manager`, `staff`, `guest`. (Không được tạo thêm Admin).
                - **Manager**: Được tạo tài khoản `staff`, `guest`. (Không được tạo Admin hoặc Manager khác).
                - Các role khác không có quyền truy cập.
            - Nếu tạo tài khoản `manager`, hệ thống sẽ tự động gán `managerId` ngược lại cho bảng Branch.
       '
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['body'] = {
           in: 'body',
           description: 'Thông tin tài khoản mới',
           required: true,
           schema: {
               email: 'newuser@gmail.com',
               password: 'password123',
               displayName: 'Người Dùng Mới',
               numberPhone: '0123456789',
               role: 'manager',
               branchId: '6ab5d6fe8d203b981e5b22d6'
           }
       }
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

router.post('/refresh-token',
    /*
       #swagger.tags = ['Auth']
    */
    authController.refreshToken
);

module.exports = router;
