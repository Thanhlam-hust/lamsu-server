const express = require('express');
const router = express.Router();
const branchController = require('./branch.controller');
const { verifyToken } = require('../../middleware/auth.middleware');

router.post('/', verifyToken,
    /* 
       #swagger.tags = ['Branch']
       #swagger.summary = 'Tạo chi nhánh mới'
       #swagger.description = 'Chỉ có Admin mới có quyền tạo chi nhánh mới.'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.responses[200] = {
           description: 'Tạo thành công',
           schema: { $ref: '#/definitions/BranchResponse' }
       }
    */
    branchController.createBranch
);

router.get('/', verifyToken,
    /* 
       #swagger.tags = ['Branch']
       #swagger.summary = 'Lấy danh sách chi nhánh'
       #swagger.description = 'Lấy danh sách tất cả các chi nhánh. Có thể lọc theo trạng thái hoạt động.'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['status'] = {
           in: 'query',
           description: 'Lọc theo trạng thái (active/inactive)',
           type: 'string'
       }
       #swagger.responses[200] = {
           description: 'Lấy thành công',
           schema: { $ref: '#/definitions/BranchListResponse' }
       }
    */
    branchController.getAllBranches
);

router.put('/:id', verifyToken,
    /* 
       #swagger.tags = ['Branch']
       #swagger.summary = 'Cập nhật chi nhánh (Bao gồm enable/disable)'
       #swagger.description = 'Admin có toàn quyền chỉnh sửa bất kỳ chi nhánh nào. Manager chỉ có quyền chỉnh sửa (hoặc disable) chi nhánh của chính mình.'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.responses[200] = {
           description: 'Cập nhật thành công',
           schema: { $ref: '#/definitions/BranchResponse' }
       }
    */
    branchController.updateBranch
);

router.put('/:id/status', verifyToken,
    /* 
       #swagger.tags = ['Branch']
       #swagger.summary = 'Cập nhật trạng thái chi nhánh (active/inactive)'
       #swagger.description = 'Admin hoặc Manager của chính chi nhánh đó mới có quyền. Khi đổi trạng thái, toàn bộ nhân viên/quản lý trong chi nhánh cũng sẽ bị đổi trạng thái theo.'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['body'] = {
           in: 'body',
           required: true,
           schema: {
               status: 'inactive'
           }
       }
       #swagger.responses[200] = {
           description: 'Cập nhật thành công',
           schema: { $ref: '#/definitions/BranchResponse' }
       }
    */
    branchController.updateBranchStatus
);

module.exports = router;
