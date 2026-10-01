const staffService = require('./staff.service');
const { SuccessResponse } = require('../../core/success.response');
const { BadRequestError } = require('../../core/error.response');
const K = require('../../common/k');
const Auth = require('../../models/auth.model');

// Helper function để lấy branchId nếu là manager, và check quyền
const checkRoleAndGetBranchId = async (requester) => {
    if (requester.role === 'admin') {
        return null; // Admin full quyền
    } else if (requester.role === 'manager') {
        const user = await Auth.findById(requester.idUser);
        if (!user || !user.branchId) {
            throw new BadRequestError({
                message: 'Quản lý này chưa được gán vào chi nhánh nào.',
                code: K.CODE_UNAUTHORIZED_ACTION
            });
        }
        return user.branchId;
    } else {
        throw new BadRequestError({
            message: 'Bạn không có quyền thực hiện hành động này.',
            code: K.CODE_UNAUTHORIZED_ACTION
        });
    }
};

const createStaff = async (req, res, next) => {
    try {
        const managerBranchId = await checkRoleAndGetBranchId(req.user);
        const payload = req.body;

        if (managerBranchId) {
            // Manager bắt buộc tạo nhân sự vào nhánh của mình
            payload.branchId = managerBranchId;
        } else if (!payload.branchId) {
            throw new BadRequestError({
                message: 'Vui lòng cung cấp branchId.',
                code: K.CODE_MISSING_DATA
            });
        }

        if (!payload.fullName || !payload.numberPhone) {
            throw new BadRequestError({
                message: 'Vui lòng cung cấp đầy đủ họ tên và số điện thoại.',
                code: K.CODE_MISSING_DATA
            });
        }

        const newStaff = await staffService.createStaff(payload);
        new SuccessResponse({
            message: 'Thêm nhân sự thành công',
            data: newStaff
        }).send(res);
    } catch (error) {
        next(error);
    }
};

const updateStaff = async (req, res, next) => {
    try {
        const managerBranchId = await checkRoleAndGetBranchId(req.user);
        const { id } = req.params;
        const payload = req.body;

        if (managerBranchId && payload.branchId && payload.branchId.toString() !== managerBranchId.toString()) {
            throw new BadRequestError({
                message: 'Bạn không có quyền chuyển nhân sự sang chi nhánh khác.',
                code: K.CODE_UNAUTHORIZED_ACTION
            });
        }

        const updatedStaff = await staffService.updateStaff(id, payload, managerBranchId);
        new SuccessResponse({
            message: 'Cập nhật thông tin nhân sự thành công',
            data: updatedStaff
        }).send(res);
    } catch (error) {
        next(error);
    }
};

const updateStaffStatus = async (req, res, next) => {
    try {
        const managerBranchId = await checkRoleAndGetBranchId(req.user);
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'inactive', 'resigned'].includes(status)) {
            throw new BadRequestError({ message: 'Trạng thái không hợp lệ (chỉ được phép: active, inactive, resigned).' });
        }

        const updatedStaff = await staffService.updateStaffStatus(id, status, managerBranchId);
        new SuccessResponse({
            message: 'Cập nhật trạng thái thành công',
            data: updatedStaff
        }).send(res);
    } catch (error) {
        next(error);
    }
};

const getStaffs = async (req, res, next) => {
    try {
        const managerBranchId = await checkRoleAndGetBranchId(req.user);
        
        // Lấy tất cả query parameters để build filter
        let filter = { ...req.query };

        // Nếu là manager thì ép cứng phải lấy nhánh của họ
        if (managerBranchId) {
            filter.branchId = managerBranchId;
        }

        const staffs = await staffService.getStaffs(filter);
        new SuccessResponse({
            message: 'Lấy danh sách nhân sự thành công',
            data: staffs
        }).send(res);
    } catch (error) {
        next(error);
    }
};

const getStaffPositions = (req, res, next) => {
    try {
        const positions = [
            { id: 'waiter', name: 'Phục vụ' },
            { id: 'cashier', name: 'Thu ngân' },
            { id: 'chef', name: 'Bếp' }
        ];
        
        new SuccessResponse({
            message: 'Lấy danh sách vị trí nhân sự thành công',
            data: positions
        }).send(res);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createStaff,
    updateStaff,
    updateStaffStatus,
    getStaffs,
    getStaffPositions
};
