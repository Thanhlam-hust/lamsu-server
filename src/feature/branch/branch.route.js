const express = require('express');
const router = express.Router();
const branchController = require('./branch.controller');
const { verifyToken } = require('../../middleware/auth.middleware');

router.post('/', verifyToken,
    /* 
       #swagger.tags = ['Branch']
       #swagger.summary = 'Tạo chi nhánh mới'
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
       #swagger.security = [{ "bearerAuth": [] }]
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
       #swagger.summary = 'Cập nhật chi nhánh'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.responses[200] = {
           description: 'Cập nhật thành công',
           schema: { $ref: '#/definitions/BranchResponse' }
       }
    */
    branchController.updateBranch
);

router.delete('/:id', verifyToken,
    /* 
       #swagger.tags = ['Branch']
       #swagger.summary = 'Xóa chi nhánh'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.responses[200] = {
           description: 'Xóa thành công',
           schema: {
               status: 'success',
               message: 'Xoá chi nhánh thành công'
           }
       }
    */
    branchController.deleteBranch
);

module.exports = router;
