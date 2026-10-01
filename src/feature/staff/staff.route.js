const express = require('express');
const router = express.Router();
const staffController = require('./staff.controller');
const { verifyToken } = require('../../middleware/auth.middleware');

router.get('/', verifyToken,
    /* 
       #swagger.tags = ['Staff']
       #swagger.summary = 'Lấy danh sách nhân viên'
       #swagger.description = 'Admin xem tất cả. Manager chỉ xem nhân viên của chi nhánh mình. Có thể filter qua query (vd: ?status=active&position=waiter)'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['branchId'] = { in: 'query', description: 'Lọc theo ID chi nhánh (dành cho Admin)', type: 'string' }
       #swagger.parameters['status'] = { in: 'query', description: 'Lọc theo trạng thái (active, inactive, resigned)', type: 'string' }
       #swagger.parameters['position'] = { in: 'query', description: 'Lọc theo vị trí (waiter, cashier, chef)', type: 'string' }
       #swagger.responses[200] = {
           description: 'Lấy thành công',
           schema: {
               status: 'success',
               message: 'Lấy danh sách nhân sự thành công',
               data: [{
                   _id: "6ab...",
                   fullName: "Nguyễn Văn A",
                   numberPhone: "0987654321",
                   email: "a@gmail.com",
                   branchId: "6ab...",
                   position: "waiter",
                   salary: 5000000,
                   hireDate: "2024-01-01T00:00:00.000Z",
                   cccd: "012345678910",
                   address: "Hà Nội",
                   dateOfBirth: "1999-01-01T00:00:00.000Z",
                   status: "active",
                   notes: "Nhân viên chăm chỉ"
               }]
           }
       }
    */
    staffController.getStaffs
);

router.get('/positions', verifyToken,
    /* 
       #swagger.tags = ['Staff']
       #swagger.summary = 'Lấy danh sách các vị trí công việc'
       #swagger.description = 'Trả về danh sách 3 vị trí công việc cố định của nhân viên (Phục vụ, Thu ngân, Bếp)'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.responses[200] = {
           description: 'Lấy thành công',
           schema: {
               status: 'success',
               message: 'Lấy danh sách vị trí nhân sự thành công',
               data: [
                   { id: 'waiter', name: 'Phục vụ' },
                   { id: 'cashier', name: 'Thu ngân' },
                   { id: 'chef', name: 'Bếp' }
               ]
           }
       }
    */
    staffController.getStaffPositions
);

router.post('/', verifyToken,
    /* 
       #swagger.tags = ['Staff']
       #swagger.summary = 'Thêm mới nhân viên'
       #swagger.description = 'Admin tạo được mọi chi nhánh. Manager tạo tự động gán vào chi nhánh đang quản lý.'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['body'] = {
           in: 'body',
           required: true,
           schema: {
               fullName: "Nguyễn Văn A",
               numberPhone: "0987654321",
               email: "a@gmail.com",
               branchId: "6ab...",
               position: "waiter",
               salary: 5000000,
               hireDate: "2024-01-01T00:00:00.000Z",
               cccd: "012345678910",
               address: "Hà Nội",
               dateOfBirth: "1999-01-01T00:00:00.000Z",
               status: "active",
               notes: "Nhân viên mới"
           }
       }
       #swagger.responses[200] = {
           description: 'Thêm thành công'
       }
    */
    staffController.createStaff
);

router.put('/:id', verifyToken,
    /* 
       #swagger.tags = ['Staff']
       #swagger.summary = 'Cập nhật thông tin nhân viên'
       #swagger.description = 'Admin sửa mọi nhân sự. Manager chỉ sửa được nhân sự ở chi nhánh mình.'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['body'] = {
           in: 'body',
           required: true,
           schema: {
               fullName: "Nguyễn Văn A (Updated)",
               numberPhone: "0987654321",
               email: "a_update@gmail.com",
               branchId: "6ab...",
               position: "cashier",
               salary: 6000000,
               hireDate: "2024-01-01T00:00:00.000Z",
               cccd: "012345678910",
               address: "Hà Nội",
               dateOfBirth: "1999-01-01T00:00:00.000Z",
               status: "active",
               notes: "Đã thăng chức"
           }
       }
       #swagger.responses[200] = {
           description: 'Sửa thành công'
       }
    */
    staffController.updateStaff
);

router.put('/:id/status', verifyToken,
    /* 
       #swagger.tags = ['Staff']
       #swagger.summary = 'Đổi trạng thái làm việc (active, inactive, resigned)'
       #swagger.description = 'Admin đổi mọi trạng thái. Manager chỉ đổi của nhân viên chi nhánh mình.'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['body'] = {
           in: 'body',
           required: true,
           schema: {
               status: 'inactive'
           }
       }
       #swagger.responses[200] = {
           description: 'Thành công'
       }
    */
    staffController.updateStaffStatus
);

module.exports = router;
